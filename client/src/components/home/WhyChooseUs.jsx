import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Heart, Target, Clock, Award } from 'lucide-react';

const WhyChooseUs = () => {
    const benefits = [
        {
            icon: ShieldCheck,
            title: 'ATS-Friendly',
            description: 'Our templates are specifically designed to pass through Applicant Tracking Systems effortlessly.'
        },
        {
            icon: Zap,
            title: 'AI-Powered',
            description: 'Advanced AI helps you write professional summaries and bullet points that catch eyes.'
        },
        {
            icon: Heart,
            title: 'User-Centric',
            description: 'Simple and intuitive design makes resume building a stress-free experience for everyone.'
        },
        {
            icon: Target,
            title: 'Tailored Results',
            description: 'Customize every detail to match exactly what employers in your industry are looking for.'
        },
        {
            icon: Clock,
            title: 'Save Time',
            description: 'What used to take hours now takes minutes. Build multiple versions for different roles in no time.'
        },
        {
            icon: Award,
            title: 'Professional Look',
            description: 'Stand out from the crowd with modern, clean, and professional designs that command respect.'
        }
    ];

    return (
        <section id="why-choose-us" className="py-32 bg-slate-50 relative overflow-hidden scroll-mt-24">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[120px] -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight"
                        >
                            Why Choose <br />
                            <span className="text-primary-accent italic">Our Platform?</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-500 mb-12 leading-relaxed"
                        >
                            We combine cutting-edge AI technology with expert design principles to give you the ultimate edge in your job search.
                        </motion.p>

                        <div className="flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 p-6 bg-white rounded-[32px] shadow-xl shadow-slate-200/50"
                            >
                                <div className="size-12 rounded-2xl bg-orange-50 flex items-center justify-center text-primary-accent">
                                    <Award size={24} />
                                </div>
                                <span className="font-black text-slate-800">100% Industry Ready Layouts</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-4 p-6 bg-white rounded-[32px] shadow-xl shadow-slate-200/50"
                            >
                                <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Zap size={24} />
                                </div>
                                <span className="font-black text-slate-800">Real-time AI Content Suggestions</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 bg-white rounded-[40px] shadow-xl shadow-slate-200/40 border-2 border-transparent hover:border-orange-100 transition-all duration-500 group"
                            >
                                <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary-accent group-hover:text-white transition-all duration-500">
                                    <benefit.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
