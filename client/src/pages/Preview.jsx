import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeft } from 'lucide-react';
import api from '../configs/api';

const Preview = () => {

  const { resumeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId)
      setResumeData(data);
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadResume();
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-primary-accent relative overflow-hidden">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#FDE3D2] blur-[120px]"></div>
        <div className="absolute bottom-[5%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#D1DCF8] blur-[130px]"></div>
      </div>

      <div className="relative z-10">
        {resumeData ? (
          <div className='max-w-4xl mx-auto py-12 px-4 flex flex-col items-center'>
            <div className="w-full bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-20 animate-in fade-in zoom-in-95 duration-700">
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-2xl border border-white/50 animate-in slide-in-from-bottom-8 duration-700">
              <p className="text-base font-black text-slate-900 tracking-tight">Viewing public resume</p>
              <div className="h-5 w-px bg-slate-200"></div>
              <a href="/" className="text-primary-accent font-black text-base hover:underline">Build your own &rarr;</a>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center min-h-screen px-6'>
            {isLoading ? <Loader /> : (
              <div className='flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-md'>
                <div className="w-24 h-24 bg-orange-50 rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-orange-100">
                  <span className="text-5xl">🔎</span>
                </div>
                <h1 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4'>Resume not found</h1>
                <p className='text-slate-500 font-medium mb-12 text-lg italic tracking-tight'>"Every end is a new beginning. Let's start yours today."</p>

                <a className='group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-black py-4.5 px-10 rounded-xl transition-all shadow-2xl shadow-slate-900/40 active:scale-95 text-lg' href="/">
                  <ArrowLeft className='size-6 group-hover:-translate-x-1 transition-transform' />
                  <span>Create Your Resume</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
          .text-primary-accent { color: #F95200; }
          .bg-primary-accent { background-color: #F95200; }
          .py-4\\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
      `}</style>
    </div>
  )
}

export default Preview