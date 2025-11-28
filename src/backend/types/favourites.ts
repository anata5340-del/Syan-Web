import { Note } from "./note";
import { Question } from "./question";
import { User } from "./user";
import { Video } from "./videos";

export type Favourites = {
  _id: string;
  user: User;
  favouriteNotes: Note[];
  favouriteVideos: Video[];
  favouriteQuestions: Question[];
};

export type FavouritesPayload = {
  favouriteNotes?: string[];
  favouriteVideos?: string[];
  favouriteQuestions?: string[];
};
