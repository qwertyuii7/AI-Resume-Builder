import express from "express";
import { getAllUsers, deleteUser, addTemplate, getAllTemplates, deleteTemplate } from "../controllers/admin.controller.js";
import protect from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import upload from "../configs/multer.js";

const adminRouter = express.Router();

// User management
adminRouter.get("/users", protect, adminMiddleware, getAllUsers);
adminRouter.delete("/users/:id", protect, adminMiddleware, deleteUser);

// Template management
adminRouter.post("/templates", protect, adminMiddleware, upload.single("image"), addTemplate);
adminRouter.delete("/templates/:id", protect, adminMiddleware, deleteTemplate);
adminRouter.get("/templates", getAllTemplates); // Publicly accessible for Home page

export default adminRouter;
