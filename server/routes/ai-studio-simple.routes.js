import express from 'express';

const router = express.Router();

// Simple fallback resume generator
router.post('/generate-resume', async (req, res) => {
  try {
    const { personalInfo, experience, education, projects, skills } = req.body;
    
    // Generate simple HTML resume with all provided data
    const name = personalInfo.name || 'Your Name';
    const email = personalInfo.email || 'your.email@example.com';
    const phone = personalInfo.phone || 'Your Phone';
    const location = personalInfo.location || 'Your Location';
    const website = personalInfo.website || '';
    
    let html = `<div style="font-family: Arial; font-size: 14.4px; line-height: 1.5; color: #000; margin: 15mm;">
<h1 style="font-size: 22px; font-weight: bold; margin: 8px 0; text-align: center;">${name}</h1>
<p style="font-size: 11.5px; margin: 3px 0; text-align: center;">${email} | ${phone} | ${location}${website ? ' | ' + website : ''}</p>

<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">PROFESSIONAL SUMMARY</h2>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${personalInfo.summary || 'Professional with relevant experience and skills'}</li>
</ul>

<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">SKILLS</h2>
<p style="margin: 3px 0; font-size: 14.4px;">${skills && skills.length > 0 ? skills.join(', ') : 'Relevant technical and professional skills'}</p>`;

    // Add experience if available
    if (experience && experience.length > 0) {
      html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">EXPERIENCE</h2>`;
      experience.forEach(exp => {
        const title = exp.title || 'Position';
        const company = exp.company || 'Company';
        const duration = exp.duration && exp.duration.trim() !== '' ? ` | ${exp.duration}` : '';
        const description = exp.description || 'Professional responsibilities and achievements';
        
        html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${title} at ${company}${duration}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${description}</li>
</ul>`;
      });
    }

    // Add projects if available
    if (projects && projects.length > 0) {
      html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">PROJECTS</h2>`;
      projects.forEach(project => {
        const projectName = project.name || 'Project';
        const projectDescription = project.description || 'Project description';
        const projectTech = project.technologies && project.technologies.length > 0 ? project.technologies.join(', ') : 'Various technologies';
        
        html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${projectName}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${projectDescription}</li>
  <li style="margin: 2px 0; font-size: 14.4px;">• Technologies: ${projectTech}</li>
</ul>`;
      });
    }

    // Add education if available
    if (education && education.length > 0) {
      html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">EDUCATION</h2>`;
      education.forEach(edu => {
        const degree = edu.degree || 'Degree';
        const institution = edu.institution || 'Institution';
        const duration = edu.duration && edu.duration.trim() !== '' ? ` | ${edu.duration}` : '';
        const eduDescription = edu.description || 'Relevant studies and achievements';
        
        html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${degree} from ${institution}${duration}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${eduDescription}</li>
</ul>`;
      });
    }

    html += `</div>`;

    // Calculate ATS score
    let score = 75; // Base score for having content
    const suggestions = [];
    
    if (!skills || skills.length === 0) {
      suggestions.push("Add skills to showcase your technical abilities");
      score = Math.max(score - 15, 50);
    }
    
    if (!experience || experience.length === 0) {
      suggestions.push("Add work experience to demonstrate professional growth");
      score = Math.max(score - 20, 50);
    }
    
    if (!education || education.length === 0) {
      suggestions.push("Add education to show academic background");
      score = Math.max(score - 15, 50);
    }

    const response = {
      success: true,
      content: html,
      atsScore: { score: Math.min(score, 100), suggestions },
      aiStatus: 'offline',
      message: 'Using FreeMode - Upgrade to use AI'
    };

    res.json(response);

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume. Please try again.'
    });
  }
});

export default router;
