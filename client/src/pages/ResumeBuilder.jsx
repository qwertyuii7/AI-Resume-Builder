import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, ChevronLeft, ChevronRight, Download, Eye,
  EyeOff, FileText, FolderOpen, GraduationCap, LayoutTemplate,
  Palette, Share2, Sparkles, User, Save, PenTool, Monitor, Award
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../configs/api';

// Components
import PersonalInfoForm from '../components/PersonalInfoForm';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import CertificatesForm from '../components/CertificatesForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector(state => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [mobilePreviewTab, setMobilePreviewTab] = useState('templates'); // 'templates' | 'accent'

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: {},
    certificates: {},
    template: "classic",
    accent_color: '#3B82F6',
    public: false
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Sections Configuration
  const sections = [
    { id: 'personal', name: "Personal", icon: User, desc: "Basic info" },
    { id: 'summary', name: "Summary", icon: FileText, desc: "Profile overview" },
    { id: 'experience', name: "Experience", icon: Briefcase, desc: "Work history" },
    { id: 'education', name: "Education", icon: GraduationCap, desc: "Academics" },
    { id: 'projects', name: "Projects", icon: FolderOpen, desc: "Key works" },
    { id: 'skills', name: "Skills", icon: Sparkles, desc: "Abilities" },
    { id: 'certificates', name: "Certificates", icon: Award, desc: "Achievements" },
  ];

  const mobileTemplates = [
    { id: 'professional-academic', label: 'Professional' },
    { id: 'technical-detailed', label: 'Detailed' },
    { id: 'jakes-style', label: "Jake's" },
    { id: 'two-column-purple', label: 'Two Column' },
    { id: 'modern-teal', label: 'Modern Teal' },
    { id: 'serif-classic', label: 'Serif Classic' },
    { id: 'clean-blue', label: 'Clean Blue' },
    { id: 'detailed-professional', label: 'Detailed Pro' },
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal-image', label: 'Profile' },
    { id: 'minimal', label: 'Minimal' },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    loadExistingResume();
  }, []);

  const [isExporting, setIsExporting] = useState(false);

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token }
      });
      if (data) {
        setResumeData(data);
        document.title = data.title || "Resume Builder";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Open the print dialog to save as PDF or print.
      setIsExporting(true);
      setTimeout(() => {
        window.print();
        setIsExporting(false);
      }, 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate PDF");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let updatedResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(updatedResumeData));
      formData.append('removeBackground', resumeData.personal_info?.remove_background ? "yes" : "no");

      if (typeof resumeData.personal_info.image === 'object') {
        formData.append('image', resumeData.personal_info.image);
      }

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });

      setResumeData(data.resume);
      toast.success("Resume saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }));

      await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(`Resume is now ${!resumeData.public ? 'Public' : 'Private'}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visibility");
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.origin;
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "Check out my resume!" });
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Link copied to clipboard");
    }
  };

  // --- Render Helpers ---
  const renderForm = () => {
    switch (activeSection.id) {
      case 'personal': return <PersonalInfoForm data={resumeData.personal_info} onChange={(d) => setResumeData(p => ({ ...p, personal_info: d }))} />;
      case 'summary': return <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(d) => setResumeData(p => ({ ...p, professional_summary: d }))} setResumeData={setResumeData} />;
      case 'experience': return <ExperienceForm data={resumeData.experience} onChange={(d) => setResumeData(p => ({ ...p, experience: d }))} />;
      case 'education': return <EducationForm data={resumeData.education} onChange={(d) => setResumeData(p => ({ ...p, education: d }))} />;
      case 'projects': return <ProjectForm data={resumeData.project} onChange={(d) => setResumeData(p => ({ ...p, project: d }))} />;
      case 'skills': return <SkillsForm data={resumeData.skills} onChange={(d) => setResumeData(p => ({ ...p, skills: d }))} />;
      case 'certificates': return <CertificatesForm data={resumeData.certificates} onChange={(d) => setResumeData(p => ({ ...p, certificates: d }))} />;
      default: return null;
    }
  };

  return (
    <div className="resume-builder-page flex flex-col h-screen bg-slate-50 overflow-hidden">

      {/* Top Header */}
      <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link to="/app" className="group p-2.5 bg-slate-50 hover:bg-orange-50 rounded-xl text-slate-400 hover:text-primary-accent transition-all duration-300">
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="font-black text-slate-900 text-lg lg:text-xl tracking-tight truncate max-w-[150px] lg:max-w-xs">{resumeData.title || "Untitled Resume"}</h1>
            <p className="hidden lg:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Auto-saving enabled</p>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button
            onClick={() => setActiveTab('editor')}
            className={`p-2 rounded-lg transition-all ${activeTab === 'editor' ? 'bg-white shadow-md text-primary-accent' : 'text-slate-400'}`}
          >
            <PenTool className="size-5" />
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`p-2 rounded-lg transition-all ${activeTab === 'preview' ? 'bg-white shadow-md text-primary-accent' : 'text-slate-400'}`}
          >
            <Monitor className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-300 disabled:opacity-50">
            {isExporting ? <Sparkles className="size-4 animate-spin text-orange-400" /> : <Download className="size-4" />}
            <span className="hidden sm:inline">{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT PANEL: Editor */}
        <div className={`left-editor-panel w-full lg:w-[45%] xl:w-[40%] flex flex-col bg-white border-r border-slate-200 relative z-10 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>

          {/* Stepper Navigation */}
          <div className="px-6 lg:px-8 py-4 lg:py-6 overflow-x-auto border-b border-slate-50 no-scrollbar">
            <div className="flex items-center justify-center min-w-max gap-4 lg:gap-6">
              {sections.map((sec, idx) => {
                const isActive = activeSectionIndex === idx;
                const isCompleted = activeSectionIndex > idx;
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`group flex flex-col items-center gap-3 min-w-[4rem] lg:min-w-[5rem] transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <div className={`size-12 lg:size-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary-accent text-white shadow-xl shadow-orange-500/30' : isCompleted ? 'bg-orange-50 text-primary-accent' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon className="size-5 lg:size-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{sec.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Configuration Bar */}
          <div className="hidden lg:flex px-4 lg:px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex-wrap items-center gap-3 lg:gap-4 print:hidden print:py-0 print:px-0 print:border-0 print:bg-transparent">
            <div className="flex items-center gap-2">
              <TemplateSelector selectedTemplate={resumeData.template} onChange={(t) => setResumeData(prev => ({ ...prev, template: t }))} />
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <ColorPicker selectedColor={resumeData.accent_color} onChange={(c) => setResumeData(prev => ({ ...prev, accent_color: c }))} />
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth" data-lenis-prevent>
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderForm()}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center z-20">
            <button
              onClick={() => setActiveSectionIndex(prev => Math.max(0, prev - 1))}
              disabled={activeSectionIndex === 0}
              className="group flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-500 hover:text-primary-accent hover:bg-orange-50 disabled:opacity-30 rounded-xl transition-all duration-300"
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <button
              onClick={async () => {
                await handleSave();
                if (activeSectionIndex < sections.length - 1) {
                  setActiveSectionIndex(prev => prev + 1);
                }
              }}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 text-sm font-black bg-primary-accent text-white hover:shadow-xl hover:shadow-orange-500/20 active:scale-95 disabled:opacity-50 rounded-xl shadow-lg transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <Sparkles className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{activeSectionIndex === sections.length - 1 ? 'Save Resume' : 'Save & Next'}</span>
                  {activeSectionIndex < sections.length - 1 && <ChevronRight className="size-5" />}
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Preview */}
        <div className={`preview-print-panel flex-1 bg-slate-100/80 flex items-center justify-center p-4 lg:p-8 overflow-hidden relative print:bg-white print:p-0 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="absolute inset-0 pattern-grid-lg text-slate-200/50 opacity-20 pointer-events-none print:hidden" />

          <div className="preview-scroll-area h-full w-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar pb-20 print:pb-0 print:overflow-visible" data-lenis-prevent>
            <div className="lg:hidden sticky top-0 z-30 w-full max-w-md mx-auto mb-3 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-3 shadow-sm print:hidden">
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 mb-3">
                <button
                  onClick={() => setMobilePreviewTab('templates')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-black transition-all ${mobilePreviewTab === 'templates' ? 'bg-white text-primary-accent shadow-sm' : 'text-slate-500'}`}
                >
                  <LayoutTemplate className="size-4" />
                  Templates
                </button>
                <button
                  onClick={() => setMobilePreviewTab('accent')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-black transition-all ${mobilePreviewTab === 'accent' ? 'bg-white text-primary-accent shadow-sm' : 'text-slate-500'}`}
                >
                  <Palette className="size-4" />
                  Accent Color
                </button>
              </div>

              {mobilePreviewTab === 'templates' ? (
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(t) => setResumeData(prev => ({ ...prev, template: t }))}
                />
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <Palette className="size-4 text-slate-400" />
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(c) => setResumeData(prev => ({ ...prev, accent_color: c }))} />
                </div>
              )}
            </div>

            <div className="scale-wrapper relative z-0 scale-[0.38] sm:scale-[0.55] md:scale-[0.75] lg:scale-[0.85] xl:scale-95 origin-top transition-transform duration-300 w-fit print:scale-100 print:transform-none print:w-full">
              <div className="shadow-2xl shadow-slate-400/20 bg-white print:shadow-none">
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
              </div>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        @media print {
          html,
          body {
            height: auto !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .resume-builder-page {
            display: block !important;
            height: auto !important;
            background: white !important;
          }

          .resume-builder-page > header,
          .resume-builder-page .left-editor-panel {
            display: none !important;
          }

          .resume-builder-page .preview-print-panel {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .resume-builder-page .preview-scroll-area {
            overflow: visible !important;
            padding-bottom: 0 !important;
          }

          .resume-builder-page .scale-wrapper {
            transform: none !important;
            -webkit-transform: none !important;
            scale: 1 !important;
            width: auto !important;
          }

          .resume-builder-page .pattern-grid-lg {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ResumeBuilder