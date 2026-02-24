import { FileText, FolderOpen, Layers, Plus, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';
import React from 'react'

const ProjectForm = ({ data, onChange }) => {

    const parseDescriptionToPoints = (description) => {
        if (!description) return [];

        return description
            .split('\n')
            .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
            .filter(Boolean);
    };

    const getProjectPoints = (project) => {
        if (Array.isArray(project?.points) && project.points.length > 0) {
            return project.points;
        }

        const parsedPoints = parseDescriptionToPoints(project?.description || '');
        return parsedPoints.length > 0 ? parsedPoints : [''];
    };

    const addProjects = () => {
        const newProject = {
            name: "",
            type: "",
            description: "",
            points: [""],
            date: "",
            link: "",
        }
        onChange([...data, newProject]);
    }

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateProject = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const syncProjectPoints = (index, points) => {
        const updated = [...data];
        const cleanedDescription = points
            .map((point) => point.trim())
            .filter(Boolean)
            .join('\n');

        updated[index] = {
            ...updated[index],
            points,
            description: cleanedDescription,
        };

        onChange(updated);
    };

    const addProjectPoint = (index) => {
        const project = data[index] || {};
        const points = getProjectPoints(project);
        syncProjectPoints(index, [...points, '']);
    };

    const removeProjectPoint = (projectIndex, pointIndex) => {
        const project = data[projectIndex] || {};
        const points = getProjectPoints(project);
        const updatedPoints = points.filter((_, idx) => idx !== pointIndex);
        syncProjectPoints(projectIndex, updatedPoints.length > 0 ? updatedPoints : ['']);
    };

    const updateProjectPoint = (projectIndex, pointIndex, value) => {
        const project = data[projectIndex] || {};
        const points = getProjectPoints(project);
        const updatedPoints = [...points];
        updatedPoints[pointIndex] = value;
        syncProjectPoints(projectIndex, updatedPoints);
    };

    return (
        <div className='max-w-3xl mx-auto space-y-10 pb-16 font-sans'>

            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6'>
                <div className="space-y-2">
                    <h3 className='text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                        <div className="p-2.5 bg-orange-50 rounded-xl text-primary-accent shadow-sm">
                            <FolderOpen className="size-6" />
                        </div>
                        Key Projects
                    </h3>
                    <p className='text-sm font-medium text-slate-500 italic tracking-tight overflow-hidden'>Showcase your best builds and impact.</p>
                </div>
                <button
                    onClick={addProjects}
                    className='group w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/40 active:scale-95 transition-all'
                >
                    <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
                    <span>Add Project</span>
                </button>
            </div>

            {/* Empty State */}
            {data.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20 hover:bg-orange-50/30 hover:border-primary-accent/30 transition-all duration-500 cursor-pointer group' onClick={addProjects}>
                    <div className="size-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <FolderOpen className='size-10 text-slate-200 group-hover:text-primary-accent transition-colors' />
                    </div>
                    <p className='text-slate-900 font-black text-lg tracking-tight'>No projects added yet</p>
                    <p className='text-slate-400 text-sm mt-1 font-medium'>Highlight a project you're truly proud of.</p>
                </div>
            ) : (
                <div className='space-y-8'>
                    {data.map((project, index) => (
                        <div key={index} className='group relative bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden'>

                            {/* Delete Button */}
                            <div className="hidden md:block absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => removeProject(index)}
                                    className='p-3 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl shadow-sm transition-all'
                                    title="Delete Entry"
                                >
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            <div className='p-5 sm:p-8 md:p-10 space-y-8'>
                                {(() => {
                                    const projectPoints = getProjectPoints(project);

                                    return (
                                        <>
                                            <div className="md:hidden flex justify-end">
                                                <button
                                                    onClick={() => removeProject(index)}
                                                    className='p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg shadow-sm transition-all'
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 className='size-4' />
                                                </button>
                                            </div>

                                            {/* Row 1: Name & Type */}
                                            <div className='grid md:grid-cols-2 gap-6 md:gap-8'>
                                                <div className='space-y-2.5'>
                                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Project Identification</label>
                                                    <div className="relative group/input">
                                                        <FolderOpen className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                                        <input
                                                            value={project.name || ""}
                                                            onChange={(e) => updateProject(index, "name", e.target.value)}
                                                            type="text"
                                                            placeholder='e.g. AI-Powered CRM'
                                                            className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='space-y-2.5'>
                                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Architecture / Stack</label>
                                                    <div className="relative group/input">
                                                        <Layers className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                                        <input
                                                            value={project.type || ""}
                                                            onChange={(e) => updateProject(index, "type", e.target.value)}
                                                            type="text"
                                                            placeholder='e.g. Next.js, PostgreSQL'
                                                            className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: Points-wise Summary */}
                                            <div className='space-y-4 pt-4'>
                                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.16em] ml-1 flex items-center gap-2'>
                                                        <FileText className="size-4 text-primary-accent/50" />
                                                        Points-wise Project Summary
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => addProjectPoint(index)}
                                                        className='w-full sm:w-auto px-3 py-2 bg-slate-900 text-white text-[11px] font-black rounded-lg hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-wider'
                                                    >
                                                        <Plus className='size-3.5 inline mr-1.5' />
                                                        Add Point
                                                    </button>
                                                </div>

                                                <div className='space-y-3'>
                                                    {projectPoints.map((point, pointIndex) => (
                                                        <div key={pointIndex} className='flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3'>
                                                            <div className='flex items-start gap-3 w-full min-w-0'>
                                                                <span className='mt-3.5 size-1.5 rounded-full bg-primary-accent/50 shrink-0'></span>
                                                                <input
                                                                    type="text"
                                                                    value={point}
                                                                    onChange={(e) => updateProjectPoint(index, pointIndex, e.target.value)}
                                                                    placeholder={`Point ${pointIndex + 1}: Describe impact, contribution, or result`}
                                                                    className='w-full min-w-0 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProjectPoint(index, pointIndex)}
                                                                className='self-end sm:self-auto p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition-all sm:mt-1'
                                                                title="Remove point"
                                                            >
                                                                <Trash2 className='size-4' />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                                    <span>Add as many points as needed for this project.</span>
                                                </div>
                                            </div>

                                            {/* Row 3: Date & Link */}
                                            <div className='grid md:grid-cols-2 gap-6 md:gap-8 pt-4 border-t border-slate-100'>
                                                <div className='space-y-2.5'>
                                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Project Date</label>
                                                    <div className="relative group/input">
                                                        <Calendar className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                                        <input
                                                            value={project.date || ""}
                                                            onChange={(e) => updateProject(index, "date", e.target.value)}
                                                            type="month"
                                                            className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='space-y-2.5'>
                                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1'>Project Link / URL</label>
                                                    <div className="relative group/input">
                                                        <LinkIcon className="absolute left-4 top-4 size-5 text-slate-400 group-focus-within/input:text-primary-accent transition-colors" />
                                                        <input
                                                            value={project.link || ""}
                                                            onChange={(e) => updateProject(index, "link", e.target.value)}
                                                            type="url"
                                                            placeholder='https://github.com/yourname/project'
                                                            className='w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    );
                                })()}

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

export default ProjectForm