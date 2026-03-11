import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

const fallbackEnhanceSummary = (text) => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';

    const normalized = cleaned
        .replace(/^i\s+/i, 'an experienced professional who ')
        .replace(/^worked\s+/i, 'delivers ')
        .replace(/^responsible\s+for\s+/i, 'driving ')
        .replace(/^(my\s+role\s+was\s+)/i, 'with a track record of ')
        .replace(/^(i\s+am\s+)/i, 'known for ');

    const firstChar = normalized.charAt(0).toUpperCase();
    const firstSentenceBody = normalized.slice(1).replace(/[.\s]+$/, '');
    let firstSentence = `${firstChar}${firstSentenceBody}.`;

    // Add a second sentence to ensure the result sounds intentionally enhanced and ATS-friendly.
    let secondSentence = 'Delivers measurable outcomes through strong collaboration, problem-solving, and execution in fast-paced environments.';

    const textLower = normalized.toLowerCase();
    if (/react|node|javascript|typescript|python|java|sql/.test(textLower)) {
        secondSentence = 'Leverages modern tools and technical expertise to build reliable solutions, optimize performance, and drive business impact.';
    } else if (/marketing|sales|customer|communication|management|leadership/.test(textLower)) {
        secondSentence = 'Combines strategic thinking, communication, and leadership to improve outcomes and support long-term business goals.';
    }

    let enhanced = `${firstSentence} ${secondSentence}`.replace(/\s+/g, ' ').trim();

    if (enhanced.length > 320) {
        enhanced = `${enhanced.slice(0, 317)}...`;
    }

    // Guarantee output is not effectively identical to the user input.
    if (enhanced.toLowerCase() === cleaned.toLowerCase()) {
        enhanced = `Results-driven professional with proven experience in ${cleaned.replace(/[.\s]+$/, '')}. Brings an ATS-friendly profile focused on impact, ownership, and continuous improvement.`;
    }

    return enhanced;
};

const getModelName = () => {
    // Handles accidental quoted env values like 'gemini-2.5-flash'.
    return (process.env.OPEN_AI_MODEL || 'gemini-2.5-flash').toString().trim().replace(/^['"]|['"]$/g, '');
};

const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), timeoutMs))
    ]);
};

const requestSummaryEnhancement = async (userContent, model) => {
    const response = await withTimeout(ai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: "You are an expert in resume writing. Improve the given professional summary into 1-2 concise, ATS-friendly sentences that highlight impact, skills, and career direction. Return plain text only." },
            {
                role: "user",
                content: userContent,
            },
        ],
    }), 12000);

    const enhanceContent = response?.choices?.[0]?.message?.content?.trim();
    if (!enhanceContent) {
        throw new Error('AI returned empty content');
    }

    return enhanceContent;
};

const requestJobDescriptionEnhancement = async (userContent, model) => {
    const response = await withTimeout(ai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: "You are an expert in resume writing. Rewrite the job description into 1-2 ATS-friendly achievement-focused sentences. Use action verbs and include measurable impact when possible. Return plain text only." },
            {
                role: "user",
                content: userContent,
            },
        ],
    }), 12000);

    const enhancedContent = response?.choices?.[0]?.message?.content?.trim();
    if (!enhancedContent) {
        throw new Error('AI returned empty content');
    }

    return enhancedContent;
};

const sanitizeJobDescriptionInput = (text) => {
    return (text || '')
        .replace(/\s+/g, ' ')
        .replace(/^enhance\s+this\s+job\s+description\s*/i, '')
        .replace(/^job\s+description\s*[:\-]?\s*/i, '')
        .trim();
};

const fallbackEnhanceJobDescription = (text) => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';

    const normalized = cleaned
        .replace(/^i\s+/i, 'Delivered ')
        .replace(/^worked\s+on\s+/i, 'Led ')
        .replace(/^responsible\s+for\s+/i, 'Owned ')
        .replace(/^did\s+/i, 'Executed ')
        .replace(/[.\s]+$/, '');

    const sentenceOne = `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}.`;
    const sentenceTwo = 'Collaborated cross-functionally to improve execution quality, efficiency, and business outcomes.';

    const enhanced = `${sentenceOne} ${sentenceTwo}`.replace(/\s+/g, ' ').trim();
    return enhanced;
};

const finalizeJobDescriptionOutput = (text) => {
    if (!text) return '';

    let output = text
        .replace(/\s+/g, ' ')
        .replace(/\bEnhance this job description\b\s*/ig, '')
        .replace(/\bCurrent Description:\b\s*/ig, '')
        .trim();

    // Remove trailing ellipsis and unfinished sentence tails.
    output = output.replace(/\.\.\.+\s*$/, '').trim();

    // Split into sentences, remove near-duplicate trailing sentences, and rejoin.
    const sentences = output
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

    const unique = [];
    const seen = new Set();
    for (const sentence of sentences) {
        const key = sentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        unique.push(sentence);
    }

    output = unique.join(' ').trim();

    // Ensure final punctuation for polished resume text.
    if (output && !/[.!?]$/.test(output)) {
        output = `${output}.`;
    }

    return output;
};

