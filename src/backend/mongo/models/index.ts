import QuestionsModel from "./questions";
import CategoriesModel from "./categories";
import UsersModel from "./users";
import QuizesModel from "./quizes";
import CoursesModel from "./courses";
import NotesModel from "./notes";
import PackagesModel from "./packages";
import VideosModel from "./videos";
import VideoCoursesModel from "./videoCourses";
import FavouritesModel from "./favourites";
import QuestionStatus from "./questionStatus";
import NoteStatus from "./noteStatus";
import VideoStatus from "./videoStatus";
import QuizStatus from "./quizStatus";
import settingsModel from "./settings";
import AdminsModel from "./admins";

export const models = {
  Questions: QuestionsModel,
  Categories: CategoriesModel,
  Admins: AdminsModel,
  Users: UsersModel,
  Quizes: QuizesModel,
  Courses: CoursesModel,
  Settings: settingsModel,
  Notes: NotesModel,
  Packages: PackagesModel,
  QuestionStatus: QuestionStatus,
  QuizStatus: QuizStatus,
  NoteStatus: NoteStatus,
  VideoStatus: VideoStatus,
  Videos: VideosModel,
  VideoCourses: VideoCoursesModel,
  Favourites: FavouritesModel,
};
