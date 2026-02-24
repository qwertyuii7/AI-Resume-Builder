import React from 'react';

const DanetteTemplate = ({ data, accentColor = '#3B82F6' }) => {
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
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
                
                .danette-template {
                    font-family: 'Source Sans Pro', sans-serif;
                    font-size: 11px;
                    color: #333;
                }
                .danette-template h1 {
                    font-size: 26px;
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 2px;
                    text-transform: uppercase;
                    color: #000;
                }
                .danette-template .profession {
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 10px;
                    color: ${accentColor};
                }
                .danette-template .contact-info {
                    text-align: center;
                    font-size: 10px;
                    margin-bottom: 25px;
                    color: #555;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .danette-template h2 {
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                    text-transform: capitalize;
                    border-bottom: 1.5px solid #000;
                    margin-top: 20px;
                    margin-bottom: 12px;
                    padding-bottom: 4px;
                    color: #000;
                }
                .danette-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #000;
                }
                .danette-template .company-link {
                    color: ${accentColor};
                    text-decoration: none;
                    font-weight: 600;
                }
                .danette-template .section-content {
                    margin-bottom: 15px;
                }
                .danette-template ul {
                    list-style-type: disc;
                    margin-left: 18px;
                    margin-top: 6px;
                }
                .danette-template li {
                    margin-bottom: 4px;
                    text-align: justify;
                }
                .danette-template .skills-section {
                    margin-top: 15px;
                }
                .danette-template .skill-category {
                    color: ${accentColor};
                    font-weight: 600;
                    margin-right: 6px;
                }
            `}</style>

            <div className="danette-template">
                <header>
                    <h1>{data.personal_info?.full_name || "DANETTE EASTWOOD"}</h1>
                    <div className="profession">{data.personal_info?.profession || "Full stack Developer"}</div>
                    <div className="contact-info">
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.phone && <span>•</span>}
                        {data.personal_info?.email && <a href={`mailto:${data.personal_info.email}`} className="hover:underline whitespace-nowrap">{data.personal_info.email}</a>}
                        {data.personal_info?.email && data.personal_info?.linkedin && <span>•</span>}
                        {data.personal_info?.linkedin && <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.linkedin)}</a>}
                        {(data.personal_info?.linkedin || data.personal_info?.email) && data.personal_info?.github && <span>•</span>}
                        {data.personal_info?.github && <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.github)}</a>}
                        {(data.personal_info?.github || data.personal_info?.linkedin || data.personal_info?.email) && data.personal_info?.website && <span>•</span>}
                        {data.personal_info?.website && <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.website)}</a>}
                        {(data.personal_info?.website || data.personal_info?.github || data.personal_info?.linkedin || data.personal_info?.email) && data.personal_info?.location && <span>•</span>}
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    </div>
                </header>

                <section>
                    <h2>Personal Details</h2>
                    <div className="section-content space-y-1">
                        {data.personal_info?.phone && <div><span className="font-semibold">Phone:</span> {data.personal_info.phone}</div>}
                        {data.personal_info?.location && <div><span className="font-semibold">Location:</span> {data.personal_info.location}</div>}
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

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="section-content mb-5">
                                <div className="item-header">
                                    <span className="company-link">{exp.company}</span>
                                    <span className="font-normal">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                </div>
                                <div className="font-bold text-gray-800">{exp.position}</div>
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

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="section-content mb-4">
                                <div className="item-header">
                                    <span className="company-link">{edu.institution}</span>
                                    <span className="font-normal">{formatDate(edu.graduation_date)}</span>
                                </div>
                                <div className="font-bold">{edu.degree} in {edu.field}</div>
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
                                    {proj.description && (
                                        <ul>
                                            {proj.description.split('\n').map((line, i) => (
                                                line.trim() && <li key={i}>{line.trim()}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                )}

                {data.skills && (
                    <section className="skills-section">
                        <h2>Skills</h2>
                        <div className="space-y-3">
                            {Array.isArray(data.skills) ? (
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.join(' • ')}
                                </div>
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx} className="flex">
                                        <span className="skill-category w-36 shrink-0">{cat}:</span>
                                        <span>{Array.isArray(items) ? items.join(' • ') : items}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="space-y-2">
                            {flatCertificates.map((cert, idx) => (
                                <div key={idx}>
                                    <span className="font-semibold">{cert.subheading}</span>
                                    {cert.description && <span> — {cert.description}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default DanetteTemplate;
