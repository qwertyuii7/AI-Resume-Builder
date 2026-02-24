import { Lightbulb, Plus, Sparkles, Tag, X, Zap, Edit3, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';

const SkillsForm = ({ data, onChange }) => {

    // Ensure data is always an object format
    const skillsData = (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};

    const [newSkill, setNewSkill] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    
    // Initialize expanded categories - all categories start expanded
    const [expandedCategories, setExpandedCategories] = useState(() => {
        const initial = {};
        Object.keys(skillsData).forEach(cat => {
            initial[cat] = true;
        });
        return initial;
    });

    // Update expanded categories when skillsData changes (e.g., when loading a resume)
    useEffect(() => {
        setExpandedCategories(prevExpanded => {
            const updated = { ...prevExpanded };
            // Add any new categories that aren't in expanded state yet
            Object.keys(skillsData).forEach(cat => {
                if (!(cat in updated)) {
                    updated[cat] = true;
                }
            });
            // Remove categories that no longer exist
            Object.keys(updated).forEach(cat => {
                if (!(cat in skillsData)) {
                    delete updated[cat];
                }
            });
            return updated;
        });
    }, [Object.keys(skillsData).join(',')]); // Only trigger when category names change

    const popularSkills = ["JavaScript", "React", "Python", "Node.js", "Leadership", "Communication", "SQL", "Design"];

    const totalSkills = Object.values(skillsData).reduce((sum, skills) => sum + skills.length, 0);

    // Add a new skill to a category
    const addSkillToCategory = (category, skillToAdd = null) => {
        const skill = skillToAdd || newSkill;

        if (skill.trim() && category) {
            const categorySkills = skillsData[category] || [];
            if (!categorySkills.includes(skill.trim())) {
                const updated = {
                    ...skillsData,
                    [category]: [...categorySkills, skill.trim()]
                };
                onChange(updated);
                setNewSkill("");
                if (!expandedCategories[category]) {
                    setExpandedCategories(prev => ({ ...prev, [category]: true }));
                }
            } else {
                toast.error(`${skill} already exists in ${category}!`);
            }
        }
    };

    // Remove a skill from a category
    const removeSkill = (category, skillIndex) => {
        const updated = {
            ...skillsData,
            [category]: skillsData[category].filter((_, i) => i !== skillIndex)
        };
        onChange(updated);
    };

    // Add a new category
    const addCategory = () => {
        if (newCategory.trim() && !skillsData[newCategory.trim()]) {
            const trimmedCategory = newCategory.trim();
            const updated = {
                ...skillsData,
                [trimmedCategory]: []
            };
            onChange(updated);
            setNewCategory("");
            setExpandedCategories(prev => ({ ...prev, [trimmedCategory]: true }));
            toast.success(`Category "${trimmedCategory}" added!`);
        } else if (skillsData[newCategory.trim()]) {
            toast.error("Category already exists!");
        }
    };

    // Remove a category
    const removeCategory = (category) => {
        const updated = { ...skillsData };
        delete updated[category];
        onChange(updated);
        toast.success(`Category "${category}" removed!`);
    };

    // Rename a category
    const renameCategory = (oldName, newName) => {
        if (!newName.trim() || newName === oldName) {
            setEditingCategory(null);
            return;
        }
        if (skillsData[newName.trim()]) {
            toast.error("Category name already exists!");
            return;
        }
        const updated = { ...skillsData };
        updated[newName.trim()] = updated[oldName];
        delete updated[oldName];
        onChange(updated);
        setEditingCategory(null);
        setExpandedCategories(prev => {
            const newExp = { ...prev };
            delete newExp[oldName];
            newExp[newName.trim()] = true;
            return newExp;
        });
        toast.success(`Category renamed to "${newName}"!`);
    };

    const handleKeyPress = (e, action, ...args) => {
        if (e.key === "Enter") {
            e.preventDefault();
            action(...args);
        }
    };

    return (
        <div className='max-w-3xl mx-auto space-y-10 pb-16 font-sans'>

            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6'>
                <div className="space-y-2">
                    <h3 className='text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                        <div className="p-2.5 bg-orange-50 rounded-xl text-primary-accent shadow-sm">
                            <Zap className="size-6" />
                        </div>
                        Skills & Expertise
                    </h3>
                    <p className='text-sm font-medium text-slate-500 italic tracking-tight overflow-hidden'>Organize skills by category</p>
                </div>
                <div className="w-full sm:w-auto text-center sm:text-left text-[10px] font-black text-primary-accent bg-orange-50 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-orange-100/50">
                    {totalSkills} Superpowers
                </div>
            </div>

            {/* Add New Category Section */}
            <div className="space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Add Category</h4>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <input
                        type="text"
                        placeholder='e.g., Programming Languages, Tools & DevOps'
                        className='flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                        onChange={(e) => setNewCategory(e.target.value)}
                        value={newCategory}
                        onKeyDown={(e) => handleKeyPress(e, addCategory)}
                    />
                    <button
                        onClick={addCategory}
                        disabled={!newCategory.trim()}
                        className='px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-lg hover:bg-slate-800 active:scale-95 disabled:opacity-30 transition-all'
                    >
                        <Plus className='size-4 inline mr-2' />
                        Add
                    </button>
                </div>
            </div>

            {/* Skills by Category */}
            <div className="space-y-6">
                {Object.keys(skillsData).length > 0 ? (
                    Object.entries(skillsData).map(([category, skills]) => (
                        <div key={category} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Category Header */}
                            <div className="bg-gradient-to-r from-slate-50 to-orange-50/20 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <svg className={`size-5 transition-transform ${expandedCategories[category] ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                        </svg>
                                    </button>

                                    {editingCategory === category ? (
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            className='flex-1 px-3 py-2 bg-white border border-primary-accent rounded-lg text-sm font-black text-slate-900 focus:ring-2 focus:ring-orange-500/20 outline-none'
                                            onKeyDown={(e) => handleKeyPress(e, renameCategory, category, editingCategoryName)}
                                            autoFocus
                                        />
                                    ) : (
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{category}</h4>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingCategory === category ? (
                                        <button
                                            onClick={() => renameCategory(category, editingCategoryName)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                            title="Save"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingCategory(category);
                                                setEditingCategoryName(category);
                                            }}
                                            className="p-2 text-slate-400 hover:text-primary-accent hover:bg-orange-50 rounded-lg transition-all"
                                            title="Rename"
                                        >
                                            <Edit3 className="size-4" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => removeCategory(category)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Remove Category"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Category Content */}
                            {expandedCategories[category] && (
                                <div className="p-6 space-y-6">
                                    {/* Add Skill Input */}
                                    <div className='flex flex-col sm:flex-row gap-3'>
                                        <input
                                            type="text"
                                            placeholder={`Add skill to ${category}...`}
                                            className='flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            value={newSkill}
                                            onKeyDown={(e) => handleKeyPress(e, addSkillToCategory, category)}
                                        />
                                        <button
                                            onClick={() => addSkillToCategory(category)}
                                            disabled={!newSkill.trim()}
                                            className='px-6 py-3 bg-primary-accent text-white text-sm font-black rounded-lg hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 disabled:opacity-30 transition-all'
                                        >
                                            <Plus className='size-4 inline mr-2' />
                                            Add
                                        </button>
                                    </div>

                                    {/* Skills List */}
                                    {skills.length > 0 ? (
                                        <div className='flex flex-wrap gap-3'>
                                            {skills.map((skill, skillIdx) => (
                                                <div
                                                    key={skillIdx}
                                                    className='group flex items-center gap-2 pl-4 pr-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold hover:border-primary-accent hover:text-primary-accent hover:shadow-lg hover:shadow-orange-500/10 transition-all animate-in fade-in zoom-in duration-300 shadow-sm'
                                                >
                                                    <Tag className="size-3.5 text-primary-accent/50" />
                                                    <span className="truncate">{skill}</span>
                                                    <button
                                                        onClick={() => removeSkill(category, skillIdx)}
                                                        className='ml-0.5 p-1 text-slate-300 hover:text-white hover:bg-red-500 rounded-full transition-all'
                                                        title="Remove"
                                                    >
                                                        <X className='size-3.5' />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200'>
                                            <p className='text-slate-400 text-sm font-medium'>No skills added yet. Add some above!</p>
                                        </div>
                                    )}

                                    {/* Quick Add Suggestions */}
                                    {skills.length === 0 && (
                                        <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-slate-200">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Stacks:</span>
                                            {popularSkills.map((skill) => (
                                                <button
                                                    key={skill}
                                                    onClick={() => addSkillToCategory(category, skill)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-500 hover:border-primary-accent hover:text-primary-accent hover:bg-orange-50 transition-all flex items-center gap-1 shadow-sm active:scale-95"
                                                >
                                                    <Plus className="size-3" /> {skill}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className='text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20 group'>
                        <div className="inline-flex items-center justify-center p-5 bg-white rounded-2xl mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                            <Sparkles className='size-8 text-slate-200 group-hover:text-primary-accent transition-colors' />
                        </div>
                        <p className='text-slate-900 font-black text-lg tracking-tight'>No Categories Yet</p>
                        <p className='text-slate-400 text-sm mt-1 font-medium'>Add a category above to get started organizing your skills.</p>
                    </div>
                )}
            </div>

            {/* Pro Tip */}
            <div className='flex gap-5 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden'>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-orange-500 opacity-10 rounded-full blur-2xl"></div>
                <div className="p-3 bg-primary-accent rounded-xl h-fit shrink-0 shadow-lg shadow-orange-500/20">
                    <Lightbulb className="size-6 text-white" />
                </div>
                <div className="space-y-2 relative z-10">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        Pro Organization Tip
                        <span className="inline-flex w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                    </h4>
                    <p className='text-xs text-slate-300 leading-relaxed font-medium'>
                        Create meaningful categories like <strong className="text-white">Programming Languages</strong>, <strong className="text-white">Tools & DevOps</strong>, <strong className="text-white">Soft Skills</strong>, etc. This makes your resume more scannable and helps ATS systems parse your expertise better.
                    </p>
                </div>
            </div>

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

export default SkillsForm