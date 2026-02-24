import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">Privacy Policy</h1>
                    <p className="text-slate-500 mb-12 font-medium">Last updated: February 20, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-700 font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, such as when you create an account, build a resume, or contact us for support. This may include your name, email address, and any professional information you include in your resumes.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                            <p>We use the information we collect to provide, maintain, and improve our services, including to process your resumes and personalize your experience.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing of Information</h2>
                            <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
