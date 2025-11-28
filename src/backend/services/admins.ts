import { models } from "../mongo/models";

// Fetch all subadmins
export const getSubAdmins = async () => {
  try {
    const subAdmins = await models.Admins.find({ role: "subadmin" }).lean();
    return subAdmins;
  } catch (error) {
    throw new Error(`Error fetching subadmins: ${error.message}`);
  }
};

// Fetch a single admin (superadmin or subadmin) by ID
export const getAdminByEmail = async (email) => {
  try {
    const admin = await models.Admins.findOne({ email: email });
    if (!admin) throw new Error("Admin not found");
    return admin;
  } catch (error) {
    console.error(`Error fetching admin: ${error.message}`);
  }
};

// Create a new subadmin
export const createSubAdmin = async (data) => {
  try {
    const newSubAdmin = await models.Admins.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: "subadmin",
      excludedModules: data.excludedModules || [],
    });
    return newSubAdmin;
  } catch (error) {
    throw new Error(`Error creating subadmin: ${error.message}`);
  }
};

// Update an admin (superadmin or subadmin)
export const updateAdmin = async (adminId, data) => {
  try {
    const updatedAdmin = await models.Admins.findByIdAndUpdate(
      adminId,
      { $set: data },
      { new: true }
    );
    if (!updatedAdmin) throw new Error("Admin not found");
    return updatedAdmin;
  } catch (error) {
    throw new Error(`Error updating admin: ${error.message}`);
  }
};

// Delete an admin (superadmin or subadmin)
export const deleteAdmin = async (adminId) => {
  try {
    const deletedAdmin = await models.Admins.findByIdAndDelete(adminId);
    if (!deletedAdmin) throw new Error("Admin not found");
    return deletedAdmin;
  } catch (error) {
    throw new Error(`Error deleting admin: ${error.message}`);
  }
};

// Check if an email is already in use
export const isEmailTaken = async (email, excludeAdminId = null) => {
  try {
    const query = excludeAdminId
      ? { email, _id: { $ne: excludeAdminId } }
      : { email };
    const existingAdmin = await models.Admins.findOne(query).lean();
    return !!existingAdmin;
  } catch (error) {
    throw new Error(`Error checking email: ${error.message}`);
  }
};
