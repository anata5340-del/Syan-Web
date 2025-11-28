import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail } from "@/backend/services/users";
import { createRouter } from "next-connect";

const router = createRouter<any, any>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if a user with the provided email already exists
    const user = await getUserByEmail(email);

    // Respond with availability status
    if (user) {
      return res.status(200).json({ available: false }); // Email is already in use
    } else {
      return res.status(200).json({ available: true }); // Email is available
    }
  } catch (error) {
    console.error("Error checking email availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router.handler();
