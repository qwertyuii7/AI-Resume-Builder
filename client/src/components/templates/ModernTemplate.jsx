import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';

const ExecutiveTemplate = ({ data, accentColor = '#374151' }) => {

	// Helper to format dates
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		const date = new Date(year, month - 1);
		return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
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

	// Helper to flatten skills from object or array format
	const getFlatSkills = () => {
		if (!data.skills) return [];
		if (Array.isArray(data.skills)) {
			return data.skills;
		}
		// Flatten object format: { "Category": ["Skill1", "Skill2"] }
		const flat = [];
		Object.values(data.skills).forEach(skills => {
			if (Array.isArray(skills)) {
				flat.push(...skills);
			}
		});
		return flat;
	};

	const flatSkills = getFlatSkills();

	// Helper to flatten certificates from object or array format
	const getFlatCertificates = () => {
		if (!data.certificates) return [];

		const normalizeCertificateEntry = (entry) => {
			if (typeof entry === 'string') {
				return { subheading: entry, description: "" };
			}

			if (entry && typeof entry === 'object') {
				return {
					subheading: entry.subheading || entry.title || entry.name || "",
					description: entry.description || entry.details || ""
				};
			}

			return { subheading: "", description: "" };
		};

		if (Array.isArray(data.certificates)) {
			return data.certificates.map(normalizeCertificateEntry).filter(entry => entry.subheading.trim());
		}

		const flat = [];
		Object.values(data.certificates).forEach(certs => {
			if (Array.isArray(certs)) {
				flat.push(...certs.map(normalizeCertificateEntry).filter(entry => entry.subheading.trim()));
			}
		});
		return flat;
	};

	const flatCertificates = getFlatCertificates();

	const normalizeUrl = (url) => {
		if (!url) return "";
		return /^https?:\/\//i.test(url) ? url : `https://${url}`;
	};

	return (
		<>
			<style>{`
		  @media print {
		    .shadow-2xl, .shadow-xl { box-shadow: none !important; }
		  }
		`}</style>
			<div className="w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 md:p-10 text-slate-800 shadow-2xl font-sans print:shadow-none">

				{/* --- HEADER --- */}
				<header className="flex flex-col md:flex-row justify-between items-start mb-5 gap-4">

					{/* Name & Title */}
					<div className="flex-1">
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 uppercase leading-none mb-1.5">
							{data.personal_info?.full_name || "Your Name"}
						</h1>
						<p className="text-lg text-slate-500 font-medium" style={{ color: accentColor }}>
							{data.personal_info?.profession || "Professional Title"}
						</p>
					</div>

					{/* Contact Info */}
					<div className="flex flex-col gap-1.5 text-[13px] text-slate-600 md:items-end">
						{data.personal_info?.email && (
							<div className="flex items-center gap-2">
								<a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
								<Mail size={14} style={{ color: accentColor }} />
							</div>
						)}
						{data.personal_info?.phone && (
							<div className="flex items-center gap-2">
								<span>{data.personal_info.phone}</span>
								<Phone size={14} style={{ color: accentColor }} />
							</div>
						)}
						{data.personal_info?.location && (
							<div className="flex items-center gap-2">
								<span>{data.personal_info.location}</span>
								<MapPin size={14} style={{ color: accentColor }} />
							</div>
						)}
						{data.personal_info?.linkedin && (
							<div className="flex items-center gap-2">
								<a href={normalizeUrl(data.personal_info.linkedin)} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:underline">{data.personal_info.linkedin}</a>
								<Linkedin size={14} style={{ color: accentColor }} />
							</div>
						)}
						{data.personal_info?.website && (
							<div className="flex items-center gap-2">
								<a href={normalizeUrl(data.personal_info.website)} target="_blank" rel="noreferrer" className="truncate max-w-[150px] hover:underline">{data.personal_info.website}</a>
								<Globe size={14} style={{ color: accentColor }} />
							</div>
						)}
					</div>
				</header>

				{/* Divider Line */}
				<hr className="border-t-2 mb-6 opacity-50" style={{ borderColor: accentColor }} />

				<div className="space-y-5">

					{/* --- SUMMARY --- */}
					{data.professional_summary && (
						<section>
							<h2 className="text-sm font-bold uppercase tracking-widest mb-2.5 text-slate-900 border-b border-slate-200 pb-1">
								Executive Summary
							</h2>
							<p className="text-slate-700 leading-6 text-[13px] text-justify">
								{data.professional_summary}
							</p>
						</section>
					)}

					{/* --- EXPERIENCE --- */}
					{data.experience && data.experience.length > 0 && (
						<section>
							<h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 border-b border-slate-200 pb-1">
								Professional Experience
							</h2>

							<div className="space-y-4">
								{data.experience.map((exp, index) => (
									<div key={index}>
										<div className="flex justify-between items-baseline">
											<h3 className="text-base font-bold text-slate-800">
												{exp.position}
											</h3>
											<span className="text-[13px] font-semibold text-slate-500 whitespace-nowrap">
												{formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
											</span>
										</div>

										<div className="text-[14px] font-medium mb-2" style={{ color: accentColor }}>
											{exp.company}
										</div>

										{exp.description && (
											<div className="text-[13px] text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-100 whitespace-pre-line">
												{exp.description}
											</div>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* --- PROJECTS --- */}
					{data.project && data.project.length > 0 && (
						<section>
							<h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 border-b border-slate-200 pb-1">
								Key Projects
							</h2>
							<div className="grid grid-cols-1 gap-3">
								{data.project.map((proj, index) => (
									<div key={index} className="bg-slate-50 p-3 rounded border border-slate-100">
										<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-1 w-full">
											<div className="min-w-0 flex items-center gap-2">
												<h3 className="font-bold text-slate-800">{proj.name}</h3>
												{proj.link && (
													<a href={normalizeUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold hover:underline" style={{ color: accentColor }}>
														View Project
													</a>
												)}
											</div>
											{proj.date && <span className="text-[12px] text-slate-500 whitespace-nowrap justify-self-end text-right">{formatDate(proj.date)}</span>}
										</div>
										{proj.type && <p className="text-[12px] text-slate-500 mb-2">{proj.type}</p>}
										{getProjectPoints(proj).length > 0 && (
											<ul className="list-disc list-outside ml-4 text-[13px] text-slate-600 leading-relaxed space-y-1 marker:text-slate-300">
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

					<div className="flex flex-col md:flex-row gap-6">

						{/* --- EDUCATION --- */}
						{data.education && data.education.length > 0 && (
							<section className="flex-1">
								<h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 border-b border-slate-200 pb-1">
									Education
								</h2>
								<div className="space-y-2.5">
									{data.education.map((edu, index) => (
										<div key={index}>
											<div className="font-bold text-slate-800">{edu.degree}</div>
											<div className="text-[13px] text-slate-600">{edu.institution}</div>
											<div className="text-[13px] text-slate-400 mt-0.5">
												{formatDate(edu.graduation_date)}
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* --- SKILLS --- */}
						{flatSkills && flatSkills.length > 0 && (
							<section className="flex-1">
								<h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 border-b border-slate-200 pb-1">
									Technical Skills
								</h2>
								<div className="flex flex-wrap gap-x-3 gap-y-1">
									{flatSkills.map((skill, index) => (
										<div key={index} className="text-[13px] text-slate-700 flex items-center gap-2">
											<span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
											{skill}
										</div>
									))}
								</div>
							</section>
						)}

						{/* --- CERTIFICATES --- */}
						{flatCertificates && flatCertificates.length > 0 && (
							<section className="flex-1">
								<h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-slate-900 border-b border-slate-200 pb-1">
									Certificates
								</h2>
								<div className="space-y-1.5">
									{flatCertificates.map((cert, index) => (
										<div key={index} className="text-[13px] text-slate-700 flex items-center gap-2">
											<span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
											<span>
												{cert.subheading}
												{cert.description ? ` — ${cert.description}` : ''}
											</span>
										</div>
									))}
								</div>
							</section>
						)}
					</div>

				</div>
			</div>
		</>
	);
}

export default ExecutiveTemplate;