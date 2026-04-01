import React, { useState } from 'react';
import { ArrowLeft, Github, Download, Edit3, Check, Sparkles, User, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code, Plus, X, Loader2, Building } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

const AIResumeStudio = () => {
  const { token } = useSelector(state => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: []
  });

  // Fetch GitHub projects ONLY
  const fetchGithubProjects = async () => {
    if (!githubUrl) {
      toast.error('Please enter a GitHub URL');
      return;
    }

    setIsFetchingGithub(true);
    try {
      const username = githubUrl.split('github.com/')[1]?.split('/')[0];
      if (!username) {
        throw new Error('Invalid GitHub URL');
      }

      const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      const reposData = await repoResponse.json();

      if (reposData.message === 'Not Found') {
        throw new Error('GitHub user not found');
      }

      setResumeData(prev => ({
        ...prev,
        projects: reposData.map(repo => ({
          name: repo.name,
          description: repo.description || '',
          technologies: repo.language ? [repo.language] : [],
          url: repo.html_url,
          stars: repo.stargazers_count
        }))
      }));

      toast.success('GitHub projects fetched successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub projects');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  // Generate resume using Gemini AI
  const generateResume = async () => {
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      toast.error('Please fill in at least name and email');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/api/ai-studio/generate-resume', resumeData, {
        headers: { Authorization: token }
      });

      setEditableContent(response.data.content);
      setAtsScore(response.data.atsScore);
      setShowPreview(true);
      
      // Show appropriate message based on AI status
      if (response.data.aiStatus === 'offline') {
        toast.success('Using FreeMode - Upgrade to use AI! �', {
          duration: 4000,
          icon: '�'
        });
      } else if (response.data.aiStatus === 'limit_reached') {
        toast.error('Free AI limit reached. Upgrade to use AI features! 💎', {
          duration: 6000,
          icon: '💎'
        });
      } else if (response.data.aiStatus === 'fallback') {
        if (response.data.message && response.data.message.includes('rate limit')) {
          toast.error('AI rate limit reached. Using backup system (still works perfectly!) ⚡', {
            duration: 5000,
            icon: '⚡'
          });
        } else {
          toast.success('Resume generated using backup system (AI unavailable) 🎯', {
            duration: 4000,
            icon: '🎯'
          });
        }
      } else {
        toast.success('Resume generated successfully! 🎉');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate resume');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update personal info
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Add experience
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        duration: '',
        description: ''
      }]
    }));
  };

  // Update experience
  const updateExperience = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Remove experience
  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Add education
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        duration: '',
        description: ''
      }]
    }));
  };

  // Update education
  const updateEducation = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Remove education
  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Add skill
  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  // Update skill
  const updateSkill = (index, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? value : skill
      )
    }));
  };

  // Remove skill
  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Add project
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        url: '',
        stars: 0
      }]
    }));
  };

  // Update project
  const updateProject = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Save edited content
  const saveEdit = () => {
    setEditMode(false);
    toast.success('Changes saved!');
  };

  // Export to PDF
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Professional Resume</title>
        <style>
          @page { 
            margin: 15mm; 
            size: A4; 
          }
          body { 
            margin: 0; 
            font-family: Arial, sans-serif; 
            font-size: 14.4px;
            line-height: 1.5;
            color: #000000;
            background: #ffffff;
            width: 100%;
            overflow: hidden;
          }
          @media print { 
            body { 
              margin: 0; 
              font-size: 14.4px;
              line-height: 1.5;
            } 
          }
          .resume-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
          }
          h1 { 
            font-size: 22px; 
            margin: 8px 0; 
            font-weight: bold;
            color: #000000;
            text-align: center;
          }
          h2 { 
            font-size: 14.4px; 
            margin: 6px 0 4px 0; 
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            padding-bottom: 2px;
          }
          h3 { 
            font-size: 13.4px; 
            margin: 4px 0; 
            font-weight: bold;
          }
          p { 
            margin: 3px 0; 
            font-size: 14.4px;
          }
          ul { 
            margin: 3px 0; 
            padding-left: 12px; 
          }
          li { 
            margin: 2px 0; 
            font-size: 14.4px;
            line-height: 1.4;
          }
          .contact-info {
            font-size: 11.5px;
            margin-bottom: 8px;
            text-align: center;
          }
          .section {
            margin-bottom: 12px;
          }
          .bullet-point {
            margin: 2px 0;
            padding-left: 2px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          td { 
            padding: 2px; 
            vertical-align: top; 
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${editableContent}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Resume Studio
              </h1>
            </div>
            {showPreview && (
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Back to Edit
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showPreview ? (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={resumeData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 md:col-span-2"
                />
              </div>
              <textarea
                placeholder="Professional Summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                rows={3}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* GitHub Projects */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                <button
                  onClick={addProject}
                  className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  onClick={fetchGithubProjects}
                  disabled={isFetchingGithub}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isFetchingGithub ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                  Fetch
                </button>
              </div>
              <div className="space-y-3">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mr-2"
                      />
                      <button
                        onClick={() => removeProject(index)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2"
                    />
                    <input
                      type="url"
                      placeholder="Project URL"
                      value={project.url}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Experience, Education, Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Experience */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <button
                    onClick={addExperience}
                    className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                        <button
                          onClick={() => removeExperience(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <button
                    onClick={addEducation}
                    className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2 text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={edu.duration}
                          onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        />
                        <button
                          onClick={() => removeEducation(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                  <button
                    onClick={addSkill}
                    className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-md px-3 py-1">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-20"
                        placeholder="Skill"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateResume}
                disabled={isGenerating}
                className="flex items-center gap-3 px-8 py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Resume'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Resume Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
                {atsScore && (
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      atsScore.score >= 80 ? 'bg-green-100 text-green-800' :
                      atsScore.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      ATS Score: {atsScore.score}/100
                    </div>
                    <div className="text-sm text-gray-600">
                      {atsScore.score >= 80 ? 'Excellent' :
                       atsScore.score >= 60 ? 'Good' :
                       'Needs Improvement'}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {editMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {editMode ? 'Done' : 'Edit'}
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* ATS Score Details */}
            {atsScore && atsScore.suggestions && atsScore.suggestions.length > 0 && (
              <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    !
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-orange-900 mb-1">ATS Optimization Suggestions:</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      {atsScore.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Content */}
            <div className="p-8">
              {editMode ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Edit Resume Content:</p>
                    <div 
                      className="w-full h-96 p-6 bg-white border border-gray-300 rounded-md overflow-auto"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      dangerouslySetInnerHTML={{ __html: editableContent }}
                      style={{
                        fontSize: '14.4px',
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: '1.5',
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        padding: '16px',
                        outline: 'none',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                      onInput={(e) => {
                        // Update content as user types
                        setEditableContent(e.target.innerHTML);
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-lg" style={{ 
                  width: '100%', 
                  maxWidth: '210mm', 
                  minHeight: '297mm', 
                  margin: '0 auto', 
                  padding: '15mm',
                  fontSize: '14.4px',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.5',
                  color: '#000000',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: editableContent }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResumeStudio;
