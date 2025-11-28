export type VideoContent = {
  contentId: string; // Unique ID for the content in the video
  completed: boolean; // Indicates if the content was completed
};

export type VideoStatus = {
  _id: string;
  userId: string;
  videoId: string; // Reference to the video
  videoName: string;
  content: VideoContent[]; // Array of content objects with completion status
};
