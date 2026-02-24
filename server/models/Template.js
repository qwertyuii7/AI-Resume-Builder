import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    image: { type: String, required: true },
    link: { type: String, required: true },
    templateType: { type: String },
}, { timestamps: true });

const Template = mongoose.model("Template", templateSchema);

export default Template;
