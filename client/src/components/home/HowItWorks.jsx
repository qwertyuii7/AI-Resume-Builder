import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileEdit, Sparkles, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: UserPlus,
            title: 'Create Account',
            description: 'Sign up in seconds with Google or email OTP to start your journey.',
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: FileEdit,
            title: 'Choose a Template',
            description: 'Pick from our gallery of professional, ATS-friendly resumes.',
            color: 'bg-orange-50 text-orange-600'
        },
        {
            icon: Sparkles,
            title: 'Customize with AI',
            description: 'Let our AI enhance your summary and descriptions for maximum impact.',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            icon: Download,
            title: 'Download & Apply',
            description: 'Export your polished resume as a PDF and land your dream job.',
            color: 'bg-green-50 text-green-600'
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                    >
                        Getting Started is <span className="text-primary-accent italic">Easy</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto"
                    >
                        Four simple steps to transform your career with professional AI-powered tools.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-slate-100 -z-0"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className={`size-20 ${step.color} rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-slate-100 transition-transform hover:scale-110 duration-500`}>
                                <step.icon size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>

                            {/* Step Number */}
                            <span className="absolute -top-4 -right-4 text-8xl font-black text-slate-50/80 -z-10">{index + 1}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
