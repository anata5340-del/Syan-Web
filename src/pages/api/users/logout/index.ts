import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { verify } from "@/backend/middlewares/jose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const user = await verify(token, process.env.JWT_SECRET as string);
    if (user) {
      cookies.set("token", null, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
      res
        .status(200)
        .json({ message: "Logged out successfully", success: true });
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
