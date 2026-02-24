import { Lightbulb, Plus, Trophy, X, Edit3, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const normalizeCertificateEntry = (entry) => {
    if (typeof entry === 'string') {
        return { subheading: entry, description: '' };
    }

    if (entry && typeof entry === 'object') {
        return {
            subheading: entry.subheading || entry.title || entry.name || '',
            description: entry.description || entry.details || '',
        };
    }

    return { subheading: '', description: '' };
};

const normalizeCertificatesData = (input) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {};
    }

    return Object.entries(input).reduce((acc, [heading, entries]) => {
        if (!Array.isArray(entries)) {
            acc[heading] = [];
            return acc;
        }

        acc[heading] = entries
            .map(normalizeCertificateEntry)
            .filter((entry) => entry.subheading.trim() || entry.description.trim());

        return acc;
    }, {});
};

const CertificatesForm = ({ data, onChange }) => {
    const certificatesData = normalizeCertificatesData(data);

    const [newHeading, setNewHeading] = useState('');
    const [editingHeading, setEditingHeading] = useState(null);
    const [editingHeadingName, setEditingHeadingName] = useState('');
    const [subheadingDrafts, setSubheadingDrafts] = useState({});
    const [expandedHeadings, setExpandedHeadings] = useState(() => {
        const initial = {};
        Object.keys(certificatesData).forEach((heading) => {
            initial[heading] = true;
        });
        return initial;
    });

    useEffect(() => {
        setExpandedHeadings((prevExpanded) => {
            const updated = { ...prevExpanded };

            Object.keys(certificatesData).forEach((heading) => {
                if (!(heading in updated)) {
                    updated[heading] = true;
                }
            });

            Object.keys(updated).forEach((heading) => {
                if (!(heading in certificatesData)) {
                    delete updated[heading];
                }
            });

            return updated;
        });
    }, [Object.keys(certificatesData).join(',')]);

    const totalSubheadings = Object.values(certificatesData).reduce(
        (sum, entries) => sum + (Array.isArray(entries) ? entries.length : 0),
        0
    );

    const updateSubheadingDraft = (heading, field, value) => {
        setSubheadingDrafts((prev) => ({
            ...prev,
            [heading]: {
                subheading: prev[heading]?.subheading || '',
                description: prev[heading]?.description || '',
                [field]: value,
            },
        }));
    };

    const addHeading = () => {
        const trimmedHeading = newHeading.trim();

        if (!trimmedHeading) return;

        if (certificatesData[trimmedHeading]) {
            toast.error('Heading already exists!');
            return;
        }

        onChange({
            ...certificatesData,
            [trimmedHeading]: [],
        });

        setNewHeading('');
        setExpandedHeadings((prev) => ({ ...prev, [trimmedHeading]: true }));
        toast.success(`Heading "${trimmedHeading}" added!`);
    };

    const removeHeading = (heading) => {
        const updated = { ...certificatesData };
        delete updated[heading];
        onChange(updated);
        toast.success(`Heading "${heading}" removed!`);
    };

    const renameHeading = (oldName, newName) => {
        const trimmedNewName = newName.trim();

        if (!trimmedNewName || trimmedNewName === oldName) {
            setEditingHeading(null);
            return;
        }

        if (certificatesData[trimmedNewName]) {
            toast.error('Heading name already exists!');
            return;
        }

        const updated = { ...certificatesData };
        updated[trimmedNewName] = updated[oldName];
        delete updated[oldName];
        onChange(updated);

        setEditingHeading(null);
        setExpandedHeadings((prev) => {
            const next = { ...prev };
            delete next[oldName];
            next[trimmedNewName] = true;
            return next;
        });

        setSubheadingDrafts((prev) => {
            const next = { ...prev };
            if (next[oldName]) {
                next[trimmedNewName] = next[oldName];
                delete next[oldName];
            }
            return next;
        });

        toast.success(`Heading renamed to "${trimmedNewName}"!`);
    };

    const addSubheading = (heading) => {
        const draft = subheadingDrafts[heading] || { subheading: '', description: '' };
        const subheading = draft.subheading.trim();
        const description = draft.description.trim();

        if (!certificatesData[heading]) {
            toast.error('Add a heading first.');
            return;
        }

        if (!subheading) {
            toast.error('Subheading is required.');
            return;
        }

        const existingEntries = certificatesData[heading] || [];
        const duplicateExists = existingEntries.some(
            (entry) => entry.subheading?.trim().toLowerCase() === subheading.toLowerCase()
        );

        if (duplicateExists) {
            toast.error(`Subheading "${subheading}" already exists in ${heading}.`);
            return;
        }

        onChange({
            ...certificatesData,
            [heading]: [...existingEntries, { subheading, description }],
        });

        setSubheadingDrafts((prev) => ({
            ...prev,
            [heading]: { subheading: '', description: '' },
        }));
    };

    const removeSubheading = (heading, entryIndex) => {
        onChange({
            ...certificatesData,
            [heading]: certificatesData[heading].filter((_, idx) => idx !== entryIndex),
        });
    };

    const handleKeyPress = (event, action, ...args) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            action(...args);
        }
    };

    return (
        <div className='max-w-3xl mx-auto space-y-10 pb-16 font-sans'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6'>
                <div className='space-y-2'>
                    <h3 className='text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                        <div className='p-2.5 bg-orange-50 rounded-xl text-primary-accent shadow-sm'>
                            <Trophy className='size-6' />
                        </div>
                        Certificates & Credentials
                    </h3>
                    <p className='text-sm font-medium text-slate-500 italic tracking-tight overflow-hidden'>
                        Add a heading, then subheadings with descriptions
                    </p>
                </div>
                <div className='w-full sm:w-auto text-center sm:text-left text-[10px] font-black text-primary-accent bg-orange-50 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-orange-100/50'>
                    {totalSubheadings} Subheadings
                </div>
            </div>

            <div className='space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200'>
                <h4 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Add Certificates Heading</h4>
                <div className='flex flex-col sm:flex-row gap-3'>
                    <input
                        type='text'
                        placeholder='e.g., Cloud Certifications, Security Certifications'
                        className='flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                        onChange={(event) => setNewHeading(event.target.value)}
                        value={newHeading}
                        onKeyDown={(event) => handleKeyPress(event, addHeading)}
                    />
                    <button
                        onClick={addHeading}
                        disabled={!newHeading.trim()}
                        className='px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-lg hover:bg-slate-800 active:scale-95 disabled:opacity-30 transition-all'
                    >
                        <Plus className='size-4 inline mr-2' />
                        Add
                    </button>
                </div>
            </div>

            <div className='space-y-6'>
                {Object.keys(certificatesData).length > 0 ? (
                    Object.entries(certificatesData).map(([heading, entries]) => (
                        <div key={heading} className='border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                            <div className='bg-gradient-to-r from-slate-50 to-orange-50/20 px-6 py-4 flex items-center justify-between border-b border-slate-200'>
                                <div className='flex items-center gap-3 flex-1'>
                                    <button
                                        onClick={() => setExpandedHeadings((prev) => ({ ...prev, [heading]: !prev[heading] }))}
                                        className='text-slate-400 hover:text-slate-600 transition-colors'
                                    >
                                        <svg className={`size-5 transition-transform ${expandedHeadings[heading] ? 'rotate-90' : ''}`} fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' />
                                        </svg>
                                    </button>

                                    {editingHeading === heading ? (
                                        <input
                                            type='text'
                                            value={editingHeadingName}
                                            onChange={(event) => setEditingHeadingName(event.target.value)}
                                            className='flex-1 px-3 py-2 bg-white border border-primary-accent rounded-lg text-sm font-black text-slate-900 focus:ring-2 focus:ring-orange-500/20 outline-none'
                                            onKeyDown={(event) => handleKeyPress(event, renameHeading, heading, editingHeadingName)}
                                            autoFocus
                                        />
                                    ) : (
                                        <h4 className='text-sm font-black text-slate-900 uppercase tracking-widest'>{heading}</h4>
                                    )}
                                </div>

                                <div className='flex items-center gap-2'>
                                    {editingHeading === heading ? (
                                        <button
                                            onClick={() => renameHeading(heading, editingHeadingName)}
                                            className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all'
                                            title='Save'
                                        >
                                            <Check className='size-4' />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingHeading(heading);
                                                setEditingHeadingName(heading);
                                            }}
                                            className='p-2 text-slate-400 hover:text-primary-accent hover:bg-orange-50 rounded-lg transition-all'
                                            title='Rename'
                                        >
                                            <Edit3 className='size-4' />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => removeHeading(heading)}
                                        className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
                                        title='Remove Heading'
                                    >
                                        <X className='size-4' />
                                    </button>
                                </div>
                            </div>

                            {expandedHeadings[heading] && (
                                <div className='p-6 space-y-6'>
                                    <div className='space-y-3'>
                                        <input
                                            type='text'
                                            placeholder={`Subheading under ${heading} (e.g., AWS Solutions Architect)`}
                                            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm'
                                            onChange={(event) => updateSubheadingDraft(heading, 'subheading', event.target.value)}
                                            value={subheadingDrafts[heading]?.subheading || ''}
                                            onKeyDown={(event) => handleKeyPress(event, addSubheading, heading)}
                                        />

                                        <textarea
                                            rows={3}
                                            placeholder='Description for this subheading (optional)'
                                            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all shadow-sm resize-y'
                                            onChange={(event) => updateSubheadingDraft(heading, 'description', event.target.value)}
                                            value={subheadingDrafts[heading]?.description || ''}
                                        />

                                        <div className='flex justify-end'>
                                            <button
                                                onClick={() => addSubheading(heading)}
                                                disabled={!(subheadingDrafts[heading]?.subheading || '').trim()}
                                                className='px-6 py-3 bg-primary-accent text-white text-sm font-black rounded-lg hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 disabled:opacity-30 transition-all'
                                            >
                                                <Plus className='size-4 inline mr-2' />
                                                Add Subheading
                                            </button>
                                        </div>
                                    </div>

                                    {entries.length > 0 ? (
                                        <div className='space-y-3'>
                                            {entries.map((entry, entryIndex) => (
                                                <div key={entryIndex} className='group p-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-primary-accent hover:shadow-lg hover:shadow-orange-500/10 transition-all animate-in fade-in zoom-in duration-300 shadow-sm'>
                                                    <div className='flex items-start justify-between gap-3'>
                                                        <div className='min-w-0 flex-1'>
                                                            <div className='flex items-center gap-2'>
                                                                <Trophy className='size-3.5 text-primary-accent/50 shrink-0' />
                                                                <p className='text-sm font-bold text-slate-900 break-words'>{entry.subheading}</p>
                                                            </div>
                                                            {entry.description && (
                                                                <p className='mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line break-words'>
                                                                    {entry.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => removeSubheading(heading, entryIndex)}
                                                            className='p-1.5 text-slate-300 hover:text-white hover:bg-red-500 rounded-full transition-all shrink-0'
                                                            title='Remove'
                                                        >
                                                            <X className='size-3.5' />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='text-center py-8 bg-slate-50/50 rounded-lg border border-dashed border-slate-200'>
                                            <p className='text-slate-400 text-sm font-medium'>No subheadings yet. Add one above with an optional description.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className='text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20 group'>
                        <div className='inline-flex items-center justify-center p-5 bg-white rounded-2xl mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500'>
                            <Trophy className='size-8 text-slate-200 group-hover:text-primary-accent transition-colors' />
                        </div>
                        <p className='text-slate-900 font-black text-lg tracking-tight'>No Headings Yet</p>
                        <p className='text-slate-400 text-sm mt-1 font-medium'>Add a certificates heading above to unlock subheading creation.</p>
                    </div>
                )}
            </div>

            <div className='flex gap-5 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden'>
                <div className='absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-orange-500 opacity-10 rounded-full blur-2xl'></div>
                <div className='p-3 bg-primary-accent rounded-xl h-fit shrink-0 shadow-lg shadow-orange-500/20'>
                    <Lightbulb className='size-6 text-white' />
                </div>
                <div className='space-y-2 relative z-10'>
                    <h4 className='text-sm font-black text-white uppercase tracking-widest flex items-center gap-2'>
                        Pro Organization Tip
                        <span className='inline-flex w-2 h-2 rounded-full bg-orange-400 animate-pulse'></span>
                    </h4>
                    <p className='text-xs text-slate-300 leading-relaxed font-medium'>
                        Add a clear heading first (for example <strong className='text-white'>Cloud Certifications</strong>), then create subheadings such as certificate names and include short descriptions for context.
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
    );
};

export default CertificatesForm;