const extractJsonFromText = (rawText = '') => {
    const text = (rawText || '').toString().trim();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (_) {
        // Continue to block extraction.
    }

    const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        try {
            return JSON.parse(fenced[1].trim());
        } catch (_) {
            // Continue to brace extraction.
        }
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = text.slice(firstBrace, lastBrace + 1);
        try {
            return JSON.parse(candidate);
        } catch (_) {
            return null;
        }
    }

    return null;
};

const toStringSafe = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    return String(value).trim();
};

const normalizeMonthString = (value) => {
    const raw = toStringSafe(value);
    if (!raw) return '';

    if (/^\d{4}-\d{2}$/.test(raw)) return raw;

    const normalized = raw
        .replace(/,/g, ' ')
        .replace(/\bto\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const date = new Date(normalized);
    if (!Number.isNaN(date.getTime())) {
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        return `${date.getFullYear()}-${month}`;
    }

    const yearMatch = normalized.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) return `${yearMatch[0]}-01`;

    return '';
};

const normalizeUrl = (value) => {
    const raw = toStringSafe(value);
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/^[\w.-]+\.[a-z]{2,}/i.test(raw)) return `https://${raw}`;
    return raw;
};

const hasSuspiciousFieldContent = (value = '') => {
    const text = toStringSafe(value);
    if (!text) return false;

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount > 12) return true;
    if (text.length > 90) return true;
    if (/[\n|;]/.test(text)) return true;
    if (/@|https?:\/\//i.test(text)) return true;
    if (/\b(experience|education|skills|projects?|certifications?)\b/i.test(text) && wordCount > 4) return true;

    return false;
};

