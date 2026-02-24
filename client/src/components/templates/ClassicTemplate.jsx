import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";

const MinimalistTemplate = ({ data, accentColor = '#334155' }) => {

    // Helper to format dates cleanly
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    const getProjectPoints = (project) => {
        if (Array.isArray(project?.points) && project.points.length > 0) {
            return project.points.map((point) => String(point).trim()).filter(Boolean);
        }

        if (!project?.description) return [];

        return project.description
            .split('\n')
            .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
            .filter(Boolean);
    };

    // Helper to flatten skills from object or array format
    const getFlatSkills = () => {
        if (!data.skills) return [];
        if (Array.isArray(data.skills)) {
            return data.skills;
        }
        // Flatten object format: { "Category": ["Skill1", "Skill2"] }
        const flat = [];
        Object.values(data.skills).forEach(skills => {
            if (Array.isArray(skills)) {
                flat.push(...skills);
            }
        });
        return flat;
    };

    const flatSkills = getFlatSkills();

    // Helper to flatten certificates from object or array format
    const getFlatCertificates = () => {
        if (!data.certificates) return [];

        const normalizeCertificateEntry = (entry) => {
            if (typeof entry === 'string') {
                return { subheading: entry, description: "" };
            }

            if (entry && typeof entry === 'object') {
                return {
                    subheading: entry.subheading || entry.title || entry.name || "",
                    description: entry.description || entry.details || ""
                };
            }

            return { subheading: "", description: "" };
        };

        if (Array.isArray(data.certificates)) {
            return data.certificates.map(normalizeCertificateEntry).filter(entry => entry.subheading.trim());
        }

        const flat = [];
        Object.values(data.certificates).forEach(certs => {
            if (Array.isArray(certs)) {
                flat.push(...certs.map(normalizeCertificateEntry).filter(entry => entry.subheading.trim()));
            }
        });
        return flat;
    };

    const flatCertificates = getFlatCertificates();

    const normalizeUrl = (url) => {
        if (!url) return "";
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    return (
        <div className="max-w-[210mm] mx-auto p-8 bg-white text-slate-800 font-sans min-h-[297mm] shadow-lg print:shadow-none">

            {/* Print specific styles for this template */}
            <style>{`
              @media print {
                .max-w-[210mm] {
                  max-width: 210mm !important;
                  width: 210mm !important;
                  margin: 0 !important;
                  padding: 32pt !important;
                  box-shadow: none !important;
                }
                .shadow-lg {
                  box-shadow: none !important;
                }
              }
            `}</style>

            {/* --- HEADER --- */}
            <header className="flex justify-between items-start border-b pb-6 mb-6" style={{ borderColor: accentColor }}>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ color: accentColor }}>
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="text-base text-slate-500 font-medium tracking-wide">
                        {data.personal_info?.profession || "Professional Title"}
                    </p>
                </div>

                <div className="text-[13px] space-y-1.5 text-right text-slate-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center justify-end gap-2">
                            <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                            <Mail size={14} />
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center justify-end gap-2">
                            <span>{data.personal_info.phone}</span>
                            <Phone size={14} />
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center justify-end gap-2">
                            <span>{data.personal_info.location}</span>
                            <MapPin size={14} />
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center justify-end gap-2">
                            <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="truncate max-w-[200px] hover:underline">{data.personal_info.linkedin}</a>
                            <Linkedin size={14} />
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center justify-end gap-2">
                            <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="truncate max-w-[200px] hover:underline">{data.personal_info.website}</a>
                            <Globe size={14} />
                        </div>
                    )}
                </div>
            </header>

            <div className="space-y-5">

                {/* --- SUMMARY --- */}
                {data.professional_summary && (
                    <section>
                        <p className="text-slate-700 leading-relaxed text-[13px]">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* --- SKILLS (Grid Layout) --- */}
                {flatSkills && flatSkills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                            Core Competencies
                            <span className="h-[1px] flex-grow bg-slate-200"></span>
                        </h2>
                        <div className="grid grid-cols-3 gap-y-1.5 gap-x-3">
                            {flatSkills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 text-[13px] text-slate-700">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- CERTIFICATES --- */}
                {flatCertificates && flatCertificates.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                            Certificates
                            <span className="h-[1px] flex-grow bg-slate-200"></span>
                        </h2>
                        <div className="grid grid-cols-3 gap-y-1.5 gap-x-3">
                            {flatCertificates.map((cert, index) => (
                                <div key={index} className="flex items-center gap-2 text-[13px] text-slate-700">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                    <span>
                                        {cert.subheading}
                                        {cert.description ? ` — ${cert.description}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- EXPERIENCE --- */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                            Experience
                            <span className="h-[1px] flex-grow bg-slate-200"></span>
                        </h2>

                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-4 border-l-2 border-slate-100 hover:border-slate-300 transition-colors">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base text-slate-800">{exp.position}</h3>
                                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                            {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    <div className="text-[13px] font-medium text-slate-500 mb-2">{exp.company}</div>

                                    {exp.description && (
                                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- PROJECTS --- */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                            Key Projects
                            <span className="h-[1px] flex-grow bg-slate-200"></span>
                        </h2>

                        <div className="grid grid-cols-1 gap-2.5">
                            {data.project.map((proj, index) => (
                                <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-2 w-full">
                                        <div className="min-w-0 flex items-center gap-2">
                                            <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                            {proj.link && (
                                                <a href={normalizeUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:underline text-[12px] font-bold">
                                                    [Link]
                                                </a>
                                            )}
                                        </div>
                                        {proj.date && <span className="text-[12px] text-slate-500 whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
                                    </div>
                                    {proj.type && <p className="text-[12px] text-slate-500 mb-1.5">{proj.type}</p>}
                                    {getProjectPoints(proj).length > 0 && (
                                        <ul className="list-disc list-outside ml-4 text-[13px] text-slate-600 leading-relaxed space-y-1 marker:text-slate-300">
                                            {getProjectPoints(proj).map((point, pointIndex) => (
                                                <li key={pointIndex}>{point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- EDUCATION --- */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                            Education
                            <span className="h-[1px] flex-grow bg-slate-200"></span>
                        </h2>

                        <div className="space-y-3">
                            {data.education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{edu.institution}</h3>
                                        <p className="text-[13px] text-slate-600">
                                            {edu.degree} {edu.field && `• ${edu.field}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[13px] text-slate-500 block">{formatDate(edu.graduation_date)}</span>
                                        {edu.gpa && <span className="text-[13px] font-medium text-slate-400">GPA: {edu.gpa}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default MinimalistTemplate;