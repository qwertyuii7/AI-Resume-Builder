import { Briefcase, Building2, Calendar, Loader2, MapPin, Plus, Sparkles, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({ data, onChange }) => {

    const { token } = useSelector(state => state.auth);
    const [generatingIndex, setGeneratingIndex] = useState(-1);

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false,
            location: ""
        };
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const generateDescription = async (index) => {
        const experience = data[index];
        if (!experience.position || !experience.company) {
            toast.error("Please enter Job Title and Company first.");
            return;
        }

        setGeneratingIndex(index);
        const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`
        try {
            const { data } = await api.post('/api/ai/enhance-job-desc', { userContent: prompt }, { headers: { Authorization: token } })
            updateExperience(index, "description", data.enhancedContent);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setGeneratingIndex(-1);
        }
    }

    return (
        <div className='max-w-3xl mx-auto space-y-10 pb-16 font-sans'>

            {/* Header Section */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6'>
                <div className="space-y-2">
                    <h3 className='text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                        <div className="p-2.5 bg-orange-50 rounded-xl text-primary-accent shadow-sm">
                            <Briefcase className="size-6" />
                        </div>
                        Work Experience
                    </h3>
                    <p className='text-sm font-medium text-slate-500 italic tracking-tight overflow-hidden'>Showcase your professional growth and impact.</p>
                </div>
                <button
                    onClick={addExperience}
                    className='group w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/40 active:scale-95 transition-all'
                >
                    <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
                    <span>Add Role</span>
                </button>
            </div>

            {/* Empty State */}
            {data.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20 hover:bg-orange-50/30 hover:border-primary-accent/30 transition-all duration-500 cursor-pointer group' onClick={addExperience}>
                    <div className="size-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Briefcase className='size-10 text-slate-200 group-hover:text-primary-accent transition-colors' />
                    </div>
                    <p className='text-slate-900 font-black text-lg tracking-tight'>No experience added yet</p>
                    <p className='text-slate-400 text-sm mt-1 font-medium'>Click here to start documenting your career.</p>
                </div>
            ) : (
                <div className='space-y-8'>
                    {data.map((experience, index) => (
                        <div key={index} className='group relative bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden'>

                            {/* Card Header / Delete Button */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => removeExperience(index)}
                                    className='p-3 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl shadow-sm transition-all'
                                    title="Delete Entry"
                                >
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            <div className='p-5 sm:p-8 md:p-10 space-y-8'>
                                {/* Row 1: Title & Company */}
                                <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Full Job Title</label>
                                        <div className="relative group/input">
                                            <Briefcase className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={experience.position || ""}
                                                onChange={(e) => updateExperience(index, "position", e.target.value)}
                                                type="text"
                                                placeholder='e.g. Lead Design Engineer'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>

                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Organization / Company</label>
                                        <div className="relative group/input">
                                            <Building2 className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={experience.company || ""}
                                                onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                type="text"
                                                placeholder='e.g. SpaceX'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Dates */}
                                <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div className='space-y-2.5'>
                                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Joined In</label>
                                            <input
                                                value={experience.start_date || ""}
                                                onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                                                type="month"
                                                className='w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>

                                        <div className={`space-y-2.5 transition-all duration-300 ${experience.is_current ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                                            <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Resigned In</label>
                                            <input
                                                value={experience.end_date || ""}
                                                onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                                type="month"
                                                disabled={experience.is_current}
                                                className='w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>

                                    <div className='flex items-center md:pt-8'>
                                        <label className='flex items-center gap-4 cursor-pointer group/check'>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={experience.is_current || false}
                                                    onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-6 h-6 border-2 border-slate-200 rounded-lg transition-all peer-checked:bg-primary-accent peer-checked:border-primary-accent peer-checked:shadow-lg peer-checked:shadow-orange-500/30"></div>
                                                <svg className="absolute w-4 h-4 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className='text-sm font-black text-slate-500 group-hover/check:text-primary-accent transition-colors uppercase tracking-widest'>Presently Working</span>
                                        </label>
                                    </div>

                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Location</label>
                                        <div className="relative group/input">
                                            <MapPin className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={experience.location || ""}
                                                onChange={(e) => updateExperience(index, "location", e.target.value)}
                                                type="text"
                                                placeholder='e.g. Mountain View, CA'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Description & AI */}
                                <div className='space-y-4 pt-4'>
                                    <div className='flex items-center justify-between'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>
                                            Key Responsibilities & Projects
                                        </label>

                                        <button
                                            onClick={() => generateDescription(index)}
                                            disabled={generatingIndex === index || !experience.position || !experience.company}
                                            className='flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-full shadow-lg hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:shadow-none transition-all'
                                        >
                                            {generatingIndex === index ? (
                                                <Loader2 className='size-3.5 animate-spin text-orange-400' />
                                            ) : (
                                                <Sparkles className='size-3.5 text-orange-400' />
                                            )}
                                            <span>{generatingIndex === index ? "Refining Text..." : "AI Intelligence"}</span>
                                        </button>
                                    </div>

                                    <textarea
                                        value={experience.description || ""}
                                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                                        rows={6}
                                        className='w-full px-6 py-5 bg-white border border-slate-200 rounded-xl text-sm font-medium leading-relaxed text-slate-800 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all resize-none shadow-sm'
                                        placeholder='Describe your impact...'
                                    />
                                    <div className="flex justify-end gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        <span>Pro-tip: Focus on metrics & results.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
          .text-primary-accent { color: #F95200; }
          .bg-primary-accent { background-color: #F95200; }
          .border-primary-accent { border-color: #F95200; }
          .focus\\:border-primary-accent:focus { border-color: #F95200; }
          .focus\\:ring-orange-500\\/5:focus { --tw-ring-color: rgba(249, 82, 0, 0.05); }
      `}</style>
        </div>
    )
}

export default ExperienceForm