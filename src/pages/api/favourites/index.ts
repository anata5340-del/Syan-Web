import { connectDB } from "@/backend/db/connect";
import {
  addFavourites,
  deleteFavourites,
  getFavourites,
} from "@/backend/services/favourites";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "@/backend/middlewares/jose";

const secret = process.env.JWT_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    const { token } = req.cookies;

    if (!token || !secret) {
      return res
        .status(401)
        .json({ error: "Authentication token is required." });
    }

    // Verify user from the token
    const user = await verify(token, secret);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. User not found." });
    }

    switch (req.method) {
      // Fetch Favourites
      case "GET":
        try {
          const favourites = await getFavourites(user.id);
          return res.status(200).json({ favourites });
        } catch (error) {
          console.error("Error fetching favourites:", error);
          return res.status(400).json({ error: "Failed to fetch favourites." });
        }

      // Add to Favourites
      case "POST":
        try {
          // Validate payload
          const { favouriteNotes, favouriteVideos, favouriteQuizes } = req.body;
          if (!favouriteNotes && !favouriteVideos && !favouriteQuizes) {
            return res.status(400).json({
              error:
                "At least one of favouriteNotes, favouriteVideos, or favouriteQuizes is required.",
            });
          }

          const favourites = await addFavourites(user.id, req.body);
          return res.status(200).json({ favourites });
        } catch (error) {
          console.error("Error adding to favourites:", error);
          return res
            .status(400)
            .json({ error: "Failed to add to favourites." });
        }

      // Delete from Favourites
      case "DELETE":
        try {
          // Validate payload
          const { favouriteNotes, favouriteVideos, favouriteQuizes } = req.body;
          if (!favouriteNotes && !favouriteVideos && !favouriteQuizes) {
            return res.status(400).json({
              error:
                "At least one of favouriteNotes, favouriteVideos, or favouriteQuizes is required.",
            });
          }

          const favourites = await deleteFavourites(user.id, req.body);
          return res.status(200).json({ favourites });
        } catch (error) {
          console.error("Error deleting from favourites:", error);
          return res
            .status(400)
            .json({ error: "Failed to delete from favourites." });
        }

      // Handle unsupported methods
      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
