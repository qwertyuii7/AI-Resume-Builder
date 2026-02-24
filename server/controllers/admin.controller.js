import User from "../models/User.js";
import Template from "../models/Template.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new template
export const addTemplate = async (req, res) => {
    try {
        const { link, templateType } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const imageBufferData = fs.createReadStream(file.path);
        const response = await imagekit.files.upload({
            file: imageBufferData,
            fileName: `template-${Date.now()}.png`,
            folder: "templates",
        });

        const newTemplate = new Template({
            image: response.url,
            link: link,
            templateType: templateType,
        });

        await newTemplate.save();
        res.status(201).json(newTemplate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all templates
export const getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find({}).sort({ createdAt: -1 });
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a template
export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        await Template.findByIdAndDelete(id);
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
