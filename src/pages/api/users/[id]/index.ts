import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import isArray from "lodash/isArray";
import { upload } from "@/backend/middlewares/multer/upload";
import {
  getUser,
  updateUser,
  deleteUser,
  recoverUser,
} from "@/backend/services/users";
import { updateUserValidator } from "@/backend/validators/user";

// Create the router
const router = createRouter<any, any>();

// Middleware for file upload
router.use(
  upload.fields([
    { name: "user[image]" },
    { name: "user[cnicFront]" },
    { name: "user[cnicBack]" },
  ])
);

// GET route to retrieve a user by ID
router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { id } = req.query;
    if (!id) throw new Error("Id is required");

    const user = await getUser(isArray(id) ? id[0] : id);
    if (!user) throw new Error("User not found");

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(400).json({ error: error || "Failed to fetch user" });
  }
});

// DELETE route to delete a user by ID
router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { id } = req.query;
    if (!id) throw new Error("Id is required");

    const deletedUser = await deleteUser(isArray(id) ? id[0] : id);
    res.status(200).json({ user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(400).json({ error: error || "Failed to delete user" });
  }
});

// PATCH route to recover a deleted user by ID
router.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { id } = req.query;
    if (!id) throw new Error("Id is required");

    const recoveredUser = await recoverUser(isArray(id) ? id[0] : id);
    res.status(200).json({ user: recoveredUser });
  } catch (error) {
    console.error("Error recovering user:", error);
    res.status(400).json({ error: error || "Failed to recover user" });
  }
});

router.put(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    // Parse form fields into req.body.user structure
    if (!req.body.user) {
      req.body.user = {};
    }

    // Parse user[fieldName] format into req.body.user.fieldName
    // Multer parses form fields into req.body, so we need to restructure them
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("user[")) {
        const fieldName = key.match(/user\[(.*?)\]/)?.[1];
        if (
          fieldName &&
          req.body[key] !== undefined &&
          req.body[key] !== null &&
          req.body[key] !== ""
        ) {
          req.body.user[fieldName] = req.body[key];
        }
        delete req.body[key];
      }
    });

    // Extract file paths or fallback to existing values
    if (req?.files?.["user[image]"]?.[0]?.location) {
      req.body.user.image = req.files["user[image]"][0].location;
    } else if (!req.body.user.image) {
      // Keep existing image if no new file uploaded
      req.body.user.image = req.body.user.image;
    }

    if (req?.files?.["user[cnicFront]"]?.[0]?.location) {
      req.body.user.cnicFront = req.files["user[cnicFront]"][0].location;
    } else if (!req.body.user.cnicFront) {
      req.body.user.cnicFront = req.body.user.cnicFront;
    }

    if (req?.files?.["user[cnicBack]"]?.[0]?.location) {
      req.body.user.cnicBack = req.files["user[cnicBack]"][0].location;
    } else if (!req.body.user.cnicBack) {
      req.body.user.cnicBack = req.body.user.cnicBack;
    }

    // Validate the updated data
    await updateUserValidator(req.body);

    const { id } = req.query;
    if (!id) throw new Error("Id is required");

    // Check if user exists
    const existingUser = await getUser(isArray(id) ? id[0] : id);
    if (!existingUser) throw new Error("User not found");

    // Update the user
    const updatedUser = await updateUser(
      isArray(id) ? id[0] : id,
      req.body.user
    );

    // Respond with the updated user
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({
      error: error || "Failed to update user",
    });
  }
});
// Configure body parser for Multer
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};

// Export the router as the default handler
export default router.handler({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error("API Error:", err.stack);
    res
      .status(err.statusCode || 500)
      .end(err.message || "Internal Server Error");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});