const cleanHumanName = (value = '') => {
    const raw = toStringSafe(value).replace(/\s+/g, ' ').trim();
    if (!raw || hasSuspiciousFieldContent(raw)) return '';

    const cleaned = raw
        .replace(/[^a-zA-Z.'\-\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const parts = cleaned.split(' ').filter(Boolean);
    if (parts.length < 2 || parts.length > 5) return '';
    if (!parts.every((part) => /^[a-zA-Z][a-zA-Z.'\-]*$/.test(part))) return '';
    return cleaned;
};

const cleanProfession = (value = '') => {
    const raw = toStringSafe(value).replace(/\s+/g, ' ').trim();
    if (!raw || hasSuspiciousFieldContent(raw)) return '';
    return raw.slice(0, 70);
};

const sanitizeSummary = (value = '') => {
    const raw = toStringSafe(value).replace(/\s+/g, ' ').trim();
    if (!raw) return '';
    if (raw.length > 900) return `${raw.slice(0, 897)}...`;
    return raw;
};

const splitToItems = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => toStringSafe(item)).filter(Boolean);
    }

    const raw = toStringSafe(value);
    if (!raw) return [];
    return raw
        .split(/\n|,|;|\||•|·/)
        .map((item) => item.trim())
        .filter(Boolean);
};

const normalizeSkillsObject = (skills) => {
    if (skills && typeof skills === 'object' && !Array.isArray(skills)) {
        const grouped = Object.entries(skills).reduce((acc, [category, items]) => {
            const categoryName = toStringSafe(category);
            const values = splitToItems(items);
            if (categoryName && values.length) {
                acc[categoryName] = [...new Set(values)];
            }
            return acc;
        }, {});

        if (Object.keys(grouped).length) return grouped;
    }

    const flatSkills = splitToItems(skills);
    if (!flatSkills.length) return {};

    const buckets = {
        'Programming Languages': [],
        'Frameworks & Libraries': [],
        'Tools & Platforms': [],
        'Databases': [],
        'Soft Skills': []
    };

    const softKeywords = /communication|leadership|team|collaboration|problem solving|presentation|ownership|adaptability/i;
    const dbKeywords = /sql|mysql|postgres|mongodb|redis|database/i;
    const frameworkKeywords = /react|next|redux|angular|vue|express|node|tailwind|bootstrap|django|flask/i;
    const toolKeywords = /aws|azure|gcp|docker|kubernetes|git|figma|jira|postman|ci\/cd|linux/i;

    flatSkills.forEach((skill) => {
        if (softKeywords.test(skill)) buckets['Soft Skills'].push(skill);
        else if (dbKeywords.test(skill)) buckets['Databases'].push(skill);
        else if (frameworkKeywords.test(skill)) buckets['Frameworks & Libraries'].push(skill);
        else if (toolKeywords.test(skill)) buckets['Tools & Platforms'].push(skill);
        else buckets['Programming Languages'].push(skill);
    });

    return Object.fromEntries(
        Object.entries(buckets)
            .map(([category, values]) => [category, [...new Set(values)]])
            .filter(([, values]) => values.length)
    );
};

const normalizeCertificates = (certificates) => {
    if (!certificates) return {};

    if (Array.isArray(certificates)) {
        const entries = certificates
            .map((item) => {
                if (typeof item === 'string') return { subheading: item.trim(), description: '' };
                return {
                    subheading: toStringSafe(item?.subheading || item?.title || item?.name),
                    description: toStringSafe(item?.description || item?.details || item?.issuer)
                };
            })
            .filter((entry) => entry.subheading);

        return entries.length ? { Certifications: entries } : {};
    }

    if (typeof certificates === 'object') {
        const grouped = Object.entries(certificates).reduce((acc, [heading, items]) => {
            const cleanHeading = toStringSafe(heading);
            const normalizedItems = splitToItems(items).map((item) => ({ subheading: item, description: '' }));

            if (Array.isArray(items)) {
                const structured = items
                    .map((item) => {
                        if (typeof item === 'string') return { subheading: item.trim(), description: '' };
                        return {
                            subheading: toStringSafe(item?.subheading || item?.title || item?.name),
                            description: toStringSafe(item?.description || item?.details || item?.issuer)
                        };
                    })
                    .filter((entry) => entry.subheading);

                if (cleanHeading && structured.length) acc[cleanHeading] = structured;
            } else if (cleanHeading && normalizedItems.length) {
                acc[cleanHeading] = normalizedItems;
            }

            return acc;
        }, {});

        if (Object.keys(grouped).length) return grouped;
    }

    return {};
};

const extractContactInfoFromText = (resumeText = '') => {
    const text = (resumeText || '').toString();
    return {
        email: (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || '',
        phone: (text.match(/(?:\+?\d[\d\s()\-]{7,}\d)/) || [])[0] || '',
        linkedin: (text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[\w\-./?=&%]+/i) || [])[0] || '',
        github: (text.match(/https?:\/\/(?:www\.)?github\.com\/[\w\-./?=&%]+/i) || [])[0] || '',
        website: (text.match(/https?:\/\/(?!.*linkedin|.*github)[\w.-]+\.[a-z]{2,}[\w\-./?=&%]*/i) || [])[0] || ''
    };
};

const normalizeExtractedResumeData = (data = {}, fallbackTitle = 'Imported Resume', resumeText = '') => {
    const personal = data.personal_info || {};
    const inferredContact = extractContactInfoFromText(resumeText);

    const normalizedSkills = normalizeSkillsObject(data.skills);

    const normalizedExperience = Array.isArray(data.experience)
        ? data.experience.map((item) => ({
            company: toStringSafe(item?.company),
            position: toStringSafe(item?.position),
            start_date: normalizeMonthString(item?.start_date),
            end_date: normalizeMonthString(item?.end_date),
            description: toStringSafe(item?.description),
            is_current: Boolean(item?.is_current),
            location: toStringSafe(item?.location)
        })).filter((item) => item.company || item.position || item.description)
        : [];

    const normalizedProjects = Array.isArray(data.project)
        ? data.project.map((item) => ({
            name: toStringSafe(item?.name),
            type: toStringSafe(item?.type),
            description: toStringSafe(item?.description),
            points: splitToItems(item?.points?.length ? item.points : item?.description),
            date: normalizeMonthString(item?.date),
            link: normalizeUrl(item?.link)
        })).filter((item) => item.name || item.description)
        : [];

    const normalizedEducation = Array.isArray(data.education)
        ? data.education.map((item) => ({
            institution: toStringSafe(item?.institution),
            degree: toStringSafe(item?.degree),
            field: toStringSafe(item?.field),
            graduation_date: normalizeMonthString(item?.graduation_date),
            gpa: toStringSafe(item?.gpa),
            location: toStringSafe(item?.location)
        })).filter((item) => item.institution || item.degree || item.field)
        : [];

    const normalizedCertificates = normalizeCertificates(data.certificates || data.certifications);

    const inferredName = cleanHumanName(personal.full_name) || cleanHumanName((resumeText || '').split(/\n|\||,/)[0]);
    const inferredProfession = cleanProfession(personal.profession) || cleanProfession(normalizedExperience?.[0]?.position);

    const safeExperience = normalizedExperience.map((item) => ({
        ...item,
        company: hasSuspiciousFieldContent(item.company) ? '' : item.company,
        position: hasSuspiciousFieldContent(item.position) ? '' : item.position,
        description: item.description.length > 1200 ? `${item.description.slice(0, 1197)}...` : item.description
    }));

    const safeEducation = normalizedEducation.map((item) => ({
        ...item,
        institution: hasSuspiciousFieldContent(item.institution) ? '' : item.institution,
        degree: hasSuspiciousFieldContent(item.degree) ? '' : item.degree,
        field: hasSuspiciousFieldContent(item.field) ? '' : item.field
    }));

    const safeProjects = normalizedProjects.map((item) => ({
        ...item,
        name: hasSuspiciousFieldContent(item.name) ? '' : item.name,
        type: hasSuspiciousFieldContent(item.type) ? '' : item.type,
        description: item.description.length > 1200 ? `${item.description.slice(0, 1197)}...` : item.description,
        points: item.points.slice(0, 8).map((point) => toStringSafe(point).slice(0, 220)).filter(Boolean)
    }));

    return {
        title: toStringSafe(data.title, fallbackTitle),
        professional_summary: sanitizeSummary(data.professional_summary),
        skills: normalizedSkills,
        personal_info: {
            image: toStringSafe(personal.image),
            remove_background: Boolean(personal.remove_background),
            full_name: inferredName,
            profession: inferredProfession,
            email: toStringSafe(personal.email || inferredContact.email),
            phone: toStringSafe(personal.phone || inferredContact.phone),
            location: toStringSafe(personal.location),
            linkedin: normalizeUrl(personal.linkedin || inferredContact.linkedin),
            website: normalizeUrl(personal.website || inferredContact.website),
            github: normalizeUrl(personal.github || inferredContact.github)
        },
        experience: safeExperience,
        project: safeProjects,
        education: safeEducation,
        certificates: normalizedCertificates
    };
};

const fallbackExtractResumeData = (resumeText = '', fallbackTitle = 'Imported Resume') => {
    const text = (resumeText || '').replace(/\r/g, '').trim();
    let lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length <= 2 && text.length > 0) {
        lines = text.split(/[|•·]/).map((line) => line.trim()).filter(Boolean);
    }
    const joined = lines.join('\n');

    const emailMatch = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = joined.match(/(?:\+?\d[\d\s()\-]{7,}\d)/);
    const linkedinMatch = joined.match(/https?:\/\/(?:www\.)?linkedin\.com\/[\w\-./?=&%]+/i);
    const githubMatch = joined.match(/https?:\/\/(?:www\.)?github\.com\/[\w\-./?=&%]+/i);
    const websiteMatch = joined.match(/https?:\/\/(?!.*linkedin|.*github)[\w.-]+\.[a-z]{2,}[\w\-./?=&%]*/i);

    const name = cleanHumanName(lines[0] || '') || '';
    const profession = cleanProfession(lines[1] || '') || '';

    const summarySource = lines.slice(0, 14).join(' ');
    const professionalSummary = summarySource.length > 360 ? `${summarySource.slice(0, 357)}...` : summarySource;

    const skillMatches = [...new Set((joined.match(/\b(react|node(?:\.js)?|express|javascript|typescript|mongodb|mysql|postgresql|python|java|c\+\+|html|css|tailwind|redux|aws|docker|kubernetes|git|rest|graphql|figma|sql)\b/gi) || []).map((s) => s.toLowerCase()))];

    return normalizeExtractedResumeData({
        title: fallbackTitle,
        professional_summary: professionalSummary,
        skills: skillMatches,
        personal_info: {
            full_name: name,
            profession,
            email: emailMatch?.[0] || '',
            phone: phoneMatch?.[0] || '',
            linkedin: linkedinMatch?.[0] || '',
            github: githubMatch?.[0] || '',
            website: websiteMatch?.[0] || ''
        },
        experience: [],
        project: [],
        education: []
    }, fallbackTitle, joined);
};

const requestResumeExtraction = async ({ model, systemPrompt, userPrompt, useStructuredOutput }) => {
    const payload = {
        model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    };

    if (useStructuredOutput) {
        payload.response_format = { type: 'json_object' };
    }

    const response = await withTimeout(ai.chat.completions.create(payload), 18000);
    const rawContent = response?.choices?.[0]?.message?.content;
    const parsed = extractJsonFromText(rawContent);
    if (!parsed) {
        throw new Error('AI extraction returned non-JSON output');
    }
    return parsed;
};

const mergeUniqueStrings = (existing = [], incoming = []) => {
    return [...new Set([...(existing || []), ...(incoming || [])].map((item) => toStringSafe(item)).filter(Boolean))];
};

const mergeSkills = (existing = {}, incoming = {}) => {
    const keys = new Set([...Object.keys(existing || {}), ...Object.keys(incoming || {})]);
    const merged = {};
    keys.forEach((key) => {
        const combined = mergeUniqueStrings(existing?.[key] || [], incoming?.[key] || []);
        if (combined.length) merged[key] = combined;
    });
    return merged;
};

const mergeCertificates = (existing = {}, incoming = {}) => {
    const keys = new Set([...Object.keys(existing || {}), ...Object.keys(incoming || {})]);
    const merged = {};

    keys.forEach((key) => {
        const existingItems = Array.isArray(existing?.[key]) ? existing[key] : [];
        const incomingItems = Array.isArray(incoming?.[key]) ? incoming[key] : [];
        const map = new Map();

        [...existingItems, ...incomingItems].forEach((entry) => {
            const subheading = toStringSafe(entry?.subheading);
            const description = toStringSafe(entry?.description);
            if (!subheading) return;
            const uniqueKey = subheading.toLowerCase();
            if (!map.has(uniqueKey)) {
                map.set(uniqueKey, { subheading, description });
            } else if (!map.get(uniqueKey).description && description) {
                map.set(uniqueKey, { subheading, description });
            }
        });

        const values = [...map.values()];
        if (values.length) merged[key] = values;
    });

    return merged;
};

const mergeResumeDataPreferExisting = (existing, incoming) => {
    const safeExisting = existing || {};
    const safeIncoming = incoming || {};

    return {
        ...safeExisting,
        title: safeExisting.title || safeIncoming.title || 'Imported Resume',
        professional_summary: safeExisting.professional_summary || safeIncoming.professional_summary || '',
        skills: mergeSkills(safeExisting.skills || {}, safeIncoming.skills || {}),
        personal_info: {
            ...safeExisting.personal_info,
            full_name: safeExisting.personal_info?.full_name || safeIncoming.personal_info?.full_name || '',
            profession: safeExisting.personal_info?.profession || safeIncoming.personal_info?.profession || '',
            email: safeExisting.personal_info?.email || safeIncoming.personal_info?.email || '',
            phone: safeExisting.personal_info?.phone || safeIncoming.personal_info?.phone || '',
            location: safeExisting.personal_info?.location || safeIncoming.personal_info?.location || '',
            linkedin: safeExisting.personal_info?.linkedin || safeIncoming.personal_info?.linkedin || '',
            website: safeExisting.personal_info?.website || safeIncoming.personal_info?.website || '',
            github: safeExisting.personal_info?.github || safeIncoming.personal_info?.github || ''
        },
        experience: (safeExisting.experience?.length ? safeExisting.experience : safeIncoming.experience) || [],
        project: (safeExisting.project?.length ? safeExisting.project : safeIncoming.project) || [],
        education: (safeExisting.education?.length ? safeExisting.education : safeIncoming.education) || [],
        certificates: mergeCertificates(safeExisting.certificates || {}, safeIncoming.certificates || {})
    };
};

const getMissingFieldList = (data = {}) => {
    const missing = [];
    const personal = data.personal_info || {};

    if (!personal.full_name) missing.push('personal_info.full_name');
    if (!personal.profession) missing.push('personal_info.profession');
    if (!personal.email) missing.push('personal_info.email');
    if (!personal.phone) missing.push('personal_info.phone');
    if (!data.professional_summary) missing.push('professional_summary');
    if (!Object.keys(data.skills || {}).length) missing.push('skills');
    if (!(data.experience || []).length) missing.push('experience');
    if (!(data.education || []).length) missing.push('education');
    if (!(data.project || []).length) missing.push('project');
    if (!Object.keys(data.certificates || {}).length) missing.push('certificates');

    return missing;
};

const requestMissingFieldCompletion = async ({ model, resumeText, partialData, missingFields }) => {
    const completionPrompt = `You are completing missing fields for a resume builder JSON.

Current extracted JSON:
${JSON.stringify(partialData)}

Missing fields:
${missingFields.join(', ')}

Resume text:
${resumeText.slice(0, 14000)}

Return only valid JSON with the same schema fields, filling missing fields as much as possible from resume text.
Rules:
- Keep already extracted good values intact.
- Do not place long paragraphs into full_name/profession.
- If a value is unavailable, keep it empty.
- Keep dates in YYYY-MM when possible.`;

    try {
        const response = await withTimeout(ai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: 'You complete missing structured resume fields. Return JSON only.' },
                { role: 'user', content: completionPrompt }
            ],
            response_format: { type: 'json_object' }
        }), 18000);

        const parsed = extractJsonFromText(response?.choices?.[0]?.message?.content);
        if (!parsed) throw new Error('Missing-field completion returned invalid JSON');
        return parsed;
    } catch (error) {
        const fallbackResponse = await withTimeout(ai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: 'You complete missing structured resume fields. Return valid JSON only with no extra text.' },
                { role: 'user', content: completionPrompt }
            ]
        }), 18000);

        const parsed = extractJsonFromText(fallbackResponse?.choices?.[0]?.message?.content);
        if (!parsed) throw error;
        return parsed;
    }
};


