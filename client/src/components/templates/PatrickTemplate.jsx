import React from 'react';

const PatrickTemplate = ({ data, accentColor = '#8D1515' }) => {
    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" }).toUpperCase();
    };

    const getNormalizedSkills = () => {
        if (!data.skills) return {};
        if (Array.isArray(data.skills)) {
            const categories = {};
            data.skills.forEach(skill => {
                if (skill.includes(':')) {
                    const [cat, items] = skill.split(':');
                    categories[cat.trim()] = items.trim();
                } else {
                    if (!categories['Other']) categories['Other'] = [];
                    categories['Other'].push(skill);
                }
            });
            return categories;
        }
        return data.skills;
    };

    const skillsData = getNormalizedSkills();

    const formatLink = (value) => (value || '').replace(/^https?:\/\//, '');
    const normalizeUrl = (url) => {
        if (!url) return '#';
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
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
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1cm] text-black font-serif leading-tight print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&display=swap');
                
                .patrick-template {
                    font-family: 'Crimson Pro', serif;
                    font-size: 11px;
                    line-height: 1.3;
                    color: #333;
                }
                .patrick-template h1 {
                    font-size: 28px;
                    font-weight: 400;
                    text-align: center;
                    margin-bottom: 2px;
                    color: #000;
                }
                .patrick-template h2 {
                    font-size: 18px;
                    font-weight: 400;
                    font-style: italic;
                    text-align: center;
                    margin-bottom: 15px;
                    color: #555;
                }
                .patrick-template h3 {
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: ${accentColor};
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 2px;
                    margin-top: 15px;
                    margin-bottom: 8px;
                    letter-spacing: 0.05em;
                }
                .patrick-template .contact-box {
                    background-color: #F8E5B0;
                    padding: 10px;
                    margin-bottom: 15px;
                    font-size: 10.5px;
                    line-height: 1.5;
                }
                .patrick-template .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 2px;
                }
                .patrick-template .experience-item {
                    margin-bottom: 12px;
                }
                .patrick-template .exp-header {
                    display: flex;
                    justify-content: flex-end;
                    font-size: 10px;
                    color: #666;
                    text-transform: uppercase;
                }
                .patrick-template .company-name {
                    font-weight: 600;
                    font-size: 11px;
                }
                .patrick-template .job-title {
                    font-style: italic;
                    font-size: 11px;
                    margin-bottom: 4px;
                }
                .patrick-template .section-grid {
                    display: grid;
                    grid-template-columns: 1.7fr 1fr;
                    gap: 30px;
                }
                .patrick-template .skill-category {
                    font-weight: 700;
                    margin-right: 5px;
                }
            `}</style>

            <div className="patrick-template">
                <header className="mb-6">
                    <h1>{data.personal_info?.full_name || "Patrick O'Hara"}</h1>
                    <h2>{data.personal_info?.profession || "Curriculum Vitae"}</h2>
                </header>

                <div className="section-grid">
                    {/* Left Column */}
                    <div>
                        {data.professional_summary && (
                            <section>
                                <h3>Summary</h3>
                                <p className="text-justify">{data.professional_summary}</p>
                            </section>
                        )}

                        <section>
                            <h3>Work Experience</h3>
                            {data.experience?.map((exp, index) => (
                                <div key={index} className="experience-item">
                                    <div className="exp-header">
                                        {formatDate(exp.start_date)} – {exp.is_current ? "PRESENT" : formatDate(exp.end_date)}
                                    </div>
                                    <div className="company-name">{exp.company}</div>
                                    <div className="job-title">{exp.position}</div>
                                    <p className="text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h3>Education</h3>
                            {data.education?.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-24 shrink-0 text-[10px] text-gray-500 uppercase pt-1">
                                            {formatDate(edu.graduation_date).split(' ')[1]} – {formatDate(edu.graduation_date).split(' ')[1]}
                                        </div>
                                        <div>
                                            <div className="font-bold">{edu.field || edu.degree}</div>
                                            <div className="text-[10px] uppercase text-gray-600">{edu.degree}</div>
                                            <div className="italic">{edu.institution}, {edu.location}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {data.project && data.project.length > 0 && (
                            <section>
                                <h3>Projects</h3>
                                <div className="space-y-3">
                                    {data.project.map((proj, index) => (
                                        <div key={index} className="text-[11px]">
                                            <div className="font-bold">
                                                {proj.name}
                                                <a href={normalizeUrl(proj.link)} target="_blank" rel="noreferrer" className="ml-1 font-bold hover:underline">View Project</a>
                                            </div>
                                            {proj.type && <div className="italic text-gray-600">{proj.type}</div>}
                                            {getProjectPoints(proj).length > 0 && (
                                                <ul className="list-disc ml-4 mt-1 space-y-0.5">
                                                    {getProjectPoints(proj).map((point, pointIndex) => (
                                                        <li key={pointIndex}>{point}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div>
                        <div className="contact-box shadow-sm">
                            <div className="contact-item">
                                <span className="w-4">📍</span>
                                <span>{data.personal_info?.location || "312 Poplar Drive, Oakville, ON"}</span>
                            </div>
                            <div className="contact-item">
                                <span className="w-4">📞</span>
                                <span>{data.personal_info?.phone || "(902) 441 5181"}</span>
                            </div>
                            <div className="contact-item">
                                <span className="w-4">✉️</span>
                                {data.personal_info?.email ? (
                                    <a href={`mailto:${data.personal_info.email}`} className="hover:underline">
                                        {data.personal_info.email}
                                    </a>
                                ) : (
                                    <span>—</span>
                                )}
                            </div>
                            <div className="contact-item">
                                <span className="w-4">💼</span>
                                {data.personal_info?.linkedin ? (
                                    <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">
                                        {formatLink(data.personal_info.linkedin)}
                                    </a>
                                ) : (
                                    <span>—</span>
                                )}
                            </div>
                            <div className="contact-item">
                                <span className="w-4">🌐</span>
                                {data.personal_info?.website ? (
                                    <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">
                                        {formatLink(data.personal_info.website)}
                                    </a>
                                ) : (
                                    <span>—</span>
                                )}
                            </div>
                            <div className="contact-item">
                                <span className="w-4">💻</span>
                                {data.personal_info?.github ? (
                                    <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">
                                        {formatLink(data.personal_info.github)}
                                    </a>
                                ) : (
                                    <span>—</span>
                                )}
                            </div>
                        </div>

                        {data.skills && Object.keys(skillsData).length > 0 && (
                            <section>
                                <h3>Computer Skills</h3>
                                <div className="space-y-2">
                                    {Object.entries(skillsData).map(([category, items], idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <span className="uppercase text-[9px] font-bold text-gray-500">{category}</span>
                                            <span className="text-[11px]">{Array.isArray(items) ? items.join(", ") : items}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {flatCertificates.length > 0 && (
                            <section>
                                <h3>Certificates</h3>
                                <div className="space-y-4">
                                    {flatCertificates.map((cert, idx) => (
                                        <div key={idx}>
                                            <div className="font-bold">{cert.subheading}</div>
                                            {cert.description && <div className="text-[10px] text-gray-500">{cert.description}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <h3>Communication Skills</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="uppercase font-bold text-[10px]">English</span>
                                    <span>Native speaker</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="uppercase font-bold text-[10px]">French</span>
                                    <span>Intermediate</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatrickTemplate;
