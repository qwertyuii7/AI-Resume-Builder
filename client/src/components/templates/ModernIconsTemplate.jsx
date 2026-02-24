import React from 'react';
import { Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

const ModernIconsTemplate = ({ data, accentColor = '#000000' }) => {
    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
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

    return (
        <div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[1.2cm] text-black font-sans leading-snug print:shadow-none shadow-lg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
                
                .modern-icons-template {
                    font-family: 'Source Sans Pro', sans-serif;
                    font-size: 11px;
                    color: #333;
                }
                .modern-icons-template h1 {
                    font-size: 26px;
                    font-weight: 400;
                    text-align: center;
                    margin-bottom: 10px;
                    color: #000;
                }
                .modern-icons-template .contact-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                    font-size: 10px;
                }
                .modern-icons-template .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .modern-icons-template h2 {
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    border-bottom: 1px solid #ddd;
                    margin-top: 15px;
                    margin-bottom: 8px;
                    padding-bottom: 2px;
                    color: #000;
                }
                .modern-icons-template .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #000;
                }
                .modern-icons-template .item-sub {
                    font-style: italic;
                    margin-bottom: 4px;
                }
                .modern-icons-template ul {
                    list-style-type: disc;
                    margin-left: 18px;
                }
                .modern-icons-template li {
                    margin-bottom: 2px;
                }
            `}</style>

            <div className="modern-icons-template">
                <header>
                    <h1>{data.personal_info?.full_name || "Your Name"}</h1>
                    <div className="contact-header">
                        <div className="contact-item">
                            <Mail size={12} />
                            {data.personal_info?.email ? (
                                <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="contact-item">
                            <Linkedin size={12} />
                            {data.personal_info?.linkedin ? (
                                <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.linkedin)}</a>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="contact-item">
                            <Globe size={12} />
                            {data.personal_info?.website ? (
                                <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.website)}</a>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="contact-item">
                            <Github size={12} />
                            {data.personal_info?.github ? (
                                <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(data.personal_info.github)}</a>
                            ) : (
                                <span>—</span>
                            )}
                        </div>
                        {data.personal_info?.phone && (
                            <>
                                <span className="text-gray-300">|</span>
                                <div className="contact-item">
                                    <Phone size={12} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {data.professional_summary && (
                    <section>
                        <h2>Summary</h2>
                        <p className="text-justify leading-relaxed">{data.professional_summary}</p>
                    </section>
                )}

                <section>
                    <h2>Personal Details</h2>
                    <div className="space-y-1">
                        {data.personal_info?.phone && <p><span className="font-semibold">Phone:</span> {data.personal_info.phone}</p>}
                        {data.personal_info?.location && <p><span className="font-semibold">Location:</span> {data.personal_info.location}</p>}
                    </div>
                </section>

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2>Work Experience</h2>
                        {data.experience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="item-header">
                                    <span>{exp.position}</span>
                                    <span>{formatDate(exp.start_date)} – {exp.is_current ? "present" : formatDate(exp.end_date)}</span>
                                </div>
                                <div className="item-sub">{exp.company}, {exp.location}</div>
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
                                    <div className="item-header">
                                        <span>{proj.name}</span>
                                        {projectLink && <a href={normalizeUrl(projectLink)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-normal text-[10px]">Link to Demo</a>}
                                    </div>
                                    <p className="leading-relaxed">{proj.description}</p>
                                </div>
                            );
                        })}
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="mb-2">
                                <div className="item-header">
                                    <div className="flex gap-4">
                                        <span className="w-20 font-normal">{formatDate(edu.graduation_date)}</span>
                                        <span>{edu.degree} in {edu.field} at {edu.institution}</span>
                                    </div>
                                    <span className="font-normal">{edu.gpa ? `(GPA: ${edu.gpa})` : ""}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {data.skills && (
                    <section>
                        <h2>Skills</h2>
                        <div className="space-y-1">
                            {Array.isArray(data.skills) ? (
                                data.skills.map((skill, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="w-24 font-semibold">{skill.split(':')[0]}</span>
                                        <span>{skill.split(':')[1] || ""}</span>
                                    </div>
                                ))
                            ) : (
                                Object.entries(data.skills).map(([cat, items], idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="w-24 font-semibold">{cat}</span>
                                        <span>{Array.isArray(items) ? items.join(", ") : items}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <div className="space-y-1">
                            {flatCertificates.map((cert, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <span className="w-24 font-semibold">Certificate</span>
                                    <span>{cert.subheading}{cert.description ? ` — ${cert.description}` : ''}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ModernIconsTemplate;
