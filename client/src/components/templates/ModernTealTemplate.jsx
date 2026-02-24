import React from 'react';

const ModernTealTemplate = ({ data, accentColor = '#2c7a7b' }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1cm] text-black font-sans leading-relaxed shadow-lg print:shadow-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .modern-teal-template {
                    font-family: 'Roboto', sans-serif;
                    font-size: 11px;
                }
                .name {
                    font-size: 28px;
                    font-weight: 700;
                    color: ${accentColor};
                    margin-bottom: 2px;
                }
                .profession {
                    font-size: 16px;
                    font-weight: 400;
                    color: #444;
                    margin-bottom: 8px;
                }
                .contact-bar {
                    font-size: 10px;
                    color: #666;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .contact-bar span:not(:last-child):after {
                    content: " •";
                    margin-left: 8px;
                }
                .section-header {
                    font-size: 12px;
                    font-weight: 700;
                    color: ${accentColor};
                    text-transform: uppercase;
                    border-bottom: 1.5px solid ${accentColor};
                    margin-top: 20px;
                    margin-bottom: 12px;
                    padding-bottom: 2px;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .item-subtitle {
                    font-weight: 500;
                    margin-bottom: 6px;
                }
                .bullet-list {
                    list-style-type: disc;
                    margin-left: 18px;
                    margin-top: 4px;
                }
                .bullet-list li {
                    margin-bottom: 3px;
                }
                .skill-row {
                    margin-bottom: 6px;
                }
                .skill-label {
                    font-weight: 700;
                    display: inline-block;
                    width: 100px;
                }
            `}</style>

            <div className="modern-teal-template">
                <header>
                    <h1 className="name">{data.personal_info?.full_name || "FIRST LAST"}</h1>
                    <div className="profession">{data.personal_info?.profession || "Machine Learning Engineer"}</div>
                    <div className="contact-bar">
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.email && <span><a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a></span>}
                        {data.personal_info?.linkedin && <span><a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a></span>}
                        {data.personal_info?.github && <span><a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a></span>}
                    </div>
                </header>

                {data.professional_summary && (
                    <div className="text-justify mb-4">
                        {data.professional_summary}
                    </div>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="section-header">Relevant Work Experience</h2>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="mb-5">
                                <div className="item-header">
                                    <span>{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                <div className="item-subtitle">{exp.position}</div>
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

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="section-header">Education</h2>
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="item-header">
                                    <span>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</span>
                                    <span>{edu.graduation_date ? new Date(edu.graduation_date).getFullYear() : ''}</span>
                                </div>
                                <div>{edu.degree} — {edu.field}</div>
                            </div>
                        ))}
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h2 className="section-header">Skills</h2>
                        <div className="space-y-1">
                            {Array.isArray(data.skills) ? (
                                <div className="skill-row"><span className="skill-label">Skills:</span> {data.skills.join(', ')}</div>
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx} className="skill-row">
                                        <span className="skill-label">{cat}:</span> {Array.isArray(items) ? items.join(', ') : items}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2 className="section-header">Certificates</h2>
                        <ul className="bullet-list">
                            {flatCertificates.map((cert, idx) => (
                                <li key={idx}>
                                    <span className="font-bold">{cert.subheading}</span>
                                    {cert.description && <span> — {cert.description}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="section-header">Projects</h2>
                        {data.project.map((proj, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="item-header">
                                    <span>{proj.name}</span>
                                    <span>{proj.date ? formatDate(proj.date) : ''}</span>
                                </div>
                                {proj.link && (
                                    <div className="text-[10px] mb-1 font-bold">
                                        <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Project</a>
                                    </div>
                                )}
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
        </div>
    );
};

export default ModernTealTemplate;
