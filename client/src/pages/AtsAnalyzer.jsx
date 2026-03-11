import React, { useMemo, useState } from 'react'
import { ArrowRight, BookOpenCheck, CheckCircle2, ClipboardList, Loader2, Sparkles, XCircle } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const initialJobDescription = '{{JOB_DESCRIPTION}}'

const AtsAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null)
  const [extractedResumeText, setExtractedResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState(initialJobDescription)
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const isDisabled = useMemo(() => {
    return !resumeFile || !jobDescription.trim() || isAnalyzing
  }, [resumeFile, jobDescription, isAnalyzing])

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result || '').toString())
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  const extractResumeTextFromFile = async (file) => {
    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.pdf')) {
      return pdfToText(file)
    }

    if (fileName.endsWith('.txt')) {
      return readTextFile(file)
    }

    throw new Error('Unsupported file type. Please upload a PDF or TXT resume file.')
  }

  const analyzeResume = async (event) => {
    event.preventDefault()

    if (!resumeFile || !jobDescription.trim()) {
      toast.error('Please upload a resume file and add job description')
      return
    }

    setIsAnalyzing(true)
    try {
      const resumeText = await extractResumeTextFromFile(resumeFile)
      if (!resumeText.trim()) {
        throw new Error('Could not extract readable text from the uploaded resume')
      }

      setExtractedResumeText(resumeText)
      const { data } = await api.post('/api/ai/analyze-ats', {
        resumeText,
        jobDescription
      })

      setResult(data)
      toast.success('ATS analysis completed')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to analyze resume')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-primary-accent">
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#FDE3D2] blur-[120px]"></div>
        <div className="absolute bottom-[5%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#D1DCF8] blur-[130px]"></div>
        <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-[#F1DEF0] blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-16 space-y-10">
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-accent flex items-center gap-2">
            <Sparkles className="size-4" />
            AI Insights
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">ATS Resume Analyzer</h1>
          <p className="text-slate-500 text-base md:text-lg max-w-3xl font-medium">
            Compare resume content against a target role and get a compatibility score with actionable improvements.
          </p>
        </div>

        <form onSubmit={analyzeResume} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30 space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resume File</label>
            <label className={`block w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${resumeFile ? 'border-primary-accent bg-orange-50' : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/30'}`}>
              <input
                type="file"
                accept=".pdf,.txt"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setResumeFile(file)
                  setExtractedResumeText('')
                }}
              />
              {resumeFile ? (
                <div className="space-y-2">
                  <p className="font-black text-slate-900">{resumeFile.name}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-accent">Ready for ATS analysis</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-black text-slate-700">Upload resume file</p>
                  <p className="text-xs text-slate-500">Supported formats: PDF, TXT</p>
                </div>
              )}
            </label>
            <p className="text-xs text-slate-500 font-medium">Resume content will be extracted from the uploaded file before analysis.</p>
          </section>

          <section className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30 space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description"
              rows={18}
              className="w-full px-5 py-4 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium leading-relaxed outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent resize-y"
            />
          </section>

          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isDisabled}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-black text-sm hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
            >
              {isAnalyzing ? <Loader2 className="size-5 animate-spin" /> : <ClipboardList className="size-5 text-orange-400" />}
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze ATS Compatibility'}</span>
              {!isAnalyzing && <ArrowRight className="size-4" />}
            </button>
          </div>
        </form>

        {result && (
          <div className="space-y-6">
            {extractedResumeText && (
              <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30">
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Extracted Resume Preview</p>
                <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {`${extractedResumeText.slice(0, 600)}${extractedResumeText.length > 600 ? '...' : ''}`}
                </p>
              </div>
            )}

            <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">ATS Score</p>
                  <h2 className="text-4xl font-black text-slate-900 mt-1">{result.ats_score}/100</h2>
                </div>
                <p className="text-slate-600 font-medium md:max-w-2xl">{result.summary}</p>
              </div>
            </div>

            <ScoreBreakdown scoreBreakdown={result.score_breakdown} />

            <ReviewPanel review={result.detailed_review} strengths={result.strengths} weaknesses={result.weaknesses} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KeywordList title="Matched Keywords" items={result.matched_keywords} tone="success" />
              <KeywordList title="Missing Keywords" items={result.missing_keywords} tone="danger" />
            </div>

            <PointList title="Suggestions" items={result.suggestions} />
          </div>
        )}
      </div>

      <style>{`
        .text-primary-accent { color: #F95200; }
        .focus\\:border-primary-accent:focus { border-color: #F95200; }
      `}</style>
    </div>
  )
}

