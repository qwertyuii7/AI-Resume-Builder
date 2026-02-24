import React from 'react';

const SerifClassicTemplate = ({ data, accentColor = '#000000' }) => {
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-serif leading-tight shadow-lg print:shadow-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');
                .serif-classic-template {
                    font-family: 'Libre Baskerville', serif;
                    font-size: 11px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .name {
                    font-size: 26px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    letter-spacing: 1px;
                }
                .contact-info {
                    font-size: 10px;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .contact-info span, .contact-info a {
                    text-decoration: none;
                    color: black;
                }
                .section-header {
                    font-size: 13px;
                    font-weight: 700;
                    border-bottom: 1px solid black;
                    margin-top: 18px;
                    margin-bottom: 8px;
                    padding-bottom: 2px;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-top: 8px;
                }
                .item-subtitle {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    margin-bottom: 4px;
                }
                .bullet-list {
                    list-style-type: disc;
                    margin-left: 20px;
                    margin-top: 4px;
                }
                .bullet-list li {
                    margin-bottom: 2px;
                    text-align: justify;
                }
                .skill-category {
                    margin-bottom: 4px;
                }
                .skill-label {
                    font-weight: 700;
                }
            `}</style>

            <div className="serif-classic-template">
                <header className="header">
                    <h1 className="name">{data.personal_info?.full_name || "FIRST LAST"}</h1>
                    <div className="contact-info">
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.email && <span><a href={`mailto:${data.personal_info.email}`}>{data.personal_info.email}</a></span>}
                        {data.personal_info?.linkedin && <span><a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer">linkedin.com/in/{formatLink(data.personal_info.linkedin)}</a></span>}
                        {data.personal_info?.github && <span><a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer">github.com/{formatLink(data.personal_info.github)}</a></span>}
                    </div>
                </header>

                {data.professional_summary && (
                    <div className="text-justify mb-4 italic">
                        {data.professional_summary}
                    </div>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="section-header">Education</h2>
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="item-header">
                                    <span>{edu.institution}</span>
                                    <span>{edu.graduation_date ? new Date(edu.graduation_date).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ''}</span>
                                </div>
                                <div className="item-subtitle">
                                    <span>{edu.degree} in {edu.field}</span>
                                    <span>{edu.location || ''}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="section-header">Experience</h2>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                <div className="item-subtitle">
                                    <span>{exp.position}</span>
                                    <span>{exp.location || ''}</span>
                                </div>
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
                        <h2 className="section-header">Projects</h2>
                        {data.project.map((proj, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="item-header">
                                    <span>{proj.name}</span>
                                    <span>{proj.date ? formatDate(proj.date) : ''}</span>
                                </div>
                                {proj.link && <div className="italic text-[10px] font-bold"><a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="hover:underline">View Project</a></div>}
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

                {data.skills && (
                    <section>
                        <h2 className="section-header">Technical Skills</h2>
                        <div className="space-y-1">
                            {Array.isArray(data.skills) ? (
                                <div className="skill-category"><span className="skill-label">Skills:</span> {data.skills.join(', ')}</div>
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx} className="skill-category">
                                        <span className="skill-label">{cat}:</span> {Array.isArray(items) ? items.join(', ') : items}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2 className="section-header">Certificates & Awards</h2>
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
            </div>
        </div>
    );
};

export default SerifClassicTemplate;
