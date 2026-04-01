import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from 'fs'


// Controller for creating a resumes


// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        // Create new Resume
        const newResume = await Resume.create({
            userId,
            title,
            isDraft: true
        })

        // Return success message
        return res.status(201).json({ message: "Resume created successfully", resume: newResume });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//constroller for deleting a resume 
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;

        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId })

        // return success message
        return res.status(200).json({ message: "Resume deleted successfully" })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Get userResume by ID
// GET: /api/resumes/id
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json(resume);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}



// get resume by ID public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {

        const { resumeId } = req.params;

        const resume = await Resume.findOne({ public: true, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.status(200).json(resume);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


// Controller for updating a resume
// PUT: /api/resume/update
export const updateResume = async (req, res) => {
    try {

        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData)
        } else {
            resumeDataCopy = structuredClone(resumeData)
        }

        if (image) {
            const imageBufferData = image.buffer;
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300, h-300, fo-face, z-0.75' + (removeBackground === 'yes' ? ',e-bgremove' : ''),
                }
            });
            if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
            resumeDataCopy.personal_info.image = response.url;
        } else if (resumeDataCopy.personal_info?.image && resumeDataCopy.personal_info.image.includes('ik.imagekit.io')) {
            // Retroactively add/remove background removal transformation if it's an ImageKit URL
            let imageUrl = resumeDataCopy.personal_info.image;
            if (removeBackground === 'yes') {
                if (!imageUrl.includes('e-bgremove')) {
                    imageUrl = imageUrl.includes('?') ? `${imageUrl},e-bgremove` : `${imageUrl}?tr=e-bgremove`;
                }
            } else {
                imageUrl = imageUrl.replace(/[,]?e-bgremove/, '').replace(/\?tr=$/, '');
            }
            resumeDataCopy.personal_info.image = imageUrl;
        }

        resumeDataCopy.isDraft = false;

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, {
            new: true
        })

        return res.status(200).json({ message: "Saved successfully", resume });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// get all public resumes
// GET: /api/resumes/public
export const getPublicResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ public: true })
            .sort({ updatedAt: -1 })
            .select('title template accent_color personal_info professional_summary updatedAt')
            .limit(24);

        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// clone public resume to logged-in user
// POST: /api/resumes/public/:resumeId/clone
export const clonePublicResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const sourceResume = await Resume.findOne({ _id: resumeId, public: true }).lean();

        if (!sourceResume) {
            return res.status(404).json({ message: 'Public resume not found' });
        }

        const { _id, __v, createdAt, updatedAt, ...resumeData } = sourceResume;

        const clonedResume = await Resume.create({
            ...resumeData,
            userId,
            public: false,
            isDraft: true,
            title: sourceResume.title ? `Copy of ${sourceResume.title}` : 'Copied Resume'
        });

        return res.status(201).json({ message: 'Resume copied successfully', resume: clonedResume });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}