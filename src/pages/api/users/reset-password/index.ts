import Cookies from "cookies";
import { connectDB } from "@/backend/db/connect";
import {
  getUserByEmail,
  updateUser,
  getUserPackages,
} from "@/backend/services/users";
import { getAdminByEmail, updateAdmin } from "@/backend/services/admins";
import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "@/backend/middlewares/jose";

const secret = process.env.JWT_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { email, password, type, id } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    switch (req.method) {
      case "POST":
        // Check for user or admin by email and return type only
        const user = await getUserByEmail(email);
        if (user) {
          return res.status(200).json({ type: "user", id: user._id });
        }

        const admin = await getAdminByEmail(email);
        if (admin) {
          return res.status(200).json({ type: "admin", id: admin._id });
        }

        return res
          .status(404)
          .json({ message: "No user found with this email" });

      case "PUT":
        if (!password || !type) {
          return res
            .status(400)
            .json({ message: "Email, password, and type are required" });
        }

        if (type === "user") {
          const updatedUser = await updateUser(id, { password });
          if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
          }
          if (secret && updatedUser && updatedUser.packages) {
            const fetchedPackages = await getUserPackages(updatedUser._id);
            const packages = fetchedPackages?.filter((pkg) => pkg.active);
            const coursesArray = packages?.map((p) => p.packageInfo?.courses);
            const courses = coursesArray?.flat();
            const token = await sign(
              {
                id: updatedUser._id,
                admin: false,
                courses: courses ? courses : [],
              },
              secret
            );
            const cookies = Cookies(req, res);
            cookies.set("token", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
              sameSite: "strict",
            });
            return res.status(200).json({
              message: "User password updated successfully",
              data: updatedUser,
            });
          }
        }

        if (type === "admin") {
          const updatedAdmin = await updateAdmin(id, { password });
          if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
          }
          if (secret && updatedAdmin) {
            const token = await sign(
              {
                id: updatedAdmin._id,
                admin: true,
                role: updatedAdmin.role,
                excludedModules: updatedAdmin.excludedModules,
              },
              secret
            );
            const cookies = Cookies(req, res);
            cookies.set("token", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
              sameSite: "strict",
            });
            return res.status(200).json({
              message: "Admin password updated successfully",
              data: updatedAdmin,
            });
          }
        }

        return res.status(400).json({ message: "Invalid user type" });

      default:
        res.setHeader("Allow", ["POST", "PUT"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default handler;
