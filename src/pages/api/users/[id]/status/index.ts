import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getUser } from "@/backend/services/users";
import { models } from "@/backend/mongo/models";
import isArray from "lodash/isArray";
import mongoose from "mongoose";

const router = createRouter<any, any>();

// Add middleware to log all requests
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  console.log("Status endpoint - Request received:", {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });
  next();
});

router.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { id } = req.query;
    const { status } = req.body;

    console.log("Status update request:", {
      id,
      status,
      body: req.body,
      method: req.method,
      headers: req.headers["content-type"],
    });

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!status) {
      console.error("Status is missing from request body");
      return res.status(400).json({
        error: "Status is required in request body",
      });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      console.error("Invalid status value:", status);
      return res.status(400).json({
        error: `Status must be one of: 'pending', 'approved', or 'rejected'. Received: ${status}`,
      });
    }

    const userId = isArray(id) ? id[0] : id;

    // Check if user exists
    const existingUser = await getUser(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the user first to check current status
    const userBeforeUpdate = await models.Users.findById(userId).lean();
    console.log("User before update:", {
      userId,
      currentStatus: userBeforeUpdate?.status,
      newStatus: status,
      hasStatusField: userBeforeUpdate?.hasOwnProperty("status"),
    });

    // Use native MongoDB collection to bypass Mongoose schema restrictions
    // This ensures the field is created even if it doesn't exist in the document
    const collection = models.Users.collection;
    const objectId = new mongoose.Types.ObjectId(userId);

    // Use native MongoDB findOneAndUpdate to directly update the document
    // This returns the updated document immediately
    const nativeUpdateResult = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status: status } },
      { returnDocument: "after" } // Return the updated document
    );

    console.log("Native MongoDB update result:", {
      matched: nativeUpdateResult !== null,
      statusInResult: nativeUpdateResult?.status,
      expectedStatus: status,
      fullDocument: nativeUpdateResult
        ? JSON.stringify(nativeUpdateResult, null, 2)
        : null,
    });

    if (!nativeUpdateResult) {
      return res.status(404).json({ error: "User not found" });
    }

    // Wait a bit to ensure the update is committed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the status was saved by fetching from database again using native MongoDB
    const verifyUserNative = await collection.findOne({ _id: objectId });
    console.log("Verified user status from DB (native):", {
      userId,
      statusInDB: verifyUserNative?.status,
      expectedStatus: status,
      match: verifyUserNative?.status === status,
    });

    // Also verify using Mongoose
    const verifyUserMongoose = await models.Users.findById(userId).lean();
    console.log("Verified user status from DB (Mongoose):", {
      userId,
      statusInDB: verifyUserMongoose?.status,
      expectedStatus: status,
      match: verifyUserMongoose?.status === status,
    });

    // If status still doesn't match, there's a problem
    if (verifyUserNative?.status !== status) {
      console.error(
        "Status was not saved correctly even after native MongoDB update!"
      );
      console.error("Expected:", status);
      console.error("Got from native:", verifyUserNative?.status);
      console.error("Got from Mongoose:", verifyUserMongoose?.status);
      return res.status(500).json({
        error: "Status was not saved correctly. Please try again.",
      });
    }

    // Fetch the updated user using Mongoose with lean() to get the raw document
    const updatedUser = await models.Users.findById(userId).lean();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found after update" });
    }

    // Log for debugging
    console.log("Updated user status:", {
      userId,
      status,
      updatedUser: {
        _id: updatedUser._id,
        status: updatedUser.status,
        email: updatedUser.email,
      },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user status:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error details:", {
      message: error?.message,
      name: error?.name,
      code: error?.code,
    });
    res.status(400).json({
      error: error?.message || "Failed to update user status",
      details: error?.stack,
    });
  }
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default router.handler({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error("API Error in router handler:", err);
    console.error("Error stack:", err.stack);
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal Server Error",
      details: err.stack,
    });
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});