const KeywordList = ({ title, items = [], tone = 'neutral' }) => {
  const toneClasses = {
    neutral: 'bg-slate-50 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    danger: 'bg-red-50 text-red-700'
  }

  return (
    <section className="bg-white border border-slate-100 rounded-xl p-6 shadow-xl shadow-slate-200/30">
      <h3 className="text-lg font-black text-slate-900 mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2.5">
        {items.length ? items.map((item) => (
          <span key={item} className={`px-3 py-1.5 rounded-full text-xs font-bold ${toneClasses[tone]}`}>
            {item}
          </span>
        )) : <p className="text-slate-400 text-sm">No items found.</p>}
      </div>
    </section>
  )
}

const PointList = ({ title, items = [] }) => {
  return (
    <section className="bg-white border border-slate-100 rounded-xl p-6 shadow-xl shadow-slate-200/30">
      <h3 className="text-lg font-black text-slate-900 mb-4">{title}</h3>
      {items.length ? (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="text-slate-600 text-sm font-medium leading-relaxed">- {item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">No points available.</p>
      )}
    </section>
  )
}

const ScoreBreakdown = ({ scoreBreakdown }) => {
  if (!scoreBreakdown) return null

  const rows = [
    { key: 'keyword_match', label: 'Keyword Match', hint: 'How many important JD terms exist in your resume' },
    { key: 'skills_match', label: 'Skills Match', hint: 'How well your tools/skills align with job requirements' },
    { key: 'experience_relevance', label: 'Experience Relevance', hint: 'How relevant your work/projects are for this role' },
    { key: 'resume_structure_formatting', label: 'Structure & Formatting', hint: 'How ATS-friendly and scannable your section layout is' },
    { key: 'education_certifications', label: 'Education & Certifications', hint: 'How education/certs support the target job' }
  ]

  return (
    <section className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30">
      <h3 className="text-lg font-black text-slate-900 mb-6">Detailed Score Breakdown</h3>
      <div className="space-y-4">
        {rows.map((row) => {
          const score = Number(scoreBreakdown[row.key] || 0)
          return (
            <div key={row.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-800">{row.label}</p>
                <p className="text-sm font-black text-primary-accent">{score}/100</p>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F95200] to-[#FF9B6B] rounded-full" style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 font-medium">{row.hint}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const ReviewPanel = ({ review, strengths = [], weaknesses = [] }) => {
  const goodPoints = review?.what_is_good?.length ? review.what_is_good : strengths
  const notGoodPoints = review?.what_is_not_good?.length ? review.what_is_not_good : weaknesses
  const fresherGuide = review?.fresher_guidance || []

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-xl shadow-slate-200/30 space-y-6">
        <h3 className="text-lg font-black text-slate-900">Proper Resume Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <p className="text-sm font-black text-emerald-800 mb-3 flex items-center gap-2"><CheckCircle2 className="size-4" /> What is good</p>
            <ul className="space-y-2">
              {(goodPoints || []).map((item, index) => (
                <li key={`good-${index}`} className="text-sm text-emerald-800 font-medium leading-relaxed">- {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <p className="text-sm font-black text-red-800 mb-3 flex items-center gap-2"><XCircle className="size-4" /> What is not good</p>
            <ul className="space-y-2">
              {(notGoodPoints || []).map((item, index) => (
                <li key={`not-good-${index}`} className="text-sm text-red-800 font-medium leading-relaxed">- {item}</li>
              ))}
            </ul>
          </div>
        </div>
        {review?.recruiter_view && (
          <div className="bg-slate-900 rounded-xl p-5">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Recruiter View</p>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">{review.recruiter_view}</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xl shadow-slate-200/30">
        <p className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2"><BookOpenCheck className="size-4 text-primary-accent" /> Fresher Guidance</p>
        {fresherGuide.length ? (
          <ul className="space-y-2.5">
            {fresherGuide.map((item, index) => (
              <li key={`fresher-${index}`} className="text-sm text-slate-600 font-medium leading-relaxed">{index + 1}. {item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 font-medium">No additional fresher guidance available.</p>
        )}
      </div>
    </section>
  )
}

export default AtsAnalyzer
