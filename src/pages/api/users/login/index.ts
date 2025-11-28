import Cookies from "cookies";
import { connectDB } from "@/backend/db/connect";
import { getUserByEmail, getUserPackages } from "@/backend/services/users";
import { getAdminByEmail } from "@/backend/services/admins";
import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "@/backend/middlewares/jose";
import { User } from "@/backend/types";

const secret = process.env.JWT_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    switch (req.method) {
      case "POST":
        try {
          const { email, password } = req.body;
          const user = (await getUserByEmail(email)) as User;

          // Log user status for debugging
          console.log("Login attempt - User status check:", {
            email,
            userId: user?._id,
            status: user?.status,
            statusType: typeof user?.status,
            hasStatus: user?.hasOwnProperty?.("status"),
          });

          if (!user) {
            const admin = await getAdminByEmail(email);
            if (admin?.password !== password) {
              res.status(403).json({ message: "invalid credentials" });
              return;
            }
            if (secret) {
              const token = await sign(
                {
                  id: admin._id,
                  admin: true,
                  role: admin.role,
                  excludedModules: admin.excludedModules,
                },
                secret
              );
              const cookies = Cookies(req, res);
              cookies.set("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "strict",
              });
              res.status(200).json({ admin, token });
            }
            return;
          }
          if (!user || !user.active) {
            res.status(404).json({ message: "User account does not exist" });
            return;
          }
          if (user?.password !== password) {
            res.status(403).json({ message: "invalid credentials" });
            return;
          }

          // Check user status from database
          // If status is undefined, treat it as "pending" (for old users without status field)
          const userStatus = user.status || "pending";

          // Log status check for debugging
          console.log("Login status check:", {
            email,
            userId: user._id,
            userStatus,
            originalStatus: user.status,
            isApproved: userStatus === "approved",
          });

          // Check if user is approved
          if (userStatus === "pending") {
            res.status(403).json({
              message:
                "Your account is under review. We will let you know shortly.",
            });
            return;
          }
          if (userStatus === "rejected") {
            res.status(403).json({
              message:
                "Your account has been rejected. Please contact support.",
            });
            return;
          }
          if (userStatus !== "approved") {
            res.status(403).json({
              message:
                "Your account is not approved yet. Please wait for approval.",
            });
            return;
          }
          if (user && secret && user.packages) {
            const fetchedPackages = await getUserPackages(user._id);
            const packages = fetchedPackages?.filter((pkg) => pkg.active);
            const coursesArray = packages?.map((p) => p.packageInfo?.courses);
            const courses = coursesArray?.flat();
            const token = await sign(
              { id: user._id, admin: false, courses: courses ? courses : [] },
              secret
            );
            const cookies = Cookies(req, res);
            cookies.set("token", token, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
              sameSite: "strict",
            });
            res.status(200).json({ user, token });
          }
        } catch (error) {
          res.status(400).json({ error });
        }
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export default handler;
