import React from 'react'
import { Zap, Activity, ShieldCheck, FileBarChart } from 'lucide-react'
import Title from './Title';
import { motion } from 'framer-motion';

const Features = () => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);

    const features = [
        {
            title: "AI Analysis",
            desc: "Get instant insights into your resume with AI that identifies gaps and suggests improvements.",
            icon: <Activity size={24} />,
            color: "indigo",
            bgColor: "#E0E7FF",
            accent: "#4F46E5"
        },
        {
            title: "ATS Optimized",
            desc: "Every resume is built to pass Applicant Tracking Systems with ease using standard formatting.",
            icon: <ShieldCheck size={24} />,
            color: "mint",
            bgColor: "#DBFCE7",
            accent: "#10B981"
        },
        {
            title: "Easy Export",
            desc: "Export your resume in professional PDF format, ready to be sent to recruiters.",
            icon: <FileBarChart size={24} />,
            color: "peach",
            bgColor: "#FFEDD4",
            accent: "#F59E0B"
        }
    ];

    return (
        <div id='features' className='relative py-28 px-6 max-w-7xl mx-auto scroll-mt-24 bg-white'>
            <div className="flex flex-col items-center text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lime text-slate-700 text-sm font-bold mb-6"
                >
                    <Zap size={16} className="fill-current" />
                    <span>Smart Features</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="max-w-3xl"
                >
                    <Title title='Everything you need to excel' description='Our intelligent platform provides all the tools required to build, optimize, and manage your professional career documents.' />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group lg:pr-12"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#DBFCE7] to-[#E0E7FF] rounded-xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                    <img
                        className="relative rounded-xl shadow-2xl border border-slate-100 w-full object-cover"
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
                        alt="Platform Interface"
                    />
                </motion.div>

                {/* List Side */}
                <div className="flex flex-col gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`p-8 rounded-xl border transition-all duration-300 cursor-pointer ${hoveredIndex === index ? 'bg-white border-slate-200 shadow-xl shadow-slate-100 scale-[1.02]' : 'bg-transparent border-transparent hover:bg-brand-gray'}`}
                        >
                            <div className="flex gap-6 items-start">
                                <div style={{ backgroundColor: feature.bgColor }} className="p-4 rounded-xl text-slate-700">
                                    {feature.icon}
                                </div>
                                <div className='flex-1'>
                                    <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-base">{feature.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                .bg-brand-lime { background-color: #ECFCCA; }
                .bg-brand-gray { background-color: #F9FAFB; }
            `}</style>
        </div>
    );
}

export default Features
