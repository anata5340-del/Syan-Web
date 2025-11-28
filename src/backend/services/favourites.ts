import { models } from "@/backend/mongo/models";
import { FavouritesPayload } from "@/backend/types";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

// Fetch Favourites
export const getFavourites = async (userId: string) => {
  const favourites = await models.Favourites.findOne({
    user: userId,
  })
    .populate("favouriteNotes.note")
    .populate("favouriteVideos.video");

  if (!favourites) {
    return {
      favouriteNotes: [],
      favouriteVideos: [],
      favouriteQuizes: [], // Updated key
    };
  }
  return favourites;
};

// Add Favourites
export const addFavourites = async (
  userId: string,
  data: FavouritesPayload
) => {
  let favourites = await models.Favourites.findOne({
    user: userId,
  });

  // If no favourites exist for the user, create a new entry
  if (!favourites) {
    await models.Favourites.create({
      user: userId,
      favouriteNotes: data.favouriteNotes?.map((note) => ({
        note: note._id,
        url: note.url,
      })),
      favouriteVideos: data.favouriteVideos?.map((video) => ({
        video: video._id,
        url: video.url,
      })),
      favouriteQuizes: data.favouriteQuizes?.map((quiz) => ({
        quizName: quiz.quizName,
        url: quiz.url,
      })),
    });

    favourites = await models.Favourites.findOne({
      user: userId,
    })
      .populate("favouriteNotes.note")
      .populate("favouriteVideos.video");

    return favourites;
  } else {
    // Update existing favourites by pushing new entries
    return models.Favourites.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          favouriteNotes: data.favouriteNotes?.map((note) => ({
            note: note._id,
            url: note.url,
          })),
          favouriteVideos: data.favouriteVideos?.map((video) => ({
            video: video._id,
            url: video.url,
          })),
          favouriteQuizes: data.favouriteQuizes?.map((quiz) => ({
            quizName: quiz.quizName,
            url: quiz.url,
          })),
        },
      },
      { new: true, upsert: true }
    )
      .populate("favouriteNotes.note")
      .populate("favouriteVideos.video");
  }
};

// Delete Favourites
export const deleteFavourites = async (
  userId: string,
  data: FavouritesPayload
) => {
  const favourites = await models.Favourites.findOne({ user: userId })
    .populate("favouriteNotes.note")
    .populate("favouriteVideos.video");

  if (!favourites) {
    return {
      favouriteNotes: [],
      favouriteVideos: [],
      favouriteQuizes: [],
    };
  }

  // Filter out the entries to be deleted
  if (favourites?.favouriteNotes) {
    favourites.favouriteNotes = favourites.favouriteNotes.filter(
      (note) =>
        !data.favouriteNotes?.find(
          (noteToDelete) => noteToDelete._id === note.note._id.toString()
        )
    );
  }
  if (favourites?.favouriteVideos) {
    favourites.favouriteVideos = favourites.favouriteVideos.filter(
      (video) =>
        !data.favouriteVideos?.find(
          (videoToDelete) => videoToDelete._id === video.video._id.toString()
        )
    );
  }
  if (favourites?.favouriteQuizes) {
    favourites.favouriteQuizes = favourites.favouriteQuizes.filter(
      (quiz) =>
        !data.favouriteQuizes?.find(
          (quizToDelete) => quizToDelete.quiz_id === quiz.quiz_id
        )
    );
  }

  // Save the updated favourites
  const updatedFavourites = await favourites.save();

  return updatedFavourites;
};
