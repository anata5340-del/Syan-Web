import mongoose from "mongoose";
import { Settings } from "@/backend/types/settings";

let settingsModel: mongoose.Model<Settings>;

if (mongoose.models.settings) {
  settingsModel = mongoose.model<Settings>("settings");
} else {
  const SettingsSchema = new mongoose.Schema(
    {
      imageName: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      promotionLink: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  settingsModel = mongoose.model<Settings>("settings", SettingsSchema);
}

export default settingsModel;
