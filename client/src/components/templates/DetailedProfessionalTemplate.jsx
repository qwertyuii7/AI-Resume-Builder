import React from 'react';

const DetailedProfessionalTemplate = ({ data, accentColor = '#333' }) => {
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-sans leading-normal shadow-lg print:shadow-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
                .detailed-pro-template {
                    font-family: 'Lato', sans-serif;
                    font-size: 11px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 25px;
                }
                .header-left, .header-right {
                    font-size: 10px;
                    width: 30%;
                }
                .header-right {
                    text-align: right;
                }
                .header-center {
                    text-align: center;
                    width: 40%;
                }
                .name {
                    font-size: 24px;
                    font-weight: 900;
                    text-transform: uppercase;
                    margin-top: -5px;
                }
                .section-header {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid #111;
                    margin-top: 18px;
                    margin-bottom: 10px;
                    padding-bottom: 2px;
                }
                .item-container {
                    margin-bottom: 12px;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                }
                .job-title {
                    font-weight: 700;
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
                .skills-table {
                    width: 100%;
                }
                .skills-item {
                    margin-bottom: 4px;
                }
            `}</style>

            <div className="detailed-pro-template">
                <header className="header">
                    <div className="header-left">
                        {data.personal_info?.location && <div>{data.personal_info.location}</div>}
                        {data.personal_info?.website && <div><a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a></div>}
                    </div>
                    <div className="header-center">
                        <h1 className="name">{data.personal_info?.full_name || "FIRST LAST"}</h1>
                    </div>
                    <div className="header-right">
                        {data.personal_info?.phone && <div>{data.personal_info.phone}</div>}
                        {data.personal_info?.email && <div><a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a></div>}
                        {data.personal_info?.github && <div><a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">github.com/{formatLink(data.personal_info.github)}</a></div>}
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
                            <div key={idx} className="item-container">
                                <div className="item-header">
                                    <span>{edu.institution}, {edu.location || ''}</span>
                                    <span>{edu.graduation_date ? new Date(edu.graduation_date).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ''}</span>
                                </div>
                                <div>• {edu.degree} in {edu.field}</div>
                            </div>
                        ))}
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="section-header">Employment</h2>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="item-container">
                                <div className="item-header">
                                    <span>{exp.company}, {exp.location || ''}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                <div className="job-title">{exp.position}</div>
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

                {data.skills && (
                    <section>
                        <h2 className="section-header">Languages and Technologies</h2>
                        <div className="space-y-1">
                            {Array.isArray(data.skills) ? (
                                <div className="skills-item">• {data.skills.join(', ')}</div>
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx} className="skills-item">
                                        • <span className="font-bold">{cat}:</span> {Array.isArray(items) ? items.join(', ') : items}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2 className="section-header">Technical Experience</h2>
                        {data.project.map((proj, idx) => (
                            <div key={idx} className="item-container">
                                <div className="item-header">
                                    <span>{proj.name}</span>
                                    <span>{proj.date ? formatDate(proj.date) : ''}</span>
                                </div>
                                {proj.link && (
                                    <div className="text-[10px] mb-1 font-bold">
                                        <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
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

                {flatCertificates.length > 0 && (
                    <section>
                        <h2 className="section-header">Additional Experience and Awards</h2>
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

export default DetailedProfessionalTemplate;
