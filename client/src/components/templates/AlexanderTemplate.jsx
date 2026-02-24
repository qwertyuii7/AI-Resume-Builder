import React from 'react';

const AlexanderTemplate = ({ data, accentColor = '#000000' }) => {
    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit" });
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
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
                
                .alexander-template {
                    font-family: 'Source Sans Pro', sans-serif;
                    font-size: 11px;
                    color: #333;
                }
                .alexander-template h1 {
                    font-size: 28px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 2px;
                    color: #000;
                }
                .alexander-template .roles {
                    font-size: 13px;
                    font-weight: 300;
                    text-align: center;
                    margin-bottom: 4px;
                    color: #555;
                }
                .alexander-template .contact-line {
                    font-size: 10px;
                    text-align: center;
                    margin-bottom: 25px;
                    color: #444;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .alexander-template h2 {
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                    text-transform: capitalize;
                    border-top: 1px solid #000;
                    border-bottom: 1px solid #000;
                    margin-top: 20px;
                    margin-bottom: 12px;
                    padding: 4px 0;
                    color: #000;
                }
                .alexander-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 300;
                    color: #888;
                }
                .alexander-template .item-title {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    font-size: 12px;
                    color: #000;
                    margin-top: 2px;
                }
                .alexander-template ul {
                    list-style-type: disc;
                    margin-left: 18px;
                    margin-top: 5px;
                }
                .alexander-template li {
                    margin-bottom: 4px;
                    text-align: justify;
                }
                .alexander-template .skills-line {
                    text-align: center;
                    font-size: 10px;
                    margin-top: 10px;
                }
                .alexander-template .grid-section {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-top: 10px;
                }
                .alexander-template .grid-item {
                    border-top: 1.5px solid #000;
                    padding-top: 8px;
                }
                .alexander-template .grid-item h3 {
                    font-size: 11px;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #000;
                }
                .alexander-template .grid-item p {
                    font-size: 10px;
                    color: #555;
                    line-height: 1.3;
                }
            `}</style>

            <div className="alexander-template">
                <header>
                    <h1>{data.personal_info?.full_name || "Alexander Taylor"}</h1>
                    <div className="roles">{data.personal_info?.profession || "Senior Software Engineer | Software Development | Cloud Technologies | Team Leadership"}</div>
                    <div className="contact-line">
                        {data.personal_info?.email && <a href={`mailto:${data.personal_info.email}`} className="hover:underline whitespace-nowrap">{data.personal_info.email}</a>}
                        {data.personal_info?.email && data.personal_info?.linkedin && <span>•</span>}
                        {data.personal_info?.linkedin && <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">LinkedIn</a>}
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
                    <div className="text-center text-[10px] leading-relaxed">
                        {data.personal_info?.phone && <div><span className="font-semibold">Phone:</span> {data.personal_info.phone}</div>}
                        {data.personal_info?.location && <div><span className="font-semibold">Location:</span> {data.personal_info.location}</div>}
                    </div>
                </section>

                {data.professional_summary && (
                    <section>
                        <h2>Summary</h2>
                        <div className="text-justify leading-relaxed">
                            {data.professional_summary}
                        </div>
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="mb-5">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{exp.location}</span>
                                </div>
                                <div className="item-title">
                                    <span>{exp.position}</span>
                                    <span>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
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

                {data.skills && (
                    <section>
                        <h2>Skills</h2>
                        <div className="skills-line">
                            {Array.isArray(data.skills) ? (
                                data.skills.join(' • ')
                            ) : (
                                Object.values(data.skills).flatMap(s => Array.isArray(s) ? s : [s]).join(' • ')
                            )}
                        </div>
                    </section>
                )}

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2>Projects</h2>
                        {data.project.map((proj, index) => {
                            const projectLink = getProjectLink(proj);

                            return (
                                <div key={index} className="mb-3">
                                    <div className="item-title">
                                        <span>{proj.name}</span>
                                        {proj.date && <span className="font-normal">{formatDate(proj.date)}</span>}
                                    </div>
                                    {projectLink && (
                                        <div className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            <a href={normalizeUrl(projectLink)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(projectLink)}</a>
                                        </div>
                                    )}
                                    {proj.description && <div className="text-justify italic">{proj.description}</div>}
                                </div>
                            );
                        })}
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="item-header">
                                    <span className="font-semibold text-black">{edu.institution}</span>
                                    <span className="text-black font-semibold">{edu.location}</span>
                                </div>
                                <div className="item-title">
                                    <span className="font-normal italic">{edu.degree} in {edu.field}</span>
                                    <span className="font-normal italic">{formatDate(edu.graduation_date)}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="grid-section">
                            {flatCertificates.map((cert, idx) => (
                                <div key={idx} className="grid-item">
                                    <h3>{cert.subheading}</h3>
                                    <p>{cert.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AlexanderTemplate;
