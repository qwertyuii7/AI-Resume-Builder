const express = require('express');
const router = express.Router();

// Simple offline chatbot with career advice (no API dependency)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get user message and convert to lowercase for matching
    const lowerMessage = message.toLowerCase().trim();
    
    // Generate contextual responses based on keywords
    let response = getCareerAdvice(lowerMessage);
    
    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      success: true,
      response: "I'm here to help with career advice! Ask me about resumes, interviews, or job searching."
    });
  }
});

// Career advice function - no API needed
function getCareerAdvice(message) {
  // Resume-related advice
  if (message.includes('resume') || message.includes('cv')) {
    if (message.includes('format') || message.includes('layout')) {
      return "For resume formatting: Use a clean, professional layout with clear sections. Keep it to 1 page, use 11-12pt font, and ensure good white space. Save as PDF unless specified otherwise.";
    } else if (message.includes('summary') || message.includes('objective')) {
      return "For your resume summary: Write 2-3 sentences highlighting your key qualifications and career goals. Focus on what makes you unique and valuable to employers.";
    } else if (message.includes('skills') || message.includes('technical')) {
      return "For skills section: List both technical and soft skills. Be specific with technologies (e.g., 'JavaScript' instead of 'programming'). Group similar skills together.";
    } else if (message.includes('experience') || message.includes('work')) {
      return "For experience section: Use bullet points with action verbs. Quantify achievements (e.g., 'Increased sales by 25%'). Focus on results, not just duties.";
    } else {
      return "For your resume: Keep it concise (1 page), use action verbs, quantify achievements, tailor to each job, and proofread carefully. Would you like specific tips on any section?";
    }
  }
  
  // Interview-related advice
  if (message.includes('interview')) {
    if (message.includes('question') || message.includes('ask')) {
      return "Common interview questions: 'Tell me about yourself', 'Why do you want this job?', 'What are your strengths/weaknesses?', 'Where do you see yourself in 5 years?' Prepare STAR method examples.";
    } else if (message.includes('prepare') || message.includes('ready')) {
      return "Interview preparation: Research the company, practice common questions, prepare your own questions, dress professionally, and bring copies of your resume. Arrive 10 minutes early.";
    } else if (message.includes('virtual') || message.includes('online')) {
      return "For virtual interviews: Test your tech beforehand, choose a quiet location, ensure good lighting, look at the camera, and minimize distractions. Have a backup plan ready.";
    } else {
      return "For interviews: Research the company, practice STAR method examples, prepare thoughtful questions to ask, dress professionally, and follow up with a thank-you note. Confidence is key!";
    }
  }
  
  // Job search advice
  if (message.includes('job') || message.includes('search') || message.includes('career')) {
    if (message.includes('network') || message.includes('connect')) {
      return "For networking: Attend industry events, use LinkedIn effectively, conduct informational interviews, and maintain relationships. 70% of jobs are found through networking!";
    } else if (message.includes('application') || message.includes('apply')) {
      return "For applications: Customize each resume/cover letter, follow instructions exactly, use keywords from the job description, and track your applications. Quality over quantity!";
    } else if (message.includes('linkedin')) {
      return "For LinkedIn: Complete your profile, use a professional photo, get recommendations, join industry groups, and engage with content. Recruiters actively search here!";
    } else {
      return "For job searching: Network actively (70% of jobs come from connections), customize applications, use job boards strategically, follow up politely, and consider both online and offline opportunities. Stay persistent!";
    }
  }
  
  // Skills and development advice
  if (message.includes('skill') || message.includes('learn') || message.includes('develop')) {
    return "For skill development: Identify in-demand skills in your field, use online platforms (Coursera, Udemy), practice regularly, get certifications, and apply skills in real projects. Continuous learning is essential!";
  }
  
  // Career change advice
  if (message.includes('change') || message.includes('transition') || message.includes('switch')) {
    return "For career changes: Research your target field, identify transferable skills, consider education/certifications, network in the new field, and be prepared to start at a different level. Patience is key!";
  }
  
  // Salary and negotiation advice
  if (message.includes('salary') || message.includes('negotiate') || message.includes('pay')) {
    return "For salary negotiation: Research market rates, know your worth, consider the full package (benefits, bonus), practice your pitch, and be prepared to walk away if needed. Timing matters - negotiate after receiving an offer.";
  }
  
  // Default greeting and general advice
  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    return "Hello! I'm your career advisor. I can help with resume writing, interview preparation, job searching, skill development, and career transitions. What would you like to know?";
  }
  
  // Default response
  return "I'm here to help with your career journey! I can provide advice on resumes, interviews, job searching, skill development, and career transitions. What specific area would you like guidance on?";
}

module.exports = router;
