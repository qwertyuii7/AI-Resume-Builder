import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Calculate ATS score
function calculateATSScore(resumeContent) {
  let score = 0;
  const suggestions = [];
  
  // Check for key sections
  const hasContact = /name|email|phone|location/i.test(resumeContent);
  const hasSummary = /summary|professional|profile|objective/i.test(resumeContent);
  const hasExperience = /experience|work|employment/i.test(resumeContent);
  const hasEducation = /education|degree|university/i.test(resumeContent);
  const hasSkills = /skills|technologies|competencies/i.test(resumeContent);
  const hasProjects = /projects|portfolio/i.test(resumeContent);
  
  // Section scoring
  if (hasContact) score += 10;
  else suggestions.push("Add clear contact information (name, email, phone)");
  
  if (hasSummary) score += 15;
  else suggestions.push("Add a professional summary section");
  
  if (hasExperience) score += 20;
  else suggestions.push("Add work experience section");
  
  if (hasEducation) score += 15;
  else suggestions.push("Add education section");
  
  if (hasSkills) score += 15;
  else suggestions.push("Add skills section");
  
  if (hasProjects) score += 10;
  else suggestions.push("Add projects section");
  
  // Format checks
  const hasBulletPoints = /•|·|[-*]/.test(resumeContent);
  if (hasBulletPoints) score += 10;
  else suggestions.push("Use bullet points for better readability");
  
  // Strong action verbs check
  const strongActionVerbs = /architected|built|developed|implemented|created|designed|optimized|improved|enhanced|reduced|increased|achieved|led|managed|coordinated|automated|streamlined|standardized|refactored|deployed|integrated|migrated|scaled|monitored|tested|debugged/gi;
  const actionVerbCount = (resumeContent.match(strongActionVerbs) || []).length;
  if (actionVerbCount >= 3) score += 10;
  else suggestions.push("Use more strong action verbs (built, developed, implemented, etc.)");
  
  // Length check - appropriate for single-page resume
  const wordCount = resumeContent.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 400) score += 5;
  else if (wordCount < 150) suggestions.push("Resume is too short - add more details to reach at least 150 words");
  else if (wordCount > 400) suggestions.push("Resume is too long for a single page - make it more concise");
  
  // Professional formatting check
  const hasProperFormatting = /<h[1-6]>|<p>|<ul>|<li>/i.test(resumeContent);
  if (hasProperFormatting) score += 5;
  else suggestions.push("Use proper HTML formatting for better structure");
  
  // No generic phrases check
  const genericPhrases = /hardworking|team player|detail-oriented|fast learner|excellent communication skills/i;
  if (!genericPhrases.test(resumeContent)) score += 5;
  else suggestions.push("Remove generic phrases like 'hardworking' or 'team player'");
  
  return {
    score: Math.min(score, 100),
    suggestions,
    details: {
      hasContact,
      hasSummary,
      hasExperience,
      hasEducation,
      hasSkills,
      hasProjects,
      hasBulletPoints,
      actionVerbCount,
      wordCount
    }
  };
}

// Transform GitHub projects into resume-worthy bullet points
function transformGitHubProjects(projects) {
  return projects.map(project => {
    const techStack = project.technologies.join(', ') || 'Various technologies';
    const description = project.description || `A ${project.name} project`;
    
    // Extract meaningful bullet points from project
    const bulletPoints = [];
    
    // Main development bullet
    bulletPoints.push(`Developed ${project.name}: ${description}`);
    
    // Technology stack bullet
    bulletPoints.push(`Implemented using ${techStack}`);
    
    // Impact/achievement bullet (if stars or description indicates value)
    if (project.stars > 0) {
      bulletPoints.push(`Achieved ${project.stars}+ GitHub stars demonstrating community adoption`);
    } else {
      bulletPoints.push(`Deployed and maintained production-ready codebase`);
    }
    
    return {
      name: project.name,
      bulletPoints: bulletPoints.slice(0, 3) // Max 3 bullets per project
    };
  });
}

