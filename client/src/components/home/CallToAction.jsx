import React from 'react'
import { motion } from 'framer-motion'

const CallToAction = () => {
    return (
        <div id='cta' className='px-6 mt-28 mb-28'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden bg-slate-900 text-white shadow-2xl shadow-slate-900/40"
            >

                {/* Decorative background glows */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#DBFCE7]/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FDE3D2]/20 rounded-full blur-[100px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-10 px-10 md:px-20 py-20 sm:py-24">
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                            Build a professional resume <br />
                            <span className="text-primary-accent">that actually gets you hired.</span>
                        </h2>
                        <p className="text-slate-400 text-xl font-medium">Join thousands of professionals who have advanced their careers with our AI tools.</p>
                    </div>

                    <a href="/app" className="group flex items-center gap-3 rounded-xl py-5 px-10 bg-primary-accent text-white font-bold text-xl transition-all shadow-xl hover:shadow-orange-500/30 active:scale-95">
                        <span>Get Started for Free</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </a>
                </div>
            </motion.div>

            <style>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .shadow-orange-500\\/30 { --tw-shadow-color: rgba(249, 82, 0, 0.3); }
            `}</style>
        </div>
    )
}

export default CallToAction