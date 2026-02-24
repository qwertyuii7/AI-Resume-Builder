import React from 'react';

const CleanBlueTemplate = ({ data, accentColor = '#2b6cb0' }) => {
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.25cm] text-black font-sans leading-relaxed shadow-lg print:shadow-none">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');
                .clean-blue-template {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 11px;
                }
                .name {
                    font-size: 32px;
                    font-weight: 700;
                    color: ${accentColor};
                    text-align: center;
                    margin-bottom: 10px;
                }
                .contact-info {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    font-size: 10px;
                    color: #555;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                }
                .section-header {
                    font-size: 14px;
                    font-weight: 700;
                    color: ${accentColor};
                    border-bottom: 2px solid ${accentColor};
                    margin-top: 20px;
                    margin-bottom: 12px;
                    padding-bottom: 2px;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-top: 10px;
                }
                .item-location {
                    font-weight: 700;
                }
                .item-title {
                    font-style: italic;
                    color: #444;
                }
                .item-date {
                    float: right;
                    color: #666;
                    font-size: 10px;
                    font-weight: 400;
                }
                .bullet-list {
                    list-style-type: disc;
                    margin-left: 20px;
                    margin-top: 6px;
                    clear: both;
                }
                .bullet-list li {
                    margin-bottom: 3px;
                }
                .project-item {
                    margin-bottom: 15px;
                }
                .project-name {
                    font-weight: 700;
                    font-size: 12px;
                }
            `}</style>

            <div className="clean-blue-template">
                <header>
                    <h1 className="name">{data.personal_info?.full_name || "FIRST LAST"}</h1>
                    <div className="contact-info">
                        {data.personal_info?.phone && <span>📞 {data.personal_info.phone}</span>}
                        {data.personal_info?.email && <span>📧 <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a></span>}
                        {data.personal_info?.linkedin && <span>🔗 <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a></span>}
                        {data.personal_info?.github && <span>💻 <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a></span>}
                    </div>
                </header>

                {data.professional_summary && (
                    <div className="text-justify mb-4">
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
                                    <span className="item-location">{edu.location || ''}</span>
                                </div>
                                <div>
                                    <span className="item-title">{edu.degree} in {edu.field}</span>
                                    <span className="item-date">{edu.graduation_date ? new Date(edu.graduation_date).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : ''}</span>
                                </div>
                                {edu.description && <div className="mt-1 text-gray-600">{edu.description}</div>}
                            </div>
                        ))}
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="section-header">Work Experience</h2>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="mb-5">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span className="item-location">{exp.location || ''}</span>
                                </div>
                                <div>
                                    <span className="item-title">{exp.position}</span>
                                    <span className="item-date">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
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
                        <h2 className="section-header">Software Projects</h2>
                        {data.project.map((proj, idx) => (
                            <div key={idx} className="project-item">
                                <div className="flex justify-between items-baseline">
                                    <span className="project-name">{proj.name}</span>
                                    <span className="item-date">{proj.date ? formatDate(proj.date) : ''}</span>
                                </div>
                                {proj.link && <div className="text-blue-600 text-[10px] font-bold"><a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="hover:underline">View Project</a></div>}
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
                                <div><span className="font-bold">Skills:</span> {data.skills.join(', ')}</div>
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx}>
                                        <span className="font-bold">{cat}:</span> {Array.isArray(items) ? items.join(', ') : items}
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
            </div>
        </div>
    );
};

export default CleanBlueTemplate;
