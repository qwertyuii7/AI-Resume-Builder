import React from 'react';
import { MapPin, Mail, Phone, Linkedin, Globe, ExternalLink } from 'lucide-react';

const ModernSidebarTemplate = ({ data, accentColor = '#2563eb' }) => {

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
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
            .shadow-xl { box-shadow: none !important; }
          }
        `}</style>
        <div className="flex w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl font-sans text-slate-800 print:shadow-none">

            {/* --- LEFT SIDEBAR (Personal Info, Skills, Education) --- */}
            <aside className="w-[32%] bg-slate-50 border-r border-slate-200 flex flex-col">

                {/* Profile Image */}
                <div className="p-6 pb-0 flex justify-center">
                    {data.personal_info?.image && (
                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden" style={{ borderColor: 'white' }}>
                            <img
                                src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Contact Info */}
                <div className="p-6 flex flex-col gap-2 text-[13px] leading-snug">
                    {data.personal_info?.email && (
                        <div className="flex items-start gap-3 text-slate-600 break-all">
                            <Mail size={16} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                            <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-3 text-slate-600">
                            <Phone size={16} className="shrink-0" style={{ color: accentColor }} />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-3 text-slate-600">
                            <MapPin size={16} className="shrink-0" style={{ color: accentColor }} />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-start gap-3 text-slate-600 break-all">
                            <Linkedin size={16} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                            <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{data.personal_info.linkedin}</a>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-start gap-3 text-slate-600 break-all">
                            <Globe size={16} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                            <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{data.personal_info.website}</a>
                        </div>
                    )}
                </div>

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <div className="px-6 py-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="font-bold text-slate-700 leading-tight">{edu.degree}</div>
                                    <div className="text-[13px] text-slate-500 mt-1">{edu.institution}</div>
                                    <div className="text-[13px] text-slate-400 mt-1">{formatDate(edu.graduation_date)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {flatSkills && flatSkills.length > 0 && (
                    <div className="px-6 py-3 flex-grow">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {flatSkills.map((skill, index) => (
                                <span key={index} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[13px] text-slate-600 font-medium shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certificates */}
                {flatCertificates && flatCertificates.length > 0 && (
                    <div className="px-6 py-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2">
                            Certificates
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {flatCertificates.map((cert, index) => (
                                <span key={index} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[13px] text-slate-600 font-medium shadow-sm">
                                    {cert.subheading}
                                    {cert.description ? ` — ${cert.description}` : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </aside>


            {/* --- RIGHT CONTENT (Summary, Experience, Projects) --- */}
            <main className="w-[68%] p-8">

                {/* Header */}
                <header className="mb-6 border-b border-slate-100 pb-6">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight uppercase" style={{ color: accentColor }}>
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="text-base font-medium text-slate-500 mt-1.5 tracking-wide">
                        {data.personal_info?.profession || "Professional Title"}
                    </p>
                </header>

                {/* Summary */}
                {data.professional_summary && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-2.5 flex items-center gap-2 text-slate-800">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Professional Summary
                        </h2>
                        <p className="text-slate-600 leading-6 text-[13px]">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-800">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Work Experience
                        </h2>

                        <div className="border-l-2 border-slate-100 ml-1 space-y-5">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative pl-5">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }}></div>

                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base text-slate-800">{exp.position}</h3>
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                            {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </span>
                                    </div>

                                    <div className="text-[13px] font-medium text-slate-500 mb-2">{exp.company}</div>

                                    {exp.description && (
                                        <ul className="list-disc list-outside ml-4 text-[13px] text-slate-600 leading-relaxed space-y-1 marker:text-slate-300">
                                            {exp.description.split('\n').map((line, i) => (
                                                <li key={i}>{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-800">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span>
                            Key Projects
                        </h2>

                        <div className="grid grid-cols-1 gap-3">
                            {data.project.map((proj, index) => (
                                <div key={index} className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
                                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-2 w-full">
                                        <h3 className="font-bold text-slate-800 min-w-0">{proj.name}</h3>
                                        {proj.date && <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded bg-white whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
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

            </main>
        </div>
        </>
    );
}

export default ModernSidebarTemplate;