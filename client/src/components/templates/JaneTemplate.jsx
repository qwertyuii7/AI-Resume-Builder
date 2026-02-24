import React from 'react';

const JaneTemplate = ({ data, accentColor = '#000000' }) => {
    // Helper to format dates
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

    const getProjectLink = (project) => {
        const candidates = [
            project?.link,
            project?.url,
            project?.project_link,
            project?.live_link,
            project?.demo_link,
            project?.projectUrl,
            project?.href,
        ];

        const resolved = candidates.find((value) => typeof value === 'string' && value.trim());
        return resolved ? resolved.trim() : '';
    };

    const getFlatCertificates = () => {
        if (!data.certificates) return [];

        const normalizeCertificateEntry = (entry) => {
            if (typeof entry === 'string') {
                return { subheading: entry, description: '' };
            }

            if (entry && typeof entry === 'object') {
                return {
                    subheading: entry.subheading || entry.title || entry.name || '',
                    description: entry.description || entry.details || '',
                };
            }

            return { subheading: '', description: '' };
        };

        if (Array.isArray(data.certificates)) {
            return data.certificates
                .map(normalizeCertificateEntry)
                .filter((entry) => entry.subheading.trim());
        }

        if (typeof data.certificates === 'object') {
            return Object.values(data.certificates)
                .flatMap((entries) => Array.isArray(entries) ? entries : [])
                .map(normalizeCertificateEntry)
                .filter((entry) => entry.subheading.trim());
        }

        return [];
    };

    const flatCertificates = getFlatCertificates();

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-sans leading-relaxed print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .jane-template {
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    color: #333;
                }
                .jane-template h1 {
                    font-size: 24px;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    color: #000;
                    letter-spacing: 0.5px;
                }
                .jane-template .profession {
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 8px;
                    color: #000;
                }
                .jane-template .contact-info {
                    text-align: center;
                    font-size: 10px;
                    margin-bottom: 20px;
                    color: #555;
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .jane-template h2 {
                    font-size: 13px;
                    font-weight: 700;
                    text-align: center;
                    text-transform: capitalize;
                    border-bottom: 2px solid #000;
                    margin-top: 20px;
                    margin-bottom: 15px;
                    padding-bottom: 4px;
                    color: #000;
                }
                .jane-template .section-content {
                    margin-bottom: 15px;
                }
                .jane-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-bottom: 2px;
                    color: #000;
                }
                .jane-template .item-sub {
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #000;
                }
                .jane-template ul {
                    list-style-type: disc;
                    margin-left: 15px;
                    margin-top: 5px;
                }
                .jane-template li {
                    margin-bottom: 3px;
                    text-align: justify;
                }
                .jane-template .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-top: 10px;
                }
                .jane-template .achievement-item {
                    border-right: 1px solid #ddd;
                    padding-right: 10px;
                }
                .jane-template .achievement-item:last-child {
                    border-right: none;
                }
                .jane-template .skills-list {
                    text-align: center;
                    font-weight: 500;
                }
            `}</style>

            <div className="jane-template">
                <header>
                    <h1>{data.personal_info?.full_name || "JANE DORRIS, MBA"}</h1>
                    <div className="profession">{data.personal_info?.profession || "Buyside and Sellside M&A, Equity and Debt Financing"}</div>
                    <div className="contact-info">
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.phone && <span>•</span>}
                        {data.personal_info?.email && <a href={`mailto:${data.personal_info.email}`} className="hover:underline whitespace-nowrap">{data.personal_info.email}</a>}
                        {data.personal_info?.email && data.personal_info?.linkedin && <span>•</span>}
                        {data.personal_info?.linkedin && <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.linkedin)}</a>}
                        {(data.personal_info?.linkedin || data.personal_info?.email || data.personal_info?.phone) && data.personal_info?.github && <span>•</span>}
                        {data.personal_info?.github && <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.github)}</a>}
                        {(data.personal_info?.github || data.personal_info?.linkedin || data.personal_info?.email || data.personal_info?.phone) && data.personal_info?.website && <span>•</span>}
                        {data.personal_info?.website && <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.website)}</a>}
                        {data.personal_info?.linkedin && data.personal_info?.location && <span>•</span>}
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    </div>
                </header>

                <section>
                    <h2>Personal Details</h2>
                    <div className="section-content text-center space-y-1">
                        {data.personal_info?.phone && <div><span className="font-semibold">Phone:</span> {data.personal_info.phone}</div>}
                        {data.personal_info?.location && <div><span className="font-semibold">Location:</span> {data.personal_info.location}</div>}
                    </div>
                </section>

                {data.professional_summary && (
                    <section>
                        <h2>Summary</h2>
                        <div className="section-content text-justify leading-relaxed">
                            {data.professional_summary}
                        </div>
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="section-content mb-6">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{exp.location}</span>
                                </div>
                                <div className="item-header">
                                    <span className="font-semibold">{exp.position}</span>
                                    <span className="font-normal">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                {exp.description && (
                                    <ul className="mt-2">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="section-content mb-4">
                                <div className="item-header">
                                    <span>{edu.institution}</span>
                                    <span>{formatDate(edu.graduation_date)}</span>
                                </div>
                                <div className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                            </div>
                        ))}
                    </section>
                )}

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2>Projects</h2>
                        {data.project.map((proj, index) => {
                            const projectLink = getProjectLink(proj);

                            return (
                                <div key={index} className="section-content mb-4">
                                    <div className="item-header">
                                        <span>{proj.name}</span>
                                        {proj.date && <span className="font-normal">{formatDate(proj.date)}</span>}
                                    </div>
                                    {projectLink && (
                                        <div className="text-[10px] mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                            <a href={normalizeUrl(projectLink)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(projectLink)}</a>
                                        </div>
                                    )}
                                    {proj.description && <div className="text-justify leading-relaxed">{proj.description}</div>}
                                </div>
                            );
                        })}
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="achievements-grid">
                            {flatCertificates.map((cert, idx) => (
                                <div key={idx} className="achievement-item">
                                    <div className="font-bold text-xs mb-1">{cert.subheading}</div>
                                    <div className="text-[10px] text-gray-600 italic leading-snug">{cert.description}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h2>Skills</h2>
                        <div className="skills-list">
                            {Array.isArray(data.skills) ? (
                                data.skills.join(' • ')
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <span key={idx}>
                                        {Array.isArray(items) ? items.join(' • ') : items}
                                        {idx < Object.entries(data.skills).length - 1 ? ' • ' : ''}
                                    </span>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default JaneTemplate;