// Controller for enhancing the resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const userContent = req.body?.userContent?.toString()?.trim();

        if (!userContent) {
            return res.status(400).json({ message: "Professional summary content is required" })
        }

        try {
            const primaryModel = getModelName();
            let enhanceContent;

            try {
                enhanceContent = await requestSummaryEnhancement(userContent, primaryModel);
            } catch (primaryError) {
                const shouldTrySecondaryModel = primaryError?.status === 403 || /403|forbidden/i.test(primaryError?.message || '');
                if (!shouldTrySecondaryModel) {
                    throw primaryError;
                }

                // Secondary model often works when project/key access for the configured model is restricted.
                enhanceContent = await requestSummaryEnhancement(userContent, 'gemini-1.5-flash');
            }

            return res.status(200).json({ message: "Successfully enhanced summary.", enhanceContent });
        } catch (aiError) {
            console.error('enhanceProfessionalSummary AI error:', aiError?.status || aiError?.message);
            const enhanceContent = fallbackEnhanceSummary(userContent);
            return res.status(200).json({
                message: "Enhanced summary generated with fallback.",
                enhanceContent,
                fallback: true
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const position = req.body?.position?.toString()?.trim() || '';
        const company = req.body?.company?.toString()?.trim() || '';
        const location = req.body?.location?.toString()?.trim() || '';
        const rawUserContent = req.body?.userContent?.toString() || '';
        const cleanedUserContent = sanitizeJobDescriptionInput(rawUserContent);

        const composedContent = cleanedUserContent || `Worked as ${position} at ${company}${location ? ` in ${location}` : ''}.`;

        if (!composedContent || !position || !company) {
            return res.status(400).json({ message: "Job description content is required" })
        }

        const contextPrompt = `Role: ${position}\nCompany: ${company}${location ? `\nLocation: ${location}` : ''}\nCurrent Description: ${composedContent}`;

        try {
            const primaryModel = getModelName();
            let enhancedContent;

            try {
                enhancedContent = await requestJobDescriptionEnhancement(contextPrompt, primaryModel);
            } catch (primaryError) {
                const shouldTrySecondaryModel = primaryError?.status === 403 || /403|forbidden/i.test(primaryError?.message || '');
                if (!shouldTrySecondaryModel) {
                    throw primaryError;
                }

                enhancedContent = await requestJobDescriptionEnhancement(contextPrompt, 'gemini-1.5-flash');
            }

            return res.status(200).json({
                message: "Successfully enhanced the job description.",
                enhancedContent: finalizeJobDescriptionOutput(enhancedContent)
            });
        } catch (aiError) {
            console.error('enhanceJobDescription AI error:', aiError?.status || aiError?.message);
            const enhancedContent = finalizeJobDescriptionOutput(fallbackEnhanceJobDescription(composedContent));
            return res.status(200).json({
                message: "Enhanced job description generated with fallback.",
                enhancedContent,
                fallback: true
            });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// Controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;

        const userId = req.userId;
        const sanitizedTitle = toStringSafe(title, 'Imported Resume');
        const cleanedResumeText = (resumeText || '').toString().replace(/\u0000/g, '').trim();

        if (!cleanedResumeText) {
            return res.status(400).json({ message: "Missing required field" })
        }

        // Limit prompt payload size to reduce provider-side 400 errors on very large PDFs.
        const promptResumeText = cleanedResumeText.slice(0, 18000);

        const systemPrompt = "You are an expert AI resume parser. Extract structured data for a resume builder. Preserve factual accuracy and do not invent details. Return valid JSON only.";

                const userPrompt = `Extract data from this resume and return ONLY valid JSON for resume builder pre-fill.

Resume text:
${promptResumeText}

Output schema:
{
    "professional_summary": "",
    "skills": {
        "Programming Languages": [],
        "Frameworks & Libraries": [],
        "Tools & Platforms": [],
        "Databases": [],
        "Soft Skills": []
    },
    "personal_info": {
        "image": "",
        "full_name": "",
        "profession": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": "",
        "github": ""
    },
    "experience": [
        {
            "company": "",
            "position": "",
            "start_date": "YYYY-MM",
            "end_date": "YYYY-MM",
            "description": "",
            "is_current": false,
            "location": ""
        }
    ],
    "project": [
        {
            "name": "",
            "type": "",
            "description": "",
            "points": [],
            "date": "YYYY-MM",
            "link": ""
        }
    ],
    "education": [
        {
            "institution": "",
            "degree": "",
            "field": "",
            "graduation_date": "YYYY-MM",
            "gpa": "",
            "location": ""
        }
    ],
    "certificates": {
        "Certifications": [
            {
                "subheading": "",
                "description": ""
            }
        ]
    }
}

Rules:
- Map each fact to the correct field only.
- Never place full resume paragraphs into personal_info.full_name or any single short field.
- full_name must contain only the candidate name, usually 2-5 words.
- profession must be a short job title, not a summary.
- Extract emails/phones/URLs into their correct fields only.
- Use empty string, empty array, or empty object for missing values.
- Do not hallucinate personal details.
- Keep experience/project descriptions concise and readable.
`;

        let parsedData;
        const primaryModel = getModelName();

        try {
            parsedData = await requestResumeExtraction({
                model: primaryModel,
                systemPrompt,
                userPrompt,
                useStructuredOutput: true
            });
        } catch (structuredError) {
            try {
                // Retry without strict response format for providers/models that reject json_object mode.
                parsedData = await requestResumeExtraction({
                    model: primaryModel,
                    systemPrompt,
                    userPrompt,
                    useStructuredOutput: false
                });
            } catch (unstructuredError) {
                console.error('uploadResume AI extraction error:', unstructuredError?.status || unstructuredError?.message);
                parsedData = fallbackExtractResumeData(promptResumeText, sanitizedTitle);
            }
        }

        let normalizedData = normalizeExtractedResumeData(parsedData, sanitizedTitle, cleanedResumeText);

        const missingFields = getMissingFieldList(normalizedData);
        if (missingFields.length) {
            try {
                const completedRaw = await requestMissingFieldCompletion({
                    model: primaryModel,
                    resumeText: cleanedResumeText,
                    partialData: normalizedData,
                    missingFields
                });

                const completedNormalized = normalizeExtractedResumeData(completedRaw, sanitizedTitle, cleanedResumeText);
                normalizedData = mergeResumeDataPreferExisting(normalizedData, completedNormalized);
            } catch (completionError) {
                console.error('uploadResume completion pass error:', completionError?.status || completionError?.message);
            }
        }

        const newResume = await Resume.create({ userId, ...normalizedData, isDraft: true });

        res.json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(500).json({ message: `Resume Uploading Error ${error.message}` })
    }
}

const ATS_STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'to', 'with',
    'you', 'your', 'will', 'we', 'our', 'this', 'those', 'these', 'their', 'them', 'they', 'has', 'have', 'had', 'not', 'but', 'can',
    'should', 'must', 'into', 'over', 'under', 'about', 'ability', 'required', 'preferred', 'plus', 'etc'
]);

