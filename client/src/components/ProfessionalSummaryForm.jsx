import { Loader2, Sparkles, Wand2, Quote } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api';
import toast from 'react-hot-toast';

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
    const { token } = useSelector(state => state.auth);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateSummary = async () => {
        const summaryText = data?.trim();
        if (!summaryText) return toast.error("Please write a rough draft first");
        try {
            setIsGenerating(true);
            const response = await api.post('/api/ai/enhance-pro-sum', { userContent: summaryText }, {
                headers: { Authorization: token || localStorage.getItem('token') }
            })
            setResumeData(prev => ({ ...prev, professional_summary: response.data.enhanceContent }))
            toast.success("Summary enhanced successfully!");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className='flex flex-col gap-8 h-full font-sans'>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Summary</h2>
                <p className="text-sm font-medium text-slate-500 italic tracking-tight">"Your summary is your handshake with the employer. Make it firm."</p>
            </div>

            {/* AI Assistant Banner */}
            <div className="relative overflow-hidden rounded-xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 group">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-500 opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-accent opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                            <Sparkles className="size-4 animate-pulse" />
                            Intelligence Layer
                        </div>
                        <h3 className="font-black text-2xl leading-tight tracking-tight">Polish with Resumefy AI</h3>
                        <p className="text-sm text-slate-300 max-w-sm font-medium leading-relaxed">
                            We'll transform your basic notes into a high-impact professional narrative.
                        </p>
                    </div>

                    <button
                        onClick={generateSummary}
                        disabled={isGenerating || !data}
                        className='group shrink-0 flex items-center justify-center gap-3 px-8 py-4 bg-primary-accent text-white text-sm font-black rounded-xl hover:shadow-xl hover:shadow-orange-500/30 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all'
                    >
                        {isGenerating ? (
                            <Loader2 className='size-5 animate-spin' />
                        ) : (
                            <Wand2 className='size-5 group-hover:rotate-12 transition-transform' />
                        )}
                        <span>{isGenerating ? "Magically Writing..." : "Enhance with AI"}</span>
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className='flex-1 flex flex-col gap-4 relative'>
                <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Quote className="size-4 text-primary-accent" />
                        Writer's Canvas
                    </label>
                    <span className={`text-[10px] font-black tracking-[0.1em] transition-colors ${data?.length > 400 ? 'text-primary-accent' : 'text-slate-400'}`}>
                        {data?.length || 0} / 500 CHARACTERS
                    </span>
                </div>

                <div className="relative">
                    <textarea
                        value={data || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className='w-full p-6 md:p-8 min-h-[300px] text-base leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-xl focus:ring-8 focus:ring-orange-500/5 focus:border-primary-accent outline-none transition-all resize-none shadow-xl shadow-slate-200/40 placeholder:text-slate-300 font-medium'
                        placeholder='Start typing your story here...'
                    />
                    {/* Corner Accent */}
                    <div className="absolute bottom-6 right-6 pointer-events-none opacity-20">
                        <div className="w-6 h-6 border-b-4 border-r-4 border-slate-200 rounded-br-xl group-focus-within:border-primary-accent transition-colors"></div>
                    </div>
                </div>

                <div className="flex gap-4 bg-orange-50 p-6 rounded-xl border border-orange-100/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-accent mt-1.5 shrink-0 animate-pulse"></div>
                    <p className='text-xs text-slate-700 leading-relaxed font-bold italic'>
                        <span className="font-black text-primary-accent uppercase tracking-widest block mb-1">PRO STRATEGY</span>
                        Mention 3-4 key industry skills and one major quantifiable achievement to stand out.
                    </p>
                </div>
            </div>

            <style jsx>{`
          .text-primary-accent { color: #F95200; }
          .bg-primary-accent { background-color: #F95200; }
          .border-primary-accent { border-color: #F95200; }
          .focus\\:border-primary-accent:focus { border-color: #F95200; }
          .focus\\:ring-orange-500\\/5:focus { --tw-ring-color: rgba(249, 82, 0, 0.05); }
      `}</style>
        </div>
    )
}

export default ProfessionalSummaryForm