import { User } from "@/backend/types/user";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

let model: mongoose.Model<User>;

if (mongoose.models.users) {
  model = mongoose.model<User>("users");
} else {
  const UserPackagesSchema = new mongoose.Schema({
    package: {
      type: ObjectId,
      ref: "packages",
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  });

  const UsersSchema = new mongoose.Schema(
    {
      displayId: {
        type: String,
        required: false,
        unique: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      cnic: {
        type: String,
        required: true,
      },
      cnicFront: {
        type: String,
      },
      cnicBack: {
        type: String,
      },
      jobStatus: {
        type: String,
      },
      jobLocation: {
        type: String,
      },
      yearOfGraduation: {
        type: String,
      },
      institute: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      image: {
        type: String,
      },
      active: {
        type: Boolean,
        required: true,
        default: true,
      },
      packages: [UserPackagesSchema],
      isDeleted: {
        type: Boolean,
        default: false,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    { timestamps: true }
  );

  model = mongoose.model<User>("users", UsersSchema);
}

export default model;
