import {
  FileText,
  Loader2,
  MoreVertical,
  PenLine,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
  FileUp,
  Sparkles,
  ClipboardList
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Vibrant gradients for the document previews
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-purple-500',
    'from-amber-500 to-orange-500'
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [greeting, setGreeting] = useState('Welcome');

  // Determine greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const loadAllResumes = async () => {
    setIsPageLoading(true);
    try {
      // Simulate slight delay for animation smoothness
      // await new Promise(r => setTimeout(r, 800)); 
      const { data } = await api.get('/api/users/resumes', {
        headers: { Authorization: token }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsPageLoading(false);
    }
  }

  const createResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/resumes/create', { title }, {
        headers: { Authorization: token }
      })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post('/api/ai/upload-resume', { resumeText, title }, {
        headers: { Authorization: token }
      })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const editTitle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.put(`/api/resumes/update`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setTitle('')
      setEditResumeId("")
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const deleteResume = async (resumeId, e) => {
    e.stopPropagation();
    try {
      if (window.confirm('Are you sure you want to delete this resume?')) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token }
        })
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId));
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    loadAllResumes();
  }, [])

  const filteredResumes = allResumes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans selection:bg-orange-100 selection:text-primary-accent">

      {/* Dynamic Background (Matching Hero/Login) */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#FDE3D2] blur-[120px]"></div>
        <div className="absolute bottom-[5%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#D1DCF8] blur-[130px]"></div>
        <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-[#F1DEF0] blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 pt-32">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {greeting}, <span className="text-primary-accent">{user?.name || 'Creator'}</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg font-medium italic">Craft your story, one resume at a time.</p>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-accent transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search your resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all shadow-sm group-hover:shadow-md font-medium"
            />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <button
            onClick={() => setShowCreateResume(true)}
            className="group relative overflow-hidden bg-white p-10 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-500 text-left"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDE3D2] rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="w-16 h-16 bg-orange-50 text-primary-accent rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-sm">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create New Resume</h3>
                <p className="text-slate-500 mt-2 text-base font-medium">Build a professional resume from scratch with AI.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRightIcon className="w-6 h-6 text-primary-accent" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="group relative overflow-hidden bg-slate-900 p-10 rounded-xl shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all duration-500 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-accent to-[#ff782e] opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 transition-transform shadow-lg">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Import PDF</h3>
              <p className="text-slate-400 mt-2 text-base font-medium">Let our AI extract and polish your existing resume.</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/ai-studio')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 p-10 rounded-xl shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-500 text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">AI Resume Studio</h3>
              <p className="text-blue-100 mt-2 text-base font-medium">Build resumes with GitHub integration and AI power.</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/app/ats-analyzer')}
            className="group relative overflow-hidden bg-white p-10 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500 text-left"
          >
            <div className="absolute -bottom-16 -left-12 w-48 h-48 bg-[#DBFCE7] rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-sm">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">ATS Analyzer</h3>
                <p className="text-slate-500 mt-2 text-base font-medium">Compare resume text with a role and get a compatibility score in JSON.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRightIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </button>
        </div>

        {/* Resume Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <FileText className="w-7 h-7 text-primary-accent" />
              Recent Documents
              <span className="text-sm font-bold text-primary-accent ml-2 bg-orange-50 px-3 py-1 rounded-xl shadow-sm">{filteredResumes.length}</span>
            </h2>
          </div>

          {isPageLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-72 bg-white/50 rounded-xl animate-pulse border border-slate-50 shadow-sm"></div>
              ))}
            </div>
          ) : filteredResumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
              {filteredResumes.map((res, index) => {
                const gradient = gradients[index % gradients.length];
                return (
                  <div
                    key={res._id}
                    onClick={() => navigate(`/app/builder/${res._id}`)}
                    className="group relative bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-72 shadow-xl shadow-slate-200/30"
                  >
                    {/* Document Preview (Top) */}
                    <div className="h-36 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>

                      {/* Floating paper effect */}
                      <div className="bg-white px-6 py-8 rounded-xl shadow-2xl z-10 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                        <FileText className="w-10 h-10 text-slate-300" />
                      </div>

                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1.5 bg-primary-accent rounded-xl text-white shadow-lg">
                          <PenLine className="size-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content (Bottom) */}
                    <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="font-black text-slate-800 text-lg truncate group-hover:text-primary-accent transition-colors">{res.title}</h3>
                        <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">Modified {new Date(res.updatedAt).toLocaleDateString()}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 mt-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditResumeId(res._id); setTitle(res.title); }}
                          className="p-2.5 text-slate-400 hover:text-primary-accent hover:bg-orange-50 rounded-xl transition-all duration-300"
                          title="Rename"
                        >
                          <PenLine className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => deleteResume(res._id, e)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-xl border-4 border-dashed border-slate-50 shadow-inner">
              <div className="w-24 h-24 bg-orange-50 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileText className="w-12 h-12 text-primary-accent" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your gallery is empty</h3>
              <p className="text-slate-500 max-w-sm mt-3 text-lg font-medium italic">"Every great career starts with a single page."</p>
            </div>
          )}
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Create Resume Modal */}
      {showCreateResume && (
        <Modal onClose={() => setShowCreateResume(false)}>
          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary-accent shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Title your masterpiece</h2>
            <p className="text-slate-500 mt-2 font-medium">What should we call your new resume?</p>
          </div>

          <form onSubmit={createResume} className="space-y-6">
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder='e.g. Senior Software Engineer 2024'
              className='w-full px-6 py-4 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-sm'
              required
            />
            <button
              disabled={isLoading}
              className='w-full py-4 bg-primary-accent text-white rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-3'
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <>
                  <span>Create Resume</span>
                  <Plus className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <Modal onClose={() => { setShowUploadResume(false); setResume(null); setTitle('') }}>
          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-slate-900 shadow-sm">
              <FileUp className="w-8 h-8" />
            </div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Upload PDF</h2>
            <p className="text-slate-500 mt-2 font-medium">Import your existing resume and let AI work its magic.</p>
          </div>

          <form onSubmit={uploadResume} className="space-y-6">
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder='Add a title (e.g. My Old Resume)'
              className='w-full px-6 py-4 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all font-bold text-slate-900 placeholder:text-slate-400 shadow-sm'
              required
            />

            <label className={`block w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${resume ? 'border-primary-accent bg-orange-50' : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/30'}`}>
              <input type="file" accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
              {resume ? (
                <div className="flex flex-col items-center gap-2 text-primary-accent">
                  <FileText className="w-12 h-12" />
                  <p className="font-black text-lg">{resume.name}</p>
                  <p className="text-xs opacity-60">Ready to process</p>
                </div>
              ) : (
                <div className="text-slate-400">
                  <UploadCloud className="w-12 h-12 mx-auto mb-3 text-slate-200 group-hover:text-primary-accent transition-colors" />
                  <p className="font-black text-slate-700">Drop your PDF here</p>
                  <p className="text-xs mt-1 font-bold uppercase tracking-wider">Maximum 5MB</p>
                </div>
              )}
            </label>

            <button
              disabled={isLoading || !resume}
              className='w-full py-4 bg-slate-900 text-white rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-slate-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50'
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <>
                  <span>Import & Polish</span>
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <Modal onClose={() => { setEditResumeId(''); setTitle('') }}>
          <div className="mb-8 pt-2">
            <h2 className='text-2xl font-black text-slate-900 tracking-tight'>Rename Resume</h2>
            <p className="text-slate-500 mt-1 font-medium">Update the title for this document.</p>
          </div>
          <form onSubmit={editTitle} className="space-y-6">
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className='w-full px-6 py-4 bg-white border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all font-bold text-slate-900 shadow-sm'
              required
            />
            <button
              disabled={isLoading}
              className='w-full py-4 bg-primary-accent text-white rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-orange-500/30 active:scale-95 transition-all'
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      <style>{`
          .text-primary-accent { color: #F95200; }
          .bg-primary-accent { background-color: #F95200; }
          .border-primary-accent { border-color: #F95200; }
          .focus\\:border-primary-accent:focus { border-color: #F95200; }
          .selection\\:text-primary-accent *::selection { color: #F95200; }
          .shadow-orange-500\\/30 { --tw-shadow-color: rgba(249, 82, 0, 0.3); }
          .shadow-orange-500\\/10 { --tw-shadow-color: rgba(249, 82, 0, 0.1); }
      `}</style>

    </div>
  )
}

// Reusable Modal Component with Backdrop Blur
const Modal = ({ children, onClose }) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ animation: 'fadeIn 0.2s ease-out' }}>
    <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm' onClick={onClose}></div>
    <div className='relative bg-white w-full max-w-md p-6 md:p-8 rounded-xl shadow-2xl transform transition-all' style={{ animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
        <X className="w-5 h-5" />
      </button>
      {children}
    </div>
    <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        `}</style>
  </div>
)

// Helper Icon
const ArrowRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)

export default Dashboard