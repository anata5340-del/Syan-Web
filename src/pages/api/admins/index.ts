import {
  getSubAdmins,
  getAdminById,
  createSubAdmin,
  updateAdmin,
  deleteAdmin,
  isEmailTaken,
} from "@/backend/services/admins";
import { connectDB } from "@/backend/db/connect";

export default async function handler(req, res) {
  await connectDB();

  try {
    switch (req.method) {
      case "GET": {
        const { id } = req.query;

        if (id) {
          // Fetch specific admin by ID
          const admin = await getAdminById(id);
          return res.status(200).json(admin);
        }

        // Fetch all subadmins
        const subAdmins = await getSubAdmins();
        return res.status(200).json(subAdmins);
      }

      case "POST": {
        const { username, email, password, excludedModules } = req.body;

        // Check if the email is already in use
        const emailTaken = await isEmailTaken(email);
        if (emailTaken) {
          return res.status(400).json({ message: "Email is already in use" });
        }

        // Create a new subadmin
        const newSubAdmin = await createSubAdmin({
          username,
          email,
          password,
          excludedModules,
        });

        return res.status(201).json(newSubAdmin);
      }

      case "PUT": {
        const { id } = req.query;
        const { email, ...updateData } = req.body;

        // Check if email is in the updateData and then check if it is already in use by another admin
        if (email && updateData.hasOwnProperty("email")) {
          const emailTaken = await isEmailTaken(email, id);
          if (emailTaken) {
            return res.status(400).json({ message: "Email is already in use" });
          }
        }

        // Update admin details
        const updatedAdmin = await updateAdmin(id, { email, ...updateData });
        return res.status(200).json(updatedAdmin);
      }

      case "DELETE": {
        const { id } = req.query;

        // Delete admin by ID
        const deletedAdmin = await deleteAdmin(id);
        return res.status(200).json(deletedAdmin);
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in admins API:", error);
    return res.status(500).json({ error: error.message });
  }
}
