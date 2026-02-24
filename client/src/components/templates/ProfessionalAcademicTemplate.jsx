import React from 'react';

const ProfessionalAcademicTemplate = ({ data, accentColor = '#000000' }) => {

    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    // Helper to normalize skills (backward compatibility)
    const getNormalizedSkills = () => {
        if (!data.skills) return {};
        if (Array.isArray(data.skills)) {
            return { "General": data.skills };
        }
        return data.skills;
    };

    const skillsData = getNormalizedSkills();
    const hasSkills = Object.keys(skillsData).some(cat => skillsData[cat] && skillsData[cat].length > 0);

    // Helper to normalize certificates
    const getNormalizedCertificates = () => {
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

        if (!data.certificates) return {};
        if (Array.isArray(data.certificates)) {
            return {
                Certifications: data.certificates
                    .map(normalizeCertificateEntry)
                    .filter(entry => entry.subheading.trim())
            };
        }

        if (typeof data.certificates !== 'object') return {};

        return Object.entries(data.certificates).reduce((acc, [heading, entries]) => {
            if (!Array.isArray(entries)) {
                acc[heading] = [];
                return acc;
            }

            acc[heading] = entries
                .map(normalizeCertificateEntry)
                .filter(entry => entry.subheading.trim());

            return acc;
        }, {});
    };

    const certificatesData = getNormalizedCertificates();

    const formatCertificateEntries = (entries) => {
        if (!Array.isArray(entries)) return "";

        return entries
            .map((entry) => entry.description ? `${entry.subheading} (${entry.description})` : entry.subheading)
            .filter(Boolean)
            .join(', ');
    };

    const hasCertificates = Object.keys(certificatesData).some(cat => formatCertificateEntries(certificatesData[cat]).length > 0);

    // Helper to format dates
    const formatProjectDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        if (!year || !month) return "";
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

    const bodyFontSize = '12px';
    const headingFontSize = '34px';
    const sectionTitleSize = '14px';

    const normalizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    const formatLink = (value) => (value || '').replace(/^https?:\/\//, '');

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-serif leading-tight print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:wght@400;600;700&display=swap');
                
                .professional-template {
                    font-family: 'Libre+Baskerville', serif;
                    line-height: 1.2;
                }
                .professional-template h1 {
                    font-family: 'Source Sans Pro', sans-serif;
                    font-size: ${headingFontSize};
                }
                .professional-template h2 {
                    font-family: 'Source Sans Pro', sans-serif;
                    border-bottom: 1px solid #000;
                    margin-bottom: 8px;
                    margin-top: 14px;
                    padding-bottom: 2px;
                }
                .professional-template p, .professional-template li, .professional-template div {
                    font-size: ${bodyFontSize};
                }
                .professional-template .section-title {
                    font-size: ${sectionTitleSize};
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .professional-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                    font-size: ${bodyFontSize};
                }
                .professional-template .item-sub {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    font-size: ${bodyFontSize};
                    margin-bottom: 4px;
                }
                .professional-template ul {
                    list-style-type: disc;
                    margin-left: 20px;
                    margin-top: 4px;
                }
                .professional-template li {
                    margin-bottom: 3px;
                }
            `}</style>

            <div className="professional-template">
                {/* --- HEADER --- */}
                <header className="text-center mb-6">
                    <h1 className="font-bold mb-1" style={{ color: accentColor }}>
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="font-semibold text-slate-600 mb-2 leading-tight" style={{ fontSize: '18px' }}>
                        {data.personal_info?.profession || "Professional Title"}
                    </p>
                    <div className="flex justify-center gap-4 text-[12px]">
                        {data.personal_info?.website && (
                            <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a>
                        )}
                        {data.personal_info?.email && (
                            <div className="flex items-center gap-1">
                                <span>Email:</span>
                                <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                            </div>
                        )}
                        {data.personal_info?.linkedin && (
                            <div className="flex items-center gap-1">
                                <span>LinkedIn:</span>
                                <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a>
                            </div>
                        )}
                        {data.personal_info?.github && (
                            <div className="flex items-center gap-1">
                                <span>GitHub:</span>
                                <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a>
                            </div>
                        )}
                        {data.personal_info?.phone && (
                            <div className="flex items-center gap-1">
                                <span>Mobile:</span>
                                <span>{data.personal_info.phone}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* --- PROFESSIONAL SUMMARY --- */}
                {data.professional_summary && (
                    <section>
                        <h2 className="section-title">Professional Summary</h2>
                        <p>{data.professional_summary}</p>
                    </section>
                )}

                {/* --- EDUCATION --- */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="section-title">Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="item-header">
                                    <span>{edu.institution}</span>
                                    <span>{edu.location || ""}</span>
                                </div>
                                <div className="item-sub">
                                    <span>{edu.degree}{edu.field ? `, ${edu.field}` : ""} {edu.gpa ? `; GPA: ${edu.gpa}` : ""}</span>
                                    <span>{formatDate(edu.graduation_date)}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* --- EXPERIENCE --- */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="section-title">Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{exp.location || ""}</span>
                                </div>
                                <div className="item-sub">
                                    <span>{exp.position}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                {exp.description && (
                                    <ul className="list-disc ml-5">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* --- PROJECTS --- */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="section-title">Projects</h2>
                        {data.project.map((proj, index) => (
                            <div key={index} className="mb-3">
                                <div className="font-bold grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 w-full">
                                    <div className="min-w-0 flex gap-1">
                                        <span>{proj.name}:</span>
                                        {proj.link && (
                                            <a href={normalizeUrl(proj.link)} className="underline font-bold" style={{ color: accentColor }} target="_blank" rel="noopener noreferrer">View Project</a>
                                        )}
                                    </div>
                                    {proj.date && <span className="text-slate-600 whitespace-nowrap justify-self-end text-right">{formatProjectDate(proj.date)}</span>}
                                </div>
                                {proj.type && <div className="text-slate-600 italic">{proj.type}</div>}
                                {getProjectPoints(proj).length > 0 && (
                                    <ul className="list-disc ml-5 mt-1 font-normal">
                                        {getProjectPoints(proj).map((point, pointIndex) => (
                                            <li key={pointIndex}>{point}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* --- CERTIFICATES --- */}
                {hasCertificates && (
                    <section>
                        <h2 className="section-title">Certificates & Credentials</h2>
                        <div className="space-y-2">
                            {Object.entries(certificatesData).map(([category, certs], idx) => (
                                certs && formatCertificateEntries(certs).length > 0 && (
                                    <div key={idx} className="flex gap-1">
                                        <span className="font-bold">{category}:</span>
                                        <span>{formatCertificateEntries(certs)}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                )}

                {/* --- SKILLS --- */}
                {hasSkills && (
                    <section>
                        <h2 className="section-title">Skills & Expertise</h2>
                        <div className="space-y-2">
                            {Object.entries(skillsData).map(([category, skills], idx) => (
                                skills && skills.length > 0 && (
                                    <div key={idx} className="flex gap-1">
                                        <span className="font-bold">{category}:</span>
                                        <span>{Array.isArray(skills) ? skills.join(", ") : skills}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProfessionalAcademicTemplate;
