import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Github } from "lucide-react";

const PolishedMinimalTemplate = ({ data, accentColor = '#1f2937' }) => {

    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
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
        <>
            <style>{`
          @media print {
            .shadow-xl, .shadow-lg { box-shadow: none !important; }
          }
        `}</style>
            <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-9 text-slate-800 shadow-xl font-sans leading-relaxed print:shadow-none">

                {/* --- HEADER --- */}
                <header className="text-center mb-8 border-b pb-8 border-slate-100">
                    <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-2 text-slate-900">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="text-lg font-medium text-slate-500 mb-4 tracking-wide">
                        {data.personal_info?.profession || "Professional Title"}
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[13px] text-slate-600 font-medium">
                        {data.personal_info?.email && (
                            <div className="flex items-center gap-1.5">
                                <Mail size={14} style={{ color: accentColor }} />
                                <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                            </div>
                        )}
                        {data.personal_info?.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone size={14} style={{ color: accentColor }} />
                                <span>{data.personal_info.phone}</span>
                            </div>
                        )}
                        {data.personal_info?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} style={{ color: accentColor }} />
                                <span>{data.personal_info.location}</span>
                            </div>
                        )}
                        {data.personal_info?.linkedin && (
                            <div className="flex items-center gap-1.5">
                                <Linkedin size={14} style={{ color: accentColor }} />
                                <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:underline">{data.personal_info.linkedin}</a>
                            </div>
                        )}
                        {data.personal_info?.website && (
                            <div className="flex items-center gap-1.5">
                                <Globe size={14} style={{ color: accentColor }} />
                                <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:underline">{data.personal_info.website}</a>
                            </div>
                        )}
                        {data.personal_info?.github && (
                            <div className="flex items-center gap-1.5">
                                <Github size={14} style={{ color: accentColor }} />
                                <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:underline">{data.personal_info.github}</a>
                            </div>
                        )}
                    </div>
                </header>

                <div className="space-y-7 px-2">

                    {/* --- SUMMARY --- */}
                    {data.professional_summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
                                Professional Profile
                            </h2>
                            <p className="text-slate-700 leading-6 text-[13px]">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* --- EXPERIENCE --- */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                Work Experience
                            </h2>

                            <div className="space-y-5">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                            <h3 className="font-bold text-base text-slate-900">{exp.position}</h3>
                                            <div className="flex items-center gap-1 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                                                <Calendar size={12} />
                                                <span>{formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                            </div>
                                        </div>

                                        <div className="text-[13px] font-semibold text-slate-600 mb-2">
                                            {exp.company}
                                        </div>

                                        {exp.description && (
                                            <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-slate-100">
                                                {exp.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- PROJECTS --- */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {data.project.map((proj, index) => (
                                    <div key={index} className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-2 w-full">
                                            <h3 className="font-bold text-slate-900 min-w-0">
                                                {proj.name}
                                                {proj.link && (
                                                    <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="ml-2 text-[12px] font-bold hover:underline" style={{ color: accentColor }}>View Project</a>
                                                )}
                                            </h3>
                                            {proj.date && <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
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

                    {/* --- EDUCATION & SKILLS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Education */}
                        {data.education && data.education.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                    Education
                                </h2>
                                <div className="space-y-3">
                                    {data.education.map((edu, index) => (
                                        <div key={index}>
                                            <div className="font-bold text-slate-900">{edu.degree}</div>
                                            <div className="text-[13px] text-slate-600 font-medium">{edu.institution}</div>
                                            <div className="text-[13px] text-slate-400 mt-1">
                                                Graduated: {formatDate(edu.graduation_date)}
                                                {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {flatSkills && flatSkills.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                    Core Competencies
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {flatSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-md border border-slate-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certificates */}
                        {flatCertificates && flatCertificates.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                    Certificates
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {flatCertificates.map((cert, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-md border border-slate-200"
                                        >
                                            {cert.subheading}
                                            {cert.description ? ` — ${cert.description}` : ''}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default PolishedMinimalTemplate;