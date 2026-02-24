import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },
    professional_summary: { type: String, default: '' },
    skills: { type: mongoose.Schema.Types.Mixed, default: {} },
    personal_info: {
        image: { type: String, default: '' },
        remove_background: { type: Boolean, default: false },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
        github: { type: String, default: '' },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
            location: { type: String, default: '' },
        }
    ],
    project: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
            points: [{ type: String }],
            date: { type: String, default: '' },
            link: { type: String, default: '' },
        }
    ],
    certificates: { type: mongoose.Schema.Types.Mixed, default: {} },
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
            location: { type: String, default: '' },
        }
    ],
    isDraft: { type: Boolean, default: false }

}, { timestamps: true, minimize: false })

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;