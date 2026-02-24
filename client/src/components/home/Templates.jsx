import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ClipboardList, Layout, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../configs/api';
import toast from 'react-hot-toast';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loadTemplates = async () => {
        try {
            const { data } = await api.get('/api/admin/templates');
            setTemplates(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    return (
        <section id="templates" className="py-28 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-primary-accent text-sm font-bold mb-6"
                    >
                        <Layout size={16} />
                        <span>Premium Templates</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
                    >
                        Designed for <span className="text-primary-accent">Success</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Choose from a variety of expert-crafted templates. Click on any template to start building your professional resume.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!isLoading && templates.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                            <p className="text-slate-500 font-medium">No templates available right now.</p>
                        </div>
                    )}

                    {isLoading && Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="aspect-[4/5] bg-white rounded-3xl border border-slate-100 animate-pulse" />
                    ))}

                    {!isLoading && templates.map((template, index) => (
                        <motion.div
                            key={template._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                                const link = template.link;
                                if (link.startsWith('http')) {
                                    try {
                                        const url = new URL(link);
                                        if (url.origin === window.location.origin) {
                                            navigate(url.pathname + url.search);
                                        } else {
                                            window.location.href = link;
                                        }
                                    } catch (e) {
                                        window.open(link, '_blank');
                                    }
                                } else {
                                    navigate(link);
                                }
                            }}
                            className='group relative bg-white rounded-[32px] border-2 transition-all duration-500 overflow-hidden border-white hover:border-orange-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 cursor-pointer'
                        >
                            <div className="aspect-[4/5.5] relative overflow-hidden">
                                <img
                                    src={template.image}
                                    alt="Resume Template"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <h4 className="text-white font-black text-2xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Professional Layout</h4>
                                    <p className="text-white/80 text-sm font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">ATS-friendly & modern design</p>
                                    <div className="flex items-center gap-2 text-primary-accent font-black text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                        <span>Use this template</span>
                                        <Zap size={16} className="fill-current" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 p-1 pl-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <span className="text-xs font-bold text-slate-500 italic">Want something completely unique?</span>
                        <button className="px-6 py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-orange-50 hover:text-primary-accent transition-all text-sm">
                            Custom Solutions
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .border-primary-accent { border-color: #F95200; }
            `}</style>
        </section>
    );
};

export default Templates;
