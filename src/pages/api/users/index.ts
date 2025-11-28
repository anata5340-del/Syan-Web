import { connectDB } from "@/backend/db/connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { upload } from "@/backend/middlewares/multer/upload";
import { createUserValidator } from "@/backend/validators/user";
import { createUser, getUsers } from "@/backend/services/users";

const router = createRouter<any, any>();

// Add middleware to log all requests
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  console.log("Users API - Request received:", {
    method: req.method,
    url: req.url,
    path: req.url,
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : [],
  });
  next();
});

router
  .use(
    upload.fields([
      { name: "user[image]" },
      { name: "user[cnicFront]" },
      { name: "user[cnicBack]" },
    ])
  )
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      console.log("POST /api/users - Starting user creation...");
      await connectDB();
      console.log("Database connected");

      // Parse form fields into req.body.user structure
      if (!req.body.user) {
        req.body.user = {};
      }

      // Parse user[fieldName] format into req.body.user.fieldName
      // Multer parses form fields into req.body, so we need to restructure them
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("user[")) {
          const fieldName = key.match(/user\[(.*?)\]/)?.[1];
          if (
            fieldName &&
            req.body[key] !== undefined &&
            req.body[key] !== null &&
            req.body[key] !== ""
          ) {
            req.body.user[fieldName] = req.body[key];
          }
          delete req.body[key];
        }
      });

      // Add file locations if files were uploaded
      if (req?.files?.["user[image]"]?.[0]?.location) {
        req.body.user.image = req.files["user[image]"][0].location;
      }
      if (req?.files?.["user[cnicFront]"]?.[0]?.location) {
        req.body.user.cnicFront = req.files["user[cnicFront]"][0].location;
      }
      if (req?.files?.["user[cnicBack]"]?.[0]?.location) {
        req.body.user.cnicBack = req.files["user[cnicBack]"][0].location;
      }

      // Ensure status is set to "pending" for new users
      if (!req.body.user.status) {
        req.body.user.status = "pending";
      }

      // Log for debugging
      console.log("Parsed user data:", JSON.stringify(req.body.user, null, 2));
      console.log("Files uploaded:", {
        image: req?.files?.["user[image]"]?.[0]?.location,
        cnicFront: req?.files?.["user[cnicFront]"]?.[0]?.location,
        cnicBack: req?.files?.["user[cnicBack]"]?.[0]?.location,
      });

      await createUserValidator(req.body);
      console.log("Validation passed, creating user...");
      const user = await createUser(req.body.user);
      console.log("User created successfully:", {
        _id: user._id,
        email: user.email,
        status: user.status,
      });
      res.status(201).json({ user });
    } catch (error: any) {
      console.error("Error creating user:", error);
      console.error("Error stack:", error?.stack);
      console.error("Error details:", {
        message: error?.message,
        name: error?.name,
        errors: error?.errors,
      });
      const errorMessage =
        error?.message ||
        error?.errors?.[0]?.message ||
        "Failed to create user";
      res.status(400).json({ error: { message: errorMessage } });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await connectDB();
      const users = await getUsers();
      users.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      res.status(200).json({ users });
    } catch (error) {
      res.status(400).json({ error });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
