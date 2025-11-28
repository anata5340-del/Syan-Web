import { models } from "@/backend/mongo/models";
import { UserPayload } from "@/backend/types";
import mongoose from "mongoose";
import { User as UserType } from "@/backend/types/user";
import { Package as PackageType } from "@/backend/types/package";

const startDisplayId = 1000; // Starting number for SU IDs
const prefix = "SU"; // Prefix for user displayId

interface UserPackage {
  package: mongoose.Types.ObjectId;
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
  _id: mongoose.Types.ObjectId;
}
interface FullUserPackage extends UserPackage {
  packageInfo?: PackageType;
}

// Function to recalculate and assign sequential displayIds to users
const updateDisplayIds = async () => {
  try {
    // Fetch all users sorted by creation date
    const users = await models.Users.find({}).sort({ createdAt: 1 });

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const newDisplayId = `${prefix}-${startDisplayId + i}`;

      // Only update if the displayId has changed
      if (user.displayId !== newDisplayId) {
        await models.Users.updateOne(
          { _id: user._id },
          { $set: { displayId: newDisplayId } }
        );
      }
    }

    console.log("User display IDs updated successfully!");
  } catch (error) {
    console.error("Error updating user display IDs:", error);
  }
};

// Retrieve a single user
export const getUser = async (id: string) => {
  const userData = await models.Users.findById(id).lean().exec();
  let userPackages = userData.packages;
  let updatedPackages = [];
  for (const packagee of userPackages) {
    const packageData = await models.Packages.findById(packagee._id)
      .lean()
      .exec();
    updatedPackages.push({
      ...packagee,
      name: packageData?.name,
      displayId: packageData?.displayId,
    });
  }
  return { ...userData, packages: updatedPackages };
};

// Retrieve all users
export const getUsers = () => models.Users.find().lean();

export const getUserByEmail = (email: string) =>
  models.Users.findOne({ email: email }).lean();

// Create a new user
export const createUser = async (data: UserPayload) => {
  try {
    // Ensure status is set to "pending" for new users if not provided
    if (!data.status) {
      data.status = "pending";
    }
    
    console.log("Creating user with data:", {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      status: data.status,
    });
    
    const newUser = await models.Users.create(data);
    console.log("User created in database:", {
      _id: newUser._id,
      email: newUser.email,
      status: newUser.status,
    });
    
    // Recalculate displayIds after adding a new user
    await updateDisplayIds();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    console.error("Error stack:", error?.stack);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (id: string, data: UserPayload) => {
  try {
    const updatedUser = await models.Users.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    // Optional: Ensure displayIds remain sequential after updates
    await updateDisplayIds();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: string) => {
  try {
    const deletedUser = await models.Users.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    // Recalculate displayIds after deleting a user
    await updateDisplayIds();
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Restore a deleted user
export const recoverUser = async (id: string) => {
  try {
    const restoredUser = await models.Users.findByIdAndUpdate(id, {
      isDeleted: false,
    });
    // Optional: Recalculate displayIds after restoring a user
    await updateDisplayIds();
    return restoredUser;
  } catch (error) {
    console.error("Error restoring user:", error);
    throw error;
  }
};

export const restoreUser = async (id: string) => {
  try {
    const restoredUser = await models.Users.findByIdAndUpdate(id, {
      isDeleted: false,
    });
    // Optional: Recalculate displayIds after restoring a user
    await updateDisplayIds();
    return restoredUser;
  } catch (error) {
    console.error("Error restoring user:", error);
    throw error;
  }
};

export const updateUserStatus = (id: string, data: UserPayload) =>
  models.Users.findByIdAndUpdate(id, data);

export const addUserPackages = async (id: string, data: UserPayload) => {
  const { packages } = data;
  const userData = await models.Users.findById(id);
  const userPackages = userData?.packages;
  const updatedPackages = [...userPackages, ...packages];
  return models.Users.findByIdAndUpdate(id, { packages: updatedPackages });
};

export const updateUserPackageStatus = async (
  id: string,
  data: UserPayload
) => {
  const { packageId, active } = data;
  const userData = await models.Users.findById(id).lean().exec();
  const userPackages = userData?.packages;

  const updatedPackages = userPackages?.map((p) => {
    if (packageId === p._id.toString()) {
      return { ...p, active };
    }
    return p;
  });
  return models.Users.findByIdAndUpdate(id, { packages: updatedPackages });
};

export const deleteUserPackage = async (
  id: string,
  data: { packageId: string }
) => {
  const { packageId } = data;
  const userData = await models.Users.findById(id).lean().exec();
  const userPackages = userData?.packages;

  const updatedPackages = userPackages?.filter(
    (p) => packageId !== p._id.toString()
  );
  return models.Users.findByIdAndUpdate(id, { packages: updatedPackages });
};

//price startDate endDate
export const updateUserPackage = async (id: string, data: UserPayload) => {
  const { packageId, startDate, endDate, price } = data;

  const userData = await models.Users.findById(id).lean().exec();
  const userPackages = userData?.packages;

  const updatedPackages = userPackages?.map((p) => {
    if (packageId === p._id.toString()) {
      return { ...p, startDate, endDate, price };
    }
    return p;
  });
  return models.Users.findByIdAndUpdate(id, { packages: updatedPackages });
};

export async function getUserPackages(userId: string) {
  try {
    const user = (await models.Users.findById(
      userId
    ).lean()) as UserType | null;
    if (!user) {
      throw new Error("User not found");
    }
    const allPackages = (await models.Packages.find()
      .populate("courses")
      .lean()) as PackageType[];
    if (user.packages) {
      const fullPackages = user.packages.map((userPkg) => {
        const packageInfo = allPackages.find(
          (p) => p._id.toString() === userPkg._id.toString()
        );
        return {
          ...userPkg,
          packageInfo,
        };
      });
      return fullPackages;
    }
  } catch (error) {
    console.error("Error fetching user packages:", error);
    throw error;
  }
}

// Check email availability
export const checkEmailAvailability = async (email: string) => {
  const user = await models.Users.findOne({ email }).lean().exec();
  return !user; // Returns true if email is available, false otherwise
};
