import React from 'react';

const IsabelleTemplate = ({ data, accentColor = '#000000' }) => {
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.5cm] text-black font-serif leading-tight print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
                
                .isabelle-template {
                    font-family: 'Inter', sans-serif;
                    font-size: 11px;
                    color: #222;
                }
                .isabelle-template h1 {
                    font-family: 'Crimson Pro', serif;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 2px;
                    text-transform: uppercase;
                    color: #000;
                }
                .isabelle-template .profession {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 6px;
                    color: #444;
                }
                .isabelle-template .contact-info {
                    font-size: 10px;
                    margin-bottom: 30px;
                    color: #000;
                    font-weight: 600;
                    display: flex;
                    gap: 8px;
                }
                .isabelle-template h2 {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-top: 25px;
                    margin-bottom: 15px;
                    color: #888;
                    letter-spacing: 1px;
                }
                .isabelle-template .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }
                .isabelle-template .achievement-item h3 {
                    font-size: 13px;
                    font-weight: 700;
                    color: #444;
                    margin-bottom: 4px;
                }
                .isabelle-template .achievement-item p {
                    font-size: 10.5px;
                    color: #555;
                    line-height: 1.4;
                    text-align: justify;
                }
                .isabelle-template .job-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #000;
                }
                .isabelle-template .company-name {
                    font-style: italic;
                    color: #555;
                    margin-bottom: 4px;
                }
                .isabelle-template .meta-right {
                    text-align: right;
                    font-size: 10px;
                    color: #777;
                }
                .isabelle-template ul {
                    list-style-type: disc;
                    margin-left: 15px;
                    margin-top: 5px;
                }
                .isabelle-template li {
                    margin-bottom: 3px;
                    text-align: justify;
                    color: #555;
                }
                .isabelle-template .tech-stack {
                    font-size: 10.5px;
                    color: #444;
                    line-height: 1.5;
                }
            `}</style>

            <div className="isabelle-template">
                <header>
                    <h1>{data.personal_info?.full_name || "ISABELLE TODD"}</h1>
                    <div className="profession">{data.personal_info?.profession || "I solve problems and help people overcome obstacles."}</div>
                    <div className="contact-info">
                        {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data.personal_info?.phone && <span>|</span>}
                        {data.personal_info?.email && <a href={`mailto:${data.personal_info.email}`} className="whitespace-nowrap hover:underline">{data.personal_info.email}</a>}
                        {data.personal_info?.email && data.personal_info?.linkedin && <span>|</span>}
                        {data.personal_info?.linkedin && <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:underline">{formatLink(data.personal_info.linkedin)}</a>}
                        {(data.personal_info?.linkedin || data.personal_info?.email || data.personal_info?.phone) && data.personal_info?.github && <span>|</span>}
                        {data.personal_info?.github && <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:underline">{formatLink(data.personal_info.github)}</a>}
                        {(data.personal_info?.github || data.personal_info?.linkedin || data.personal_info?.email || data.personal_info?.phone) && data.personal_info?.website && <span>|</span>}
                        {data.personal_info?.website && <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:underline">{formatLink(data.personal_info.website)}</a>}
                        {(data.personal_info?.website || data.personal_info?.github || data.personal_info?.linkedin) && data.personal_info?.location && <span>|</span>}
                        {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    </div>
                </header>

                {data.professional_summary && (
                    <section>
                        <h2>Summary</h2>
                        <div className="text-justify leading-relaxed text-[#444]">
                            {data.professional_summary}
                        </div>
                    </section>
                )}

                <section>
                    <h2>Personal Details</h2>
                    <div className="tech-stack">
                        {data.personal_info?.phone && <div><span className="font-semibold">Phone:</span> {data.personal_info.phone}</div>}
                        {data.personal_info?.location && <div><span className="font-semibold">Location:</span> {data.personal_info.location}</div>}
                    </div>
                </section>

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="grid-2">
                            {flatCertificates.map((cert, idx) => (
                                <div key={idx} className="achievement-item">
                                    <h3>{cert.subheading}</h3>
                                    <p>{cert.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="job-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                                    <div className="company-name">{edu.institution}</div>
                                </div>
                                <div className="meta-right">
                                    {formatDate(edu.graduation_date)}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="job-title">{exp.position}</div>
                                        <div className="company-name">{exp.company}</div>
                                    </div>
                                    <div className="meta-right">
                                        <div>{exp.location}</div>
                                        <div>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</div>
                                    </div>
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

                {data.project && data.project.length > 0 && (
                    <section>
                        <h2>Projects</h2>
                        {data.project.map((proj, index) => {
                            const projectLink = getProjectLink(proj);

                            return (
                                <div key={index} className="mb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="job-title">{proj.name}</div>
                                        <div className="meta-right">{proj.date ? formatDate(proj.date) : ''}</div>
                                    </div>
                                    {projectLink && (
                                        <div className="text-[10px] mb-1">
                                            <a href={normalizeUrl(projectLink)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{formatLink(projectLink)}</a>
                                        </div>
                                    )}
                                    {proj.description && <div className="text-justify text-[#555]">{proj.description}</div>}
                                </div>
                            );
                        })}
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h2>Skills</h2>
                        <div className="tech-stack">
                            {Array.isArray(data.skills) ? (
                                data.skills.join(', ')
                            ) : (
                                Object.values(data.skills).flatMap(s => Array.isArray(s) ? s : [s]).join(', ')
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default IsabelleTemplate;
