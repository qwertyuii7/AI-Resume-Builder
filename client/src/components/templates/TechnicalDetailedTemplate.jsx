import React from 'react';

const TechnicalDetailedTemplate = ({ data, accentColor = '#000000' }) => {

    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    // Helper to parse categorized skills
    const getCategorizedSkills = () => {
        if (!data.skills) return {};

        // If skills is already an object (new format), use it directly
        if (typeof data.skills === 'object' && !Array.isArray(data.skills)) {
            return data.skills;
        }

        // Backward compatibility: if it's an array, try to parse it
        if (Array.isArray(data.skills)) {
            const categories = {};
            data.skills.forEach(skill => {
                if (skill.includes(':')) {
                    const [cat, items] = skill.split(':');
                    categories[cat.trim()] = items.trim();
                } else {
                    if (!categories['General']) categories['General'] = [];
                    categories['General'].push(skill);
                }
            });
            return categories;
        }

        return {};
    };

    const categorizedSkills = getCategorizedSkills();

    // Helper to normalize and get certificates
    const getCategorizedCertificates = () => {
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

        if (typeof data.certificates === 'object') {
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
        }

        return {};
    };

    const categorizedCertificates = getCategorizedCertificates();

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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1cm] text-black font-sans leading-tight print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .technical-template {
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                }
                .technical-template h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .technical-template h2 {
                    font-size: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid #000;
                    margin-top: 12px;
                    margin-bottom: 6px;
                    padding-bottom: 2px;
                }
                .technical-template .contact-info {
                    font-size: 12px;
                }
                .technical-template .section-item {
                    margin-bottom: 8px;
                }
                .technical-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                }
                .technical-template .item-sub {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    margin-bottom: 2px;
                }
                .technical-template ul {
                    list-style-type: disc;
                    margin-left: 18px;
                }
                .technical-template li {
                    margin-bottom: 2px;
                }
                .technical-template .skills-grid {
                    display: table;
                    width: 100%;
                }
                .technical-template .skill-row {
                    display: table-row;
                }
                .technical-template .skill-cat {
                    display: table-cell;
                    font-weight: 700;
                    width: 120px;
                    padding-right: 10px;
                    vertical-align: top;
                }
                .technical-template .skill-items {
                    display: table-cell;
                }
            `}</style>

            <div className="technical-template">
                {/* --- HEADER --- */}
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <h1 style={{ color: accentColor }}>{data.personal_info?.full_name || "Your Name"}</h1>
                        <p className="font-semibold text-slate-600 mb-2 leading-tight" style={{ fontSize: '18px' }}>{data.personal_info?.profession || "Professional Title"}</p>
                        <div className="contact-info space-y-0.5">
                            {data.personal_info?.website && (
                                <div>Portfolio: <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a></div>
                            )}
                            {data.personal_info?.linkedin && (
                                <div>LinkedIn: <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a></div>
                            )}
                            {data.personal_info?.github && (
                                <div>GitHub: <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a></div>
                            )}
                        </div>
                    </div>
                    <div className="text-right contact-info space-y-0.5">
                        {data.personal_info?.email && (
                            <div>Email: <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a></div>
                        )}
                        {data.personal_info?.phone && (
                            <div>Mobile: {data.personal_info.phone}</div>
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
                                    <span>{edu.degree} - {edu.field}; GPA: {edu.gpa}</span>
                                    <span>{formatDate(edu.graduation_date)}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* --- SKILLS SUMMARY --- */}
                {Object.keys(categorizedSkills).length > 0 && (
                    <section>
                        <h2>Skills Summary</h2>
                        <div className="skills-grid space-y-1">
                            {Object.entries(categorizedSkills).map(([cat, items], idx) => (
                                items && (Array.isArray(items) ? items.length > 0 : items.length > 0) && (
                                    <div key={idx} className="skill-row">
                                        <div className="skill-cat">• {cat}:</div>
                                        <div className="skill-items">{Array.isArray(items) ? items.join(", ") : items}</div>
                                    </div>
                                )
                            ))}
                        </div>
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
                                <div className="item-header grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 w-full">
                                    <span className="font-bold min-w-0">• {proj.name} {proj.link && <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="font-bold hover:underline" style={{ color: accentColor }}>View Project</a>} <span className="font-normal">({proj.type})</span></span>
                                    {proj.date && <span className="font-normal whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
                                </div>
                                {getProjectPoints(proj).length > 0 && (
                                    <ul>
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
                {Object.keys(categorizedCertificates).length > 0 && (
                    <section>
                        <h2>Certificates & Credentials</h2>
                        <div className="space-y-1">
                            {Object.entries(categorizedCertificates).map(([cat, items], idx) => (
                                items && formatCertificateEntries(items).length > 0 && (
                                    <div key={idx} className="skill-row">
                                        <div className="skill-cat">• {cat}:</div>
                                        <div className="skill-items">{formatCertificateEntries(items)}</div>
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

export default TechnicalDetailedTemplate;
