import React from 'react';
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react';

const SebastianTemplate = ({ data, accentColor = '#3B82F6' }) => {
    // Helper to format dates
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
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
                
                .sebastian-template {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    color: #444;
                }
                .sebastian-template h1 {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: #000;
                }
                .sebastian-template .profession {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: ${accentColor};
                }
                .sebastian-template .contact-bar {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 30px;
                    font-size: 10px;
                    font-weight: 600;
                }
                .sebastian-template .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .sebastian-template .contact-icon {
                    color: ${accentColor};
                }
                .sebastian-template h2 {
                    font-size: 14px;
                    font-weight: 800;
                    text-transform: uppercase;
                    border-bottom: 2.5px solid #000;
                    margin-top: 25px;
                    margin-bottom: 15px;
                    padding-bottom: 3px;
                    color: #000;
                    letter-spacing: 0.5px;
                }
                .sebastian-template .item-header {
                    font-size: 13px;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 2px;
                }
                .sebastian-template .company-name {
                    font-size: 12px;
                    font-weight: 700;
                    color: ${accentColor};
                    margin-bottom: 4px;
                }
                .sebastian-template .meta-info {
                    font-size: 10px;
                    color: #666;
                    display: flex;
                    gap: 15px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .sebastian-template ul {
                    list-style-type: none;
                    margin-top: 8px;
                }
                .sebastian-template li {
                    position: relative;
                    padding-left: 15px;
                    margin-bottom: 5px;
                    text-align: justify;
                }
                .sebastian-template li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: ${accentColor};
                    font-weight: bold;
                }
                .sebastian-template .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }
                .sebastian-template .skill-tag {
                    border: 1px solid #ddd;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-weight: 600;
                    color: #555;
                }
                .sebastian-template .strengths-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 15px;
                }
                .sebastian-template .strength-item h3 {
                    font-size: 12px;
                    font-weight: 800;
                    color: #000;
                    margin-bottom: 6px;
                }
            `}</style>

            <div className="sebastian-template">
                <header>
                    <h1>{data.personal_info?.full_name || "Sebastian Hurst"}</h1>
                    <div className="profession">{data.personal_info?.profession || "Business Data Analyst"}</div>
                    <div className="contact-bar">
                        {data.personal_info?.phone && (
                            <div className="contact-item">
                                <Phone size={14} className="contact-icon" />
                                <span>{data.personal_info.phone}</span>
                            </div>
                        )}
                        {data.personal_info?.email && (
                            <div className="contact-item">
                                <Mail size={14} className="contact-icon" />
                                <a href={`mailto:${data.personal_info.email}`} className="hover:underline whitespace-nowrap">{data.personal_info.email}</a>
                            </div>
                        )}
                        {data.personal_info?.linkedin && (
                            <div className="contact-item">
                                <Linkedin size={14} className="contact-icon" />
                                <a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.linkedin)}</a>
                            </div>
                        )}
                        {data.personal_info?.github && (
                            <div className="contact-item">
                                <span className="contact-icon">💻</span>
                                <a href={normalizeUrl(data.personal_info.github)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.github)}</a>
                            </div>
                        )}
                        {data.personal_info?.website && (
                            <div className="contact-item">
                                <span className="contact-icon">🌐</span>
                                <a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{formatLink(data.personal_info.website)}</a>
                            </div>
                        )}
                        {data.personal_info?.location && (
                            <div className="contact-item">
                                <MapPin size={14} className="contact-icon" />
                                <span>{data.personal_info.location}</span>
                            </div>
                        )}
                    </div>
                </header>

                <section>
                    <h2>Personal Details</h2>
                    <div className="space-y-1">
                        {data.personal_info?.phone && <p><span className="font-semibold">Phone:</span> {data.personal_info.phone}</p>}
                        {data.personal_info?.location && <p><span className="font-semibold">Location:</span> {data.personal_info.location}</p>}
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
                            <div key={index} className="mb-6">
                                <div className="item-header">{exp.position}</div>
                                <div className="company-name">{exp.company}</div>
                                <div className="meta-info">
                                    <span>📅 {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                                    {exp.location && <span>📍 {exp.location}</span>}
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

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="item-header">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                                <div className="company-name">{edu.institution}</div>
                                <div className="meta-info">
                                    <span>📅 {formatDate(edu.graduation_date)}</span>
                                    {edu.location && <span>📍 {edu.location}</span>}
                                </div>
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
                                    <div className="item-header">{proj.name}</div>
                                    <div className="meta-info">
                                        {proj.date && <span>📅 {formatDate(proj.date)}</span>}
                                        {projectLink && <span className="whitespace-nowrap"><a href={normalizeUrl(projectLink)} target="_blank" rel="noreferrer" className="hover:underline">{formatLink(projectLink)}</a></span>}
                                    </div>
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
                    <section>
                        <h2>Skills</h2>
                        <div className="skills-container">
                            {Array.isArray(data.skills) ? (
                                data.skills.map((skill, idx) => (
                                    <div key={idx} className="skill-tag">{skill}</div>
                                ))
                            ) : (
                                Object.values(data.skills).flatMap(s => Array.isArray(s) ? s : [s]).map((skill, idx) => (
                                    <div key={idx} className="skill-tag">{skill}</div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {flatCertificates.length > 0 && (
                    <section>
                        <h2>Certificates</h2>
                        <ul>
                            {flatCertificates.map((cert, idx) => (
                                <li key={idx}>
                                    <span className="font-semibold">{cert.subheading}</span>
                                    {cert.description && <span> — {cert.description}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section>
                    <h2>Strengths</h2>
                    <div className="strengths-grid">
                        <div className="strength-item">
                            <h3>Stakeholder Engagement</h3>
                            <p className="text-justify leading-snug">With a technical background & outstanding communications skills I can translate data opportunities into business outcomes</p>
                        </div>
                        <div className="strength-item">
                            <h3>Strategic Focus</h3>
                            <p className="text-justify leading-snug">Delivering positive outcomes by focusing on strategic objective with a pragmatic and value add approach</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SebastianTemplate;
