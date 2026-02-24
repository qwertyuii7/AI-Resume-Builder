import React from 'react';

const TwoColumnTemplate = ({ data, accentColor = '#663399' }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    const formatLink = (value) => (value || '').replace(/^https?:\/\//, '');
    const normalizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    };

    const getFlatCertificates = () => {
        if (!data.certificates) return [];
        const normalizeCertificateEntry = (entry) => {
            if (typeof entry === 'string') return { subheading: entry, description: '' };
            if (entry && typeof entry === 'object') {
                return {
                    subheading: entry.subheading || entry.title || entry.name || '',
                    description: entry.description || entry.details || '',
                };
            }
            return { subheading: '', description: '' };
        };
        if (Array.isArray(data.certificates)) return data.certificates.map(normalizeCertificateEntry).filter(e => e.subheading);
        if (typeof data.certificates === 'object') return Object.values(data.certificates).flatMap(entries => Array.isArray(entries) ? entries : []).map(normalizeCertificateEntry).filter(e => e.subheading);
        return [];
    };

    const flatCertificates = getFlatCertificates();

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white flex text-black font-sans leading-relaxed shadow-lg print:shadow-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .two-column-template {
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    display: flex;
                    width: 100%;
                }
                .main-col {
                    flex: 1;
                    padding: 40px;
                }
                .sidebar-col {
                    width: 30%;
                    background-color: #f8f8ff;
                    padding: 40px 20px;
                    border-left: 1px solid #eee;
                }
                .section-title {
                    font-size: 12px;
                    font-weight: 700;
                    color: ${accentColor};
                    text-transform: uppercase;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 12px;
                    padding-bottom: 2px;
                    margin-top: 24px;
                }
                .section-title:first-child {
                    margin-top: 0;
                }
                .name {
                    font-size: 32px;
                    font-weight: 700;
                    color: ${accentColor};
                    line-height: 1.1;
                    margin-bottom: 4px;
                }
                .profession {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 30px;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-top: 12px;
                }
                .item-subheader {
                    font-weight: 600;
                    color: #444;
                }
                .bullet-list {
                    list-style-type: disc;
                    margin-left: 18px;
                    margin-top: 6px;
                }
                .bullet-list li {
                    margin-bottom: 4px;
                }
                .contact-item {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
                .sidebar-section-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: ${accentColor};
                    text-transform: uppercase;
                    margin-bottom: 10px;
                    margin-top: 25px;
                    border-bottom: 1px solid ${accentColor}44;
                    padding-bottom: 2px;
                }
                .sidebar-section-title:first-child {
                    margin-top: 0;
                }
                .skill-category {
                    font-weight: 600;
                    margin-top: 8px;
                    margin-bottom: 2px;
                    font-style: italic;
                }
            `}</style>

            <div className="two-column-template">
                <div className="main-col">
                    <header>
                        <h1 className="name">{data.personal_info?.full_name || "FIRST LAST"}</h1>
                        <div className="profession">{data.personal_info?.profession || "Machine Learning Intern"}</div>
                    </header>

                    {data.professional_summary && (
                        <div className="mt-6 text-justify">
                            {data.professional_summary}
                        </div>
                    )}

                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="section-title">Work Experience</h2>
                            {data.experience.map((exp, idx) => (
                                <div key={idx} className="mb-6">
                                    <div className="item-header">
                                        <span>{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                                        <span className="font-normal">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                    </div>
                                    <div className="item-subheader">{exp.position}</div>
                                    {exp.description && (
                                        <ul className="bullet-list">
                                            {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                                                <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 className="section-title">Projects</h2>
                            {data.project.map((proj, idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="item-header">
                                        <span>{proj.name}</span>
                                        <span className="font-normal">{proj.date ? formatDate(proj.date) : ''}</span>
                                    </div>
                                    {proj.link && <div className="text-[10px] font-bold"><a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Project</a></div>}
                                    {proj.description && (
                                        <ul className="bullet-list">
                                            {proj.description.split('\n').filter(l => l.trim()).map((line, i) => (
                                                <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                <div className="sidebar-col">
                    <section>
                        <h2 className="sidebar-section-title">Contact</h2>
                        <div className="space-y-2">
                            {data.personal_info?.location && <div className="contact-item">• {data.personal_info.location}</div>}
                            {data.personal_info?.phone && <div className="contact-item">• {data.personal_info.phone}</div>}
                            {data.personal_info?.email && (
                                <div className="contact-item truncate">
                                    • <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                                </div>
                            )}
                            {data.personal_info?.linkedin && (
                                <div className="contact-item truncate">
                                    • <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a>
                                </div>
                            )}
                            {data.personal_info?.github && (
                                <div className="contact-item truncate">
                                    • <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a>
                                </div>
                            )}
                            {data.personal_info?.website && (
                                <div className="contact-item truncate">
                                    • <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a>
                                </div>
                            )}
                        </div>
                    </section>

                    {data.skills && (
                        <section>
                            <h2 className="sidebar-section-title">Skills</h2>
                            <div className="text-[10px]">
                                {Array.isArray(data.skills) ? (
                                    <div className="leading-relaxed">• {data.skills.join('\n• ')}</div>
                                ) : (
                                    Object.entries(data.skills).map(([cat, items], idx) => (
                                        <div key={idx}>
                                            <div className="skill-category">{cat}:</div>
                                            <div>• {Array.isArray(items) ? items.join('\n• ') : items}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="sidebar-section-title">Education</h2>
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="mb-3 text-[10px]">
                                    <div className="font-bold">{edu.institution}</div>
                                    <div>{edu.degree} in {edu.field}</div>
                                    <div className="text-gray-600">{formatDate(edu.graduation_date)}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {flatCertificates.length > 0 && (
                        <section>
                            <h2 className="sidebar-section-title">Certificates</h2>
                            <div className="space-y-2 text-[10px]">
                                {flatCertificates.map((cert, idx) => (
                                    <div key={idx}>
                                        <div className="font-bold">• {cert.subheading}</div>
                                        {cert.description && <div className="text-gray-600 ml-3">{cert.description}</div>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoColumnTemplate;