// Merge and prioritize projects (manual + GitHub)
function mergeAndPrioritizeProjects(manualProjects, githubProjects) {
  const transformedGithub = transformGitHubProjects(githubProjects);
  
  // Combine all projects
  const allProjects = [
    ...manualProjects.map(p => ({
      name: p.name,
      bulletPoints: [
        p.description || `Developed ${p.name}`,
        `Technologies: ${p.technologies.join(', ')}`,
        p.url ? `Live demo: ${p.url}` : 'Available on GitHub'
      ]
    })),
    ...transformedGithub
  ];
  
  // Remove duplicates (by name)
  const uniqueProjects = [];
  const seenNames = new Set();
  
  for (const project of allProjects) {
    if (!seenNames.has(project.name.toLowerCase())) {
      seenNames.add(project.name.toLowerCase());
      uniqueProjects.push(project);
    }
  }
  
  // Return top 5 projects (prioritize manual entries first)
  return uniqueProjects.slice(0, 5);
}

// Generate strong action verbs list
const actionVerbs = [
  'Architected', 'Built', 'Developed', 'Implemented', 'Created', 'Designed',
  'Optimized', 'Improved', 'Enhanced', 'Reduced', 'Increased', 'Achieved',
  'Led', 'Managed', 'Coordinated', 'Mentored', 'Trained', 'Guided',
  'Automated', 'Streamlined', 'Standardized', 'Refactored', 'Deployed',
  'Integrated', 'Migrated', 'Scaled', 'Monitored', 'Tested', 'Debugged'
];

