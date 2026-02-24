import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';
import Templates from '../components/home/Templates';
import { motion } from 'framer-motion';

const TemplatesPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 md:pt-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center mb-12 md:mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6"
                    >
                        Professional <span className="text-primary-accent italic">Templates</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto"
                    >
                        Explore our collection of meticulously designed resume templates for every industry.
                    </motion.p>
                </div>

                <Templates />
            </main>

            <Footer />
        </div>
    );
};

export default TemplatesPage;
