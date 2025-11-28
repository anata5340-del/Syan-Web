import { Category } from "@/backend/types";
import mongoose from "mongoose";

let model: mongoose.Model<Category>;

if (mongoose.models.categories) {
  model = mongoose.model<Category>("categories");
} else {
  const CategoriesSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<Category>("categories", CategoriesSchema);
}

export default model;