const ATS_SKILL_LIBRARY = [
    'javascript', 'typescript', 'react', 'redux', 'node', 'node.js', 'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'python',
    'java', 'c++', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'rest', 'graphql', 'html', 'css', 'tailwind', 'next.js',
    'vite', 'testing', 'jest', 'cypress', 'playwright', 'ci/cd', 'agile', 'scrum', 'communication', 'leadership', 'problem solving',
    'data analysis', 'machine learning', 'nlp', 'figma', 'product management', 'project management'
];

const normalizeText = (text = '') => text.toLowerCase().replace(/[^a-z0-9+.#/\-\s]/g, ' ').replace(/\s+/g, ' ').trim();

const tokenize = (text = '') => {
    return normalizeText(text)
        .split(' ')
        .map((token) => token.trim())
        .filter((token) => token.length > 2 && !ATS_STOP_WORDS.has(token));
};

const extractTopKeywords = (text = '', limit = 35) => {
    const counts = new Map();
    tokenize(text).forEach((token) => {
        counts.set(token, (counts.get(token) || 0) + 1);
    });

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([keyword]) => keyword)
        .slice(0, limit);
};

const extractSkills = (text = '') => {
    const normalized = normalizeText(text);
    const found = ATS_SKILL_LIBRARY.filter((skill) => normalized.includes(skill.toLowerCase()));
    return [...new Set(found)];
};

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const calculateSectionScore = (resumeText = '') => {
    const sectionPatterns = [
        /professional\s+summary|summary|profile/i,
        /skills|technical\s+skills/i,
        /experience|work\s+history|employment/i,
        /education/i,
        /projects?/i,
        /certifications?|licenses?/i
    ];

    const matchedSections = sectionPatterns.filter((pattern) => pattern.test(resumeText)).length;
    const sectionCoverage = (matchedSections / sectionPatterns.length) * 80;
    const bulletSignal = /(\n\s*[-*]\s+)|(\n\s*\d+\.\s+)/.test(resumeText) ? 10 : 0;
    const readabilitySignal = resumeText.length >= 600 ? 10 : 4;

    return clamp(Math.round(sectionCoverage + bulletSignal + readabilitySignal));
};

const extractYearsRequirement = (jobDescription = '') => {
    const match = jobDescription.match(/(\d+)\+?\s*(?:years|yrs)/i);
    return match ? Number(match[1]) : 0;
};

const extractResumeYears = (resumeText = '') => {
    const matches = [...resumeText.matchAll(/(\d+)\+?\s*(?:years|yrs)/gi)].map((m) => Number(m[1]));
    if (!matches.length) return 0;
    return Math.max(...matches);
};

const createSummary = (overallScore, matchedKeywordCount, missingKeywordCount) => {
    if (overallScore >= 80) {
        return `Strong ATS fit with high alignment across keywords, skills, and core role expectations. ${matchedKeywordCount} critical terms are matched with only ${missingKeywordCount} notable gaps.`;
    }

    if (overallScore >= 60) {
        return `Moderate ATS compatibility. The resume aligns with several important requirements, but targeted keyword and skill updates are needed to improve ranking consistency.`;
    }

    return `Low ATS compatibility for this role. The resume currently misses many role-specific keywords and should be revised for clearer relevance and ATS structure.`;
};

// Controller for ATS compatibility analysis
// POST: /api/ai/analyze-ats
export const analyzeAtsCompatibility = async (req, res) => {
    try {
        const resumeText = req.body?.resumeText?.toString() || '';
        const jobDescription = req.body?.jobDescription?.toString() || '';

        if (!resumeText.trim() || !jobDescription.trim()) {
            return res.status(400).json({ message: 'resumeText and jobDescription are required' });
        }

        const jdKeywords = extractTopKeywords(jobDescription, 40);
        const resumeNormalized = normalizeText(resumeText);

        const matchedKeywords = jdKeywords.filter((keyword) => resumeNormalized.includes(keyword));
        const missingKeywords = jdKeywords.filter((keyword) => !resumeNormalized.includes(keyword));

        const keywordScore = jdKeywords.length
            ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
            : 0;

        const jdSkills = extractSkills(jobDescription);
        const resumeSkills = extractSkills(resumeText);
        const matchedSkills = jdSkills.filter((skill) => resumeSkills.includes(skill));
        const missingSkills = jdSkills.filter((skill) => !resumeSkills.includes(skill));
        const skillsScore = jdSkills.length
            ? Math.round((matchedSkills.length / jdSkills.length) * 100)
            : (resumeSkills.length ? 65 : 0);

        const requiredYears = extractYearsRequirement(jobDescription);
        const resumeYears = extractResumeYears(resumeText);
        const experienceYearsScore = requiredYears > 0
            ? clamp(Math.round((resumeYears / requiredYears) * 100))
            : 70;

        const responsibilitySignals = ['led', 'managed', 'delivered', 'built', 'designed', 'implemented', 'optimized'];
        const responsibilityHits = responsibilitySignals.filter((word) => resumeNormalized.includes(word)).length;
        const responsibilityScore = clamp(Math.round((responsibilityHits / responsibilitySignals.length) * 100));
        const experienceScore = clamp(Math.round((experienceYearsScore * 0.6) + (responsibilityScore * 0.4)));

        const structureScore = calculateSectionScore(resumeText);

        const hasEducation = /education|bachelor|master|b\.?tech|m\.?tech|b\.?sc|m\.?sc|degree/i.test(resumeText);
        const hasCertifications = /certifications?|aws certified|google certified|microsoft certified|pmp|scrum/i.test(resumeText);
        const jdMentionsCerts = /certifications?|certified|pmp|scrum/i.test(jobDescription);

        let educationScore = hasEducation ? 70 : 25;
        if (jdMentionsCerts && hasCertifications) educationScore += 25;
        if (!jdMentionsCerts && hasCertifications) educationScore += 10;
        educationScore = clamp(educationScore);

        const weightedScore = Math.round(
            (keywordScore * 0.4) +
            (skillsScore * 0.25) +
            (experienceScore * 0.2) +
            (structureScore * 0.1) +
            (educationScore * 0.05)
        );

        const mergedMatchedKeywords = [...new Set([...matchedKeywords, ...matchedSkills])].slice(0, 20);
        const mergedMissingKeywords = [...new Set([...missingKeywords, ...missingSkills])].slice(0, 20);

        const strengths = [];
        if (keywordScore >= 70) strengths.push('Good keyword alignment with role-specific terms from the job description.');
        if (skillsScore >= 65) strengths.push('Core technical and domain skills overlap well with job requirements.');
        if (experienceScore >= 65) strengths.push('Experience signals show relevant delivery and impact-oriented responsibilities.');
        if (structureScore >= 70) strengths.push('Resume includes ATS-friendly structure with recognizable sections.');
        if (!strengths.length) strengths.push('Resume has foundational content that can be improved with targeted optimization.');

        const weaknesses = [];
        if (keywordScore < 60) weaknesses.push('Insufficient exact-match keywords for important job description terms.');
        if (skillsScore < 60) weaknesses.push('Missing or underrepresented technical skills requested by the role.');
        if (experienceScore < 60) weaknesses.push('Experience evidence does not fully demonstrate role-relevant impact or required years.');
        if (structureScore < 60) weaknesses.push('Resume structure may reduce ATS parsing quality due to missing standard sections.');
        if (educationScore < 60) weaknesses.push('Education or certifications section does not strongly support the target role.');

        const suggestions = [
            'Add missing keywords naturally into your professional summary, skills, and experience bullets.',
            'Rewrite experience bullets using action verbs plus measurable outcomes (for example: improved X by Y%).',
            'Create a dedicated Skills section that mirrors the priority skills from the job description.',
            'Use clear ATS-standard headings: Summary, Skills, Experience, Education, Projects, Certifications.',
            'If relevant, include certifications or coursework that directly matches role requirements.'
        ];

        const scoreBreakdown = {
            keyword_match: keywordScore,
            skills_match: skillsScore,
            experience_relevance: experienceScore,
            resume_structure_formatting: structureScore,
            education_certifications: educationScore
        };

        const detailedReview = {
            what_is_good: strengths,
            what_is_not_good: weaknesses,
            fresher_guidance: [
                'Start by matching the exact job title and top skills from the job description in your summary.',
                'Use short bullet points in experience/projects: Action + Tool + Result format.',
                'If you are a fresher, emphasize internships, academic projects, hackathons, and certifications.',
                'Avoid generic lines like "hardworking" without proof; add outcome-based statements instead.',
                'Keep section order simple for ATS: Summary, Skills, Experience/Projects, Education, Certifications.'
            ],
            recruiter_view: weightedScore >= 80
                ? 'Recruiters will likely see this resume as highly aligned with the role, with strong ATS discoverability.'
                : weightedScore >= 60
                    ? 'Recruiters may shortlist this resume, but stronger role-specific keywords and impact bullets are needed.'
                    : 'Recruiters may skip this resume because core requirements are not visible enough for ATS and quick human scans.'
        };

        return res.status(200).json({
            ats_score: clamp(weightedScore),
            summary: createSummary(weightedScore, mergedMatchedKeywords.length, mergedMissingKeywords.length),
            matched_keywords: mergedMatchedKeywords,
            missing_keywords: mergedMissingKeywords,
            strengths,
            weaknesses,
            suggestions,
            score_breakdown: scoreBreakdown,
            detailed_review: detailedReview
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};