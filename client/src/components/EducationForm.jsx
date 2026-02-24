import { Award, BookOpen, Calendar, GraduationCap, MapPin, Plus, School, Trash2 } from 'lucide-react';
import React from 'react'

const EducationForm = ({ data, onChange }) => {

    const addEducation = () => {
        const newEduaction = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: "",
            location: ""
        };
        onChange([...data, newEduaction])
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='max-w-3xl mx-auto space-y-10 pb-16 font-sans'>

            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6'>
                <div className="space-y-2">
                    <h3 className='text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                        <div className="p-2.5 bg-orange-50 rounded-xl text-primary-accent shadow-sm">
                            <GraduationCap className="size-6" />
                        </div>
                        Education
                    </h3>
                    <p className='text-sm font-medium text-slate-500 italic tracking-tight overflow-hidden'>Your academic degrees and foundation.</p>
                </div>
                <button
                    onClick={addEducation}
                    className='group w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/40 active:scale-95 transition-all'
                >
                    <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
                    <span>Add Study</span>
                </button>
            </div>

            {/* Empty State */}
            {data.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20 hover:bg-orange-50/30 hover:border-primary-accent/30 transition-all duration-500 cursor-pointer group' onClick={addEducation}>
                    <div className="size-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <GraduationCap className='size-10 text-slate-200 group-hover:text-primary-accent transition-colors' />
                    </div>
                    <p className='text-slate-900 font-black text-lg tracking-tight'>No education listed yet</p>
                    <p className='text-slate-400 text-sm mt-1 font-medium italic'>Click here to add your academic background.</p>
                </div>
            ) : (
                <div className='space-y-8'>
                    {data.map((education, index) => (
                        <div key={index} className='group relative bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden'>

                            {/* Delete Button */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => removeEducation(index)}
                                    className='p-3 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl shadow-sm transition-all'
                                    title="Remove Entry"
                                >
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            <div className='p-5 sm:p-8 md:p-10 space-y-8'>
                                {/* Row 1: Institution Name */}
                                <div className='space-y-2.5'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Institution / University</label>
                                    <div className="relative group/input">
                                        <School className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                        <input
                                            value={education.institution || ""}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            type="text"
                                            placeholder='e.g. Stanford University'
                                            className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Degree & Field */}
                                <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Degree</label>
                                        <div className="relative group/input">
                                            <GraduationCap className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={education.degree || ""}
                                                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                type="text"
                                                placeholder="e.g. Bachelor's"
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Field of Study</label>
                                        <div className="relative group/input">
                                            <BookOpen className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={education.field || ""}
                                                onChange={(e) => updateEducation(index, "field", e.target.value)}
                                                type="text"
                                                placeholder='e.g. Computer Science'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3: Date & GPA */}
                                <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Graduation Date</label>
                                        <div className="relative">
                                            <input
                                                value={education.graduation_date || ""}
                                                onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                                                type="month"
                                                className='w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>

                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>GPA / Grade (Optional)</label>
                                        <div className="relative group/input">
                                            <Award className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={education.gpa || ""}
                                                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                                type="text"
                                                placeholder='e.g. 3.8/4.0'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
                                    </div>

                                    <div className='space-y-2.5'>
                                        <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Location</label>
                                        <div className="relative group/input">
                                            <MapPin className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                            <input
                                                value={education.location || ""}
                                                onChange={(e) => updateEducation(index, "location", e.target.value)}
                                                type="text"
                                                placeholder='e.g. Atlanta, GA'
                                                className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            />
                                        </div>
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

export default EducationForm