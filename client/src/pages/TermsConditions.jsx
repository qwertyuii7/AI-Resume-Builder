import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';
import { motion } from 'framer-motion';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">Terms & Conditions</h1>
                    <p className="text-slate-500 mb-12 font-medium">Last updated: February 20, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-8 text-slate-700 font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using our services, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Services</h2>
                            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Intellectual Property</h2>
                            <p>The service and its original content, features, and functionality are and will remain the exclusive property of AI Resume Builder and its licensors.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
                            <p>In no event shall AI Resume Builder be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
                        </section>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsConditions;