// Generate resume using Gemini AI with comprehensive backup system
router.post('/generate-resume', async (req, res) => {
  try {
    const { personalInfo, experience, education, projects, skills } = req.body;
    
    // Check if user wants to force offline mode
    const forceOffline = req.body.forceOffline || false;
    
    // Check API configuration and availability
    const hasApiConfig = process.env.OPEN_AI_BASE_URL && process.env.GEMINI_API_KEY;
    let openai = null;
    let aiAvailable = false;
    
    if (hasApiConfig && !forceOffline) {
      try {
        openai = new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: process.env.OPEN_AI_BASE_URL
        });
        aiAvailable = true;
      } catch (error) {
        console.log('Failed to initialize AI client:', error.message);
        aiAvailable = false;
      }
    }

    // Merge and prioritize projects
    const prioritizedProjects = mergeAndPrioritizeProjects(projects, []);

    // Build reliable data structure with fallbacks
    const hasPersonalInfo = personalInfo.name || personalInfo.email;
    const hasExperience = experience && experience.length > 0 && experience[0].title;
    const hasEducation = education && education.length > 0 && education[0].degree;
    const hasProjects = prioritizedProjects && prioritizedProjects.length > 0;
    const hasSkills = skills && skills.length > 0;

    // If no data at all, return error
    if (!hasPersonalInfo && !hasExperience && !hasEducation && !hasProjects && !hasSkills) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least some information to generate a resume'
      });
    }

    // Try AI generation if available and not forced offline
    let generatedText = null;
    let aiFailed = false;
    let aiLimitReached = false;
    
    if (aiAvailable && !forceOffline) {
      // Construct structured, professional prompt with explicit data requirements
      const prompt = `Generate a COMPLETE, PROFESSIONAL resume in HTML format using ONLY data provided below.

CRITICAL REQUIREMENTS:
1. You MUST include ALL non-empty sections below
2. Generate FULL HTML content - no empty responses
3. Use ONLY data provided - NO invented information
4. Create a SINGLE-PAGE resume that fits on one A4 sheet
5. Use strong action verbs: ${actionVerbs.join(', ')}
6. Format: Clean HTML with inline CSS, black and white styling
7. Each bullet point: Max 1-2 lines, achievement-focused
8. No generic phrases, no long paragraphs

RESUME DATA:
Name: ${personalInfo.name || ''}
Email: ${personalInfo.email || ''}
Phone: ${personalInfo.phone || ''}
Location: ${personalInfo.location || ''}
Website: ${personalInfo.website || ''}

Professional Summary:
${personalInfo.summary || 'Professional with relevant experience and skills'}

Skills:
${skills.length > 0 ? skills.join(', ') : 'Relevant technical and professional skills'}

Experience:
${experience.map(exp => {
  const title = exp.title || 'Position';
  const company = exp.company || 'Company';
  const duration = exp.duration && exp.duration.trim() !== '' ? ` | ${exp.duration}` : '';
  const description = exp.description ? `• ${exp.description}` : '• Professional responsibilities and achievements';
  
  return duration ? 
    `${title} at ${company}${duration}\n${description}` :
    `${title} at ${company}\n${description}`;
}).join('\n')}

Projects:
${prioritizedProjects.map(project => `
${project.name}
${project.bulletPoints.map(bullet => `• ${bullet}`).join('\n')}
`).join('\n')}

Education:
${education.map(edu => {
  const degree = edu.degree || 'Degree';
  const institution = edu.institution || 'Institution';
  const duration = edu.duration && edu.duration.trim() !== '' ? ` | ${edu.duration}` : '';
  const description = edu.description ? `• ${edu.description}` : '• Relevant studies and achievements';
  
  return duration ? 
    `${degree} from ${institution}${duration}\n${description}` :
    `${degree} from ${institution}\n${description}`;
}).join('\n')}

HTML STRUCTURE REQUIREMENTS:
1. Start with: <div style="font-family: Arial; font-size: 14.4px; line-height: 1.5; color: #000;">
2. Use <h1> for name (22px, bold, text-align: center)
3. Use <p> for contact info (11.5px, text-align: center)
4. Use <h2> for section headers (14.4px, bold, uppercase, border-bottom)
5. Use <h3> for job/education titles (13.4px, bold)
6. Use <ul> and <li> for bullet points
7. End with: </div>

REQUIRED SECTIONS (include if data exists):
- Contact Info (always show if name or email provided)
- Professional Summary (always include)
- Skills (always include)
- Experience (if any experience data)
- Projects (if any project data)
- Education (if any education data)

FORMATTING:
- Width: 100% of page
- Margins: 15mm
- Compact spacing
- Black text, white background
- Professional fonts

Generate COMPLETE HTML resume now - ensure all sections are included:`;

      console.log('Attempting AI generation...');

      // Generate content with retry mechanism
      let retryCount = 0;
      const maxRetries = 1; // Only 1 retry to avoid rate limits

      while (!generatedText && retryCount < maxRetries) {
        try {
          // Generate content using OpenAI compatibility with smaller request
          const completion = await openai.chat.completions.create({
            model: process.env.OPEN_AI_MODEL || 'gemini-2.5-flash',
            messages: [
              {
                role: "system",
                content: "You are an expert resume writer. Generate concise, professional HTML resumes using provided data. Include all sections. Use proper HTML structure with inline CSS."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 1000, // Reduced to avoid rate limits
            temperature: 0.1 // Very low temperature for consistency
          });

          const responseText = completion.choices[0]?.message?.content;
          
          // Validate response
          if (responseText && responseText.trim().length > 30 && responseText.includes('<')) {
            generatedText = responseText;
            console.log('AI generation successful');
          } else {
            console.log(`Retry ${retryCount + 1}: Invalid response, using fallback...`);
            break; // Don't retry on invalid responses
          }
        } catch (error) {
          console.log(`Retry ${retryCount + 1}: Error - ${error.message}`);
          retryCount++;
          
          // If it's a rate limit error, don't retry and mark limit reached
          if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('429')) {
            console.log('Rate limit detected, using fallback immediately');
            aiLimitReached = true;
            break;
          }
        }
      }
      
      if (!generatedText) {
        aiFailed = true;
        console.log('AI generation failed, using fallback');
      }
    } else {
      console.log('Using offline mode or no API configuration');
      aiFailed = true;
    }

    // Use fallback if AI failed or forced offline
    if (aiFailed || !generatedText || forceOffline) {
      console.log('Generating fallback resume...');
      generatedText = generateFallbackResume(personalInfo, experience, education, prioritizedProjects, skills);
    }

    // Clean up any code blocks or markdown formatting
    let cleanedText = generatedText;
    
    // Remove code blocks with triple backticks
    cleanedText = cleanedText.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any remaining code blocks
    cleanedText = cleanedText.replace(/```[\s\S]*?```/g, '');
    
    // Remove any markdown code formatting
    cleanedText = cleanedText.replace(/`([^`]+)`/g, '$1');
    
    // Ensure it starts with HTML if it doesn't
    if (!cleanedText.trim().startsWith('<')) {
      cleanedText = `<div style="font-family: Arial; font-size: 14.4px; line-height: 1.5; color: #000;">${cleanedText}</div>`;
    }

    // Final validation
    if (cleanedText.trim().length < 100) {
      throw new Error('Generated resume is too short. Please provide more information.');
    }

    console.log('Resume generated successfully');

    // Calculate ATS score
    const atsScore = calculateATSScore(cleanedText);

    // Return response with AI status
    const response = {
      success: true,
      content: cleanedText,
      atsScore: atsScore
    };

    // Add AI status message if fallback was used
    if (forceOffline) {
      response.aiStatus = 'offline';
      response.message = 'Using offline resume generator (free mode)';
    } else if (aiLimitReached) {
      response.aiStatus = 'limit_reached';
      response.message = 'Free AI limit reached. Pay for more AI features or continue with free backup';
    } else if (aiFailed || !generatedText) {
      response.aiStatus = 'fallback';
      response.message = 'AI generation failed, using backup resume generator';
    } else {
      response.aiStatus = 'success';
    }

    res.json(response);

  } catch (error) {
    console.error('Resume generation error:', error);
    
    // Always try to provide a fallback resume even on errors
    try {
      const { personalInfo, experience, education, projects, skills } = req.body;
      const prioritizedProjects = mergeAndPrioritizeProjects(projects || [], []);
      const fallbackText = generateFallbackResume(personalInfo, experience, education, prioritizedProjects, skills);
      const atsScore = calculateATSScore(fallbackText);
      
      res.json({
        success: true,
        content: fallbackText,
        atsScore: atsScore,
        aiStatus: 'fallback',
        message: 'Error occurred, using backup resume generator'
      });
    } catch (fallbackError) {
      console.error('Fallback generation failed:', fallbackError);
      res.status(500).json({
        success: false,
        message: 'Failed to generate resume. Please try again.'
      });
    }
  }
});

// Fallback resume generator
function generateFallbackResume(personalInfo, experience, education, projects, skills) {
  const name = personalInfo.name || 'Your Name';
  const email = personalInfo.email || 'your.email@example.com';
  const phone = personalInfo.phone || 'Your Phone';
  const location = personalInfo.location || 'Your Location';
  
  let html = `<div style="font-family: Arial; font-size: 14.4px; line-height: 1.5; color: #000; margin: 15mm;">
