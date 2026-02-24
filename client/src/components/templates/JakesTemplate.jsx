import React from 'react';

const JakesTemplate = ({ data, accentColor = '#000000' }) => {

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
            const categories = {};
            data.skills.forEach(skill => {
                if (skill.includes(':')) {
                    const [cat, items] = skill.split(':');
                    categories[cat.trim()] = items.trim();
                } else {
                    if (!categories['Other']) categories['Other'] = [];
                    categories['Other'].push(skill);
                }
            });
            return categories;
        }
        // New format: already an object
        return data.skills;
    };

    const skillsData = getNormalizedSkills();

    // Helper to normalize and get certificates
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

    const normalizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    const formatLink = (value) => (value || '').replace(/^https?:\/\//, '');

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.27cm] text-black font-sans leading-tight print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .jakes-template {
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    line-height: 1.3;
                    color: #000;
                }
                .jakes-template h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .jakes-template h2 {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid #000;
                    margin-top: 10px;
                    margin-bottom: 6px;
                    padding-bottom: 1px;
                }
                .jakes-template .contact-info {
                    font-size: 11px;
                    margin-bottom: 10px;
                }
                .jakes-template .section-item {
                    margin-bottom: 6px;
                }
                .jakes-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    font-size: 11.5px;
                }
                .jakes-template .item-sub {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    margin-bottom: 2px;
                    font-size: 11px;
                }
                .jakes-template ul {
                    list-style-type: disc;
                    margin-left: 16px;
                }
                .jakes-template li {
                    margin-bottom: 1px;
                }
                .jakes-template .tech-skills {
                    margin-top: 2px;
                }
                .jakes-template .bold {
                    font-weight: 700;
                }
            `}</style>

            <div className="jakes-template">
                {/* --- HEADER --- */}
                <header className="text-center mb-4">
                    <h1 style={{ color: accentColor }}>{data.personal_info?.full_name || "Your Name"}</h1>
                    <p className="font-semibold text-slate-600 mb-2 leading-tight" style={{ fontSize: '18px' }}>{data.personal_info?.profession || "Professional Title"}</p>
                    <div className="contact-info flex justify-center items-center gap-2 flex-wrap">
                        {data.personal_info?.phone && (
                            <span>{data.personal_info.phone}</span>
                        )}
                        {data.personal_info?.phone && data.personal_info?.email && <span>|</span>}
                        {data.personal_info?.email && (
                            <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                        )}
                        {data.personal_info?.email && data.personal_info?.linkedin && <span>|</span>}
                        {data.personal_info?.linkedin && (
                            <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a>
                        )}
                        {data.personal_info?.linkedin && data.personal_info?.website && <span>|</span>}
                        {data.personal_info?.website && (
                            <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a>
                        )}
                        {(data.personal_info?.website || data.personal_info?.linkedin) && data.personal_info?.github && <span>|</span>}
                        {data.personal_info?.github && (
                            <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a>
                        )}
                    </div>
                </header>

                {/* --- PROFESSIONAL SUMMARY --- */}
                {data.professional_summary && (
                    <section>
                        <h2>Professional Summary</h2>
                        <div className="section-item">
                            <p>{data.professional_summary}</p>
                        </div>
                    </section>
                )}

                {/* --- EDUCATION --- */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="section-item">
                                <div className="item-header">
                                    <span>{edu.institution}</span>
                                    <span>{edu.location || ""}</span>
                                </div>
                                <div className="item-sub">
                                    <span>{edu.degree} in {edu.field}{edu.gpa ? ` (GPA: ${edu.gpa})` : ""}</span>
                                    <span>{formatDate(edu.graduation_date)}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* --- EXPERIENCE --- */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="section-item">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{exp.location || ""}</span>
                                </div>
                                <div className="item-sub">
                                    <span>{exp.position}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                {exp.description && (
                                    <ul>
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
                        <h2>Projects</h2>
                        {data.project.map((proj, index) => (
                            <div key={index} className="section-item">
                                <div className="item-header w-full grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                                    <div className="min-w-0">
                                        <span>{proj.name} {proj.link && <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="font-bold hover:underline" style={{ color: accentColor }}>View Project</a>} | <span className="italic font-normal">{proj.type}</span></span>
                                    </div>
                                    {proj.date && <span className="font-normal whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
                                </div>
                                {getProjectPoints(proj).length > 0 && (
                                    <ul>
                                        {getProjectPoints(proj).map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* --- CERTIFICATES --- */}
                {Object.keys(certificatesData).length > 0 && (
                    <section>
                        <h2>Certificates & Credentials</h2>
                        <div className="tech-skills space-y-1">
                            {Object.entries(certificatesData).map(([category, items], idx) => (
                                items && formatCertificateEntries(items).length > 0 && (
                                    <div key={idx}>
                                        <span className="bold">{category}:</span> {formatCertificateEntries(items)}
                                    </div>
                                )
                            ))}
                        </div>
                    </section>
                )}

                {/* --- TECHNICAL SKILLS --- */}
                {Object.keys(skillsData).length > 0 && (
                    <section>
                        <h2>Technical Skills</h2>
                        <div className="tech-skills space-y-1">
                            {Object.entries(skillsData).map(([category, items], idx) => (
                                items && (Array.isArray(items) ? items.length > 0 : items.length > 0) && (
                                    <div key={idx}>
                                        <span className="bold">{category}:</span> {Array.isArray(items) ? items.join(", ") : items}
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

export default JakesTemplate;
