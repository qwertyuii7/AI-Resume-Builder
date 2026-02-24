import React from 'react';

const SukumarTemplate = ({ data }) => {
    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
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

    const formatLink = (value) => (value || '').replace(/^https?:\/\//, '');
    const normalizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
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

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-sans leading-relaxed print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                
                .sukumar-template {
                    font-family: 'Roboto', sans-serif;
                    font-size: 11px;
                    color: #000;
                }
                .sukumar-template h1 {
                    font-size: 24px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .sukumar-template .contact-info {
                    text-align: center;
                    font-size: 10px;
                    margin-bottom: 20px;
                    color: #333;
                }
                .sukumar-template h2 {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid #000;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    padding-bottom: 2px;
                }
                .sukumar-template .section-content {
                    padding-left: 20px;
                    margin-bottom: 10px;
                }
                .sukumar-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .sukumar-template .item-sub {
                    font-weight: 400;
                    color: #444;
                    margin-bottom: 4px;
                }
                .sukumar-template .skills-grid {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    row-gap: 4px;
                }
                .sukumar-template .skill-label {
                    font-weight: 700;
                }
                .sukumar-template ul {
                    list-style-type: disc;
                    margin-left: 15px;
                }
                .sukumar-template li {
                    margin-bottom: 3px;
                }
            `}</style>

            <div className="sukumar-template">
                <header>
                    <h1>{data.personal_info?.full_name || "SUKUMAR DODDA"}</h1>
                    <div className="contact-info">
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data.personal_info?.phone && <span> • {data.personal_info.phone}</span>}
                        <span> • Email: {data.personal_info?.email ? <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a> : '—'}</span>
                        <span> • LinkedIn: {data.personal_info?.linkedin ? <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a> : '—'}</span>
                        <span> • Portfolio: {data.personal_info?.website ? <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a> : '—'}</span>
                        <span> • GitHub: {data.personal_info?.github ? <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a> : '—'}</span>
                    </div>
                </header>

                <section>
                    <h2>Personal Details</h2>
                    <div className="section-content">
                        <ul>
                            {data.personal_info?.phone && <li>Phone: {data.personal_info.phone}</li>}
                            {data.personal_info?.location && <li>Location: {data.personal_info.location}</li>}
                        </ul>
                    </div>
                </section>

                {data.professional_summary && (
                    <section>
                        <h2>Summary</h2>
                        <div className="section-content text-justify">
                            {data.professional_summary}
                        </div>
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        <div className="section-content">
                            {data.education.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <div className="item-header">
                                        <span>{edu.degree} in {edu.field}</span>
                                        <span className="font-normal">{formatDate(edu.graduation_date)} – Present</span>
                                    </div>
                                    <div className="item-sub">
                                        {edu.institution}, {edu.location}<br />
                                        {edu.gpa && `GPA/Percentage: ${edu.gpa}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h2>Skills</h2>
                        <div className="section-content">
                            <div className="skills-grid">
                                {Array.isArray(data.skills) ? (
                                    data.skills.map((skill, idx) => (
                                        <React.Fragment key={idx}>
                                            <span className="skill-label">{skill.split(':')[0]}</span>
                                            <span>{skill.split(':')[1] || ""}</span>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    Object.entries(data.skills).map(([cat, items], idx) => (
                                        <React.Fragment key={idx}>
                                            <span className="skill-label">{cat}</span>
                                            <span>{Array.isArray(items) ? items.join(", ") : items}</span>
                                        </React.Fragment>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        <div className="section-content">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="mb-3">
                                    <div className="item-header">
                                        <span>{exp.position} at {exp.company}</span>
                                        <span className="font-normal">{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                    </div>
                                    <p className="mt-1">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2>Projects</h2>
                        <div className="section-content">
                            {data.project.map((proj, index) => (
                                <div key={index} className="mb-3">
                                    <div className="item-header">
                                        <span>
                                            {proj.name}
                                            {proj.link && (
                                                <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="ml-1 font-bold hover:underline">View Project</a>
                                            )}
                                        </span>
                                        {proj.date && <span className="font-normal">{formatDate(proj.date)}</span>}
                                    </div>
                                    {getProjectPoints(proj).length > 0 && (
                                        <ul className="mt-1">
                                            {getProjectPoints(proj).map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="section-content">
                            <ul className="space-y-1">
                                {flatCertificates.map((cert, idx) => (
                                    <li key={idx} className="flex justify-between">
                                        <span>{cert.subheading}</span>
                                        {cert.description && <span className="text-gray-600 italic">{cert.description}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default SukumarTemplate;
