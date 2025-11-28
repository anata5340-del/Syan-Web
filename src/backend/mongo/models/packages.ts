import { Package } from "@/backend/types/package";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<Package>;

if (mongoose.models.packages) {
  model = mongoose.model<Package>("packages");
} else {
  const CourseSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ["video", "quiz", "note"],
    },
    _id: String,
  });

  const PackagesSchema = new mongoose.Schema(
    {
      displayId: {
        type: String,
        required: false,
        unique: true,
      },
      name: {
        type: String,
        required: true,
        unique: true,
      },
      // price: {
      //   type: Number,
      //   required: true,
      // },
      active: {
        type: Boolean,
        required: true,
      },
      courses: [CourseSchema],
    },
    { timestamps: true }
  );

  model = mongoose.model<Package>("packages", PackagesSchema);
}

export default model;
