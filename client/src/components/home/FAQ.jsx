import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const faqs = [
        {
            question: 'How do I create a resume using this builder?',
            answer: 'Simply sign up or log in to your account, select a template that suits your style, fill in your information step by step, and customize the design to your preference. You can preview in real-time and download whenever ready.'
        },
        {
            question: 'Can I use multiple resume templates?',
            answer: 'Yes! You can create multiple resumes with different templates. This is perfect for tailoring your resume to different job applications. Each resume can be customized independently.'
        },
        {
            question: 'What file formats can I download my resume in?',
            answer: 'You can download your resume as a PDF file. PDF format ensures your resume looks exactly the same on any device or when printed. Additional formats may be added in future updates.'
        },
        {
            question: 'Is my information secure and private?',
            answer: 'Absolutely! We take your privacy seriously. Your data is encrypted and stored securely on our servers. You have full control over your information and can delete it anytime.'
        },
        {
            question: 'Can I edit my resume later after downloading?',
            answer: 'Yes! Your resume is always saved in your account. You can log in anytime to make edits, update information, change templates, or create new versions.'
        },
        {
            question: 'What if I need help or have questions?',
            answer: 'We have a help center with tutorials and guides. For additional support, you can use our contact form or reach out to our support team. We typically respond within 24 hours.'
        }
    ];

    return (
        <section id="faq" className="py-20 bg-white scroll-mt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Find answers to common questions about our resume builder
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-100 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-slate-900 flex-1">
                                    {faq.question}
                                </h3>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 text-primary-accent"
                                >
                                    <ChevronDown className="size-6" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden bg-white"
                                    >
                                        <p className="px-6 py-4 text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center p-8 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200"
                >
                    <p className="text-slate-700 mb-4">
                        Didn't find the answer you're looking for?
                    </p>
                    <a
                        href="/#contact"
                        className="inline-block px-6 py-3 bg-primary-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                    >
                        Contact Our Support Team
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
