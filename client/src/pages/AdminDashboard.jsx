import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { Users, Layout, Upload, Trash2, Link as LinkIcon, Plus, X, ExternalLink, ShieldCheck, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const { user, loading } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [adminResumes, setAdminResumes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Form state for template upload
    const [templateFile, setTemplateFile] = useState(null);
    const [templateLink, setTemplateLink] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('classic');

    const AVAILABLE_TEMPLATES = [
        { id: 'professional-academic', label: 'Professional' },
        { id: 'technical-detailed', label: 'Detailed' },
        { id: 'jakes-style', label: "Jake's" },
        { id: 'patrick-style', label: 'Executive' },
        { id: 'sukumar-style', label: 'Sukumar' },
        { id: 'modern-icons', label: 'Modern Icons' },
        { id: 'jane-style', label: 'Jane' },
        { id: 'danette-style', label: 'Danette' },
        { id: 'sebastian-style', label: 'Sebastian' },
        { id: 'alexander-style', label: 'Alexander' },
        { id: 'isabelle-style', label: 'Isabelle' },
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

    useEffect(() => {
        if (user?.email === 'aaftabansari034@gmail.com') {
            fetchUsers();
            fetchTemplates();
            fetchAdminResumes();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/api/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data } = await api.get('/api/admin/templates');
            setTemplates(data);
        } catch (error) {
            toast.error('Failed to fetch templates');
        }
    };

    const fetchAdminResumes = async () => {
        try {
            const { data } = await api.get('/api/users/resumes');
            setAdminResumes(data.resumes || []);
        } catch (error) {
            toast.error('Failed to fetch your resumes');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/api/admin/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleDeleteTemplate = async (id) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.delete(`/api/admin/templates/${id}`);
            toast.success('Template deleted');
            fetchTemplates();
        } catch (error) {
            toast.error('Failed to delete template');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTemplateFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleResumeSelect = (id) => {
        setSelectedResumeId(id);
        if (id) {
            const selected = adminResumes.find(r => r._id === id);
            if (selected) {
                const publicLink = `${window.location.origin}/app/public/${id}/use`;
                setTemplateLink(publicLink);
                setSelectedTemplate(selected.template || 'classic');
                if (!selected.public) {
                    toast.info('Note: This resume will be made public when you publish this template.');
                }
            }
        } else {
            setTemplateLink('');
        }
    };

    const handleUploadTemplate = async (e) => {
        e.preventDefault();
        if (!templateFile || !templateLink) {
            return toast.error('Please provide both image and link');
        }

        setIsUploading(true);

        try {
            // 1. If a resume was selected, make it public and update its template layout if changed
            if (selectedResumeId) {
                const selected = adminResumes.find(r => r._id === selectedResumeId);
                if (selected) {
                    await api.put('/api/resumes/update', {
                        resumeId: selectedResumeId,
                        resumeData: {
                            ...selected,
                            public: true,
                            template: selectedTemplate
                        }
                    });
                }
            }

            // 2. Upload template
            const formData = new FormData();
            formData.append('image', templateFile);
            formData.append('link', templateLink);
            formData.append('templateType', selectedTemplate);

            await api.post('/api/admin/templates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Template published successfully');
            setShowUploadModal(false);
            setTemplateFile(null);
            setTemplateLink('');
            setPreviewUrl('');
            setSelectedResumeId('');
            setSelectedTemplate('classic');
            fetchTemplates();
            fetchAdminResumes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return null;
    if (user?.email !== 'aaftabansari034@gmail.com') return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage users and resume templates from one place.</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Users size={18} />
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'templates' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Layout size={18} />
                            Templates
                        </button>
                    </div>
                </header>

                <main>
                    {activeTab === 'users' ? (
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-bottom border-slate-100">
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                            <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-orange-100 text-primary-accent flex items-center justify-center font-bold">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-slate-500 font-medium">{u.email}</td>
                                                <td className="px-8 py-5 text-slate-500 font-medium">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Active Templates ({templates.length})</h3>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="px-6 py-3 bg-primary-accent text-white font-black rounded-2xl hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center gap-2 active:scale-95 text-sm"
                                >
                                    <Plus size={18} />
                                    Add New Template
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {templates.map((template) => (
                                    <div key={template._id} className="group bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-2 transition-all duration-500">
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img src={template.image} alt="Template" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <a href={template.link} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-xl text-slate-900 hover:bg-primary-accent hover:text-white transition-all">
                                                    <ExternalLink size={20} />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template._id)}
                                                    className="p-3 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="px-3 py-1 bg-orange-50 text-primary-accent rounded-lg text-[10px] font-black uppercase tracking-wider border border-orange-100">
                                                    {template.templateType || 'classic'}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {new Date(template.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <LinkIcon size={14} />
                                                <p className="text-xs font-bold truncate">{template.link}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {templates.length === 0 && (
                                    <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                                        <div className="size-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                            <Layout size={40} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">No templates yet</h4>
                                        <p className="text-slate-500 font-medium mb-8">Upload your first resume template to show it on home page.</p>
                                        <button
                                            onClick={() => setShowUploadModal(true)}
                                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[110] overflow-y-auto py-8 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden my-auto mx-4 flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 md:p-12 overflow-y-auto custom-modal-scrollbar" data-lenis-prevent>
                                <header className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Template</h2>
                                        <p className="text-slate-500 font-medium">Add a new resume template to the gallery.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowUploadModal(false)}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </header>

                                <form onSubmit={handleUploadTemplate} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Template Image (PNG)</label>
                                        <div className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center overflow-hidden hover:border-primary-accent/50 transition-colors group">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="size-10 text-slate-300 mb-3" />
                                                    <p className="text-slate-400 font-bold text-sm text-center px-6">Click to upload template image</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Target Template Layout</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                                                <LayoutTemplate size={18} />
                                            </div>
                                            <select
                                                value={selectedTemplate}
                                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-accent focus:bg-white outline-none font-bold transition-all text-slate-900 appearance-none relative z-0"
                                            >
                                                {AVAILABLE_TEMPLATES.map(t => (
                                                    <option key={t.id} value={t.id}>{t.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Link to Existing Resume (Optional)</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                                                <Layout size={18} />
                                            </div>
                                            <select
                                                value={selectedResumeId}
                                                onChange={(e) => handleResumeSelect(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-accent focus:bg-white outline-none font-bold transition-all text-slate-900 appearance-none relative z-0"
                                            >
                                                <option value="">Select a resume to link...</option>
                                                {adminResumes.map(r => (
                                                    <option key={r._id} value={r._id}>
                                                        {r.title} ({r.template})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Redirect Link</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                <LinkIcon size={18} />
                                            </div>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://example.com/template-1"
                                                value={templateLink}
                                                onChange={(e) => setTemplateLink(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-accent focus:bg-white outline-none font-bold transition-all text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className="w-full py-5 bg-primary-accent text-white font-black rounded-3xl hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="size-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                Publish Template
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .border-primary-accent { border-color: #F95200; }
                .custom-modal-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-modal-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-modal-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