<h1 style="font-size: 22px; font-weight: bold; margin: 8px 0; text-align: center;">${name}</h1>
<p style="font-size: 11.5px; margin: 3px 0; text-align: center;">${email} | ${phone} | ${location}</p>

<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">PROFESSIONAL SUMMARY</h2>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${personalInfo.summary || 'Professional with relevant experience and skills'}</li>
</ul>

<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">SKILLS</h2>
<p style="margin: 3px 0; font-size: 14.4px;">${skills.length > 0 ? skills.join(', ') : 'Relevant technical and professional skills'}</p>`;

  if (experience && experience.length > 0) {
    html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">EXPERIENCE</h2>`;
    experience.forEach(exp => {
      const title = exp.title || 'Position';
      const company = exp.company || 'Company';
      const duration = exp.duration && exp.duration.trim() !== '' ? ` | ${exp.duration}` : '';
      
      html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${title} at ${company}${duration}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${exp.description || 'Professional responsibilities and achievements'}</li>
</ul>`;
    });
  }

  if (projects && projects.length > 0) {
    html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">PROJECTS</h2>`;
    projects.forEach(project => {
      html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${project.name}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  ${project.bulletPoints.map(bullet => `<li style="margin: 2px 0; font-size: 14.4px;">• ${bullet}</li>`).join('')}
</ul>`;
    });
  }

  if (education && education.length > 0) {
    html += `
<h2 style="font-size: 14.4px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin: 6px 0 4px 0; padding-bottom: 2px;">EDUCATION</h2>`;
    education.forEach(edu => {
      const degree = edu.degree || 'Degree';
      const institution = edu.institution || 'Institution';
      const duration = edu.duration && edu.duration.trim() !== '' ? ` | ${edu.duration}` : '';
      
      html += `
<h3 style="font-size: 13.4px; font-weight: bold; margin: 4px 0;">${degree} from ${institution}${duration}</h3>
<ul style="margin: 3px 0; padding-left: 12px;">
  <li style="margin: 2px 0; font-size: 14.4px;">• ${edu.description || 'Relevant studies and achievements'}</li>
</ul>`;
    });
  }

  html += `</div>`;
  return html;
}

export default router;
