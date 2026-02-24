import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../configs/api';
import Navbar from '../components/Navbar';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/contact/send', formData);
            if (response.data.success) {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white overflow-x-hidden min-h-screen">
            <Navbar />

            {/* Hero Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-40">
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#FDE3D2] blur-[120px]"></div>
                <div className="absolute top-[5%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#F1DEF0] blur-[130px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 pt-32 pb-20">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 scroll-mt-24"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="space-y-10"
                    >
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: Mail, label: 'Email', value: 'support@resumebuilder.com' },
                                    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                                    { icon: MapPin, label: 'Location', value: '123 Tech Street, San Francisco, CA 94105' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="p-3 bg-orange-50 rounded-xl text-primary-accent">
                                            <item.icon className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.label}</h3>
                                            <p className="text-slate-500">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-600">
                                <span className="font-bold text-slate-900">Response Time:</span> We typically respond within 24 hours during business days.
                            </p>
                        </div>

                        {/* FAQ Link */}
                        <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                            <p className="text-sm text-slate-600">
                                Check out our <a href="/#faq" className="font-bold text-primary-accent hover:underline">FAQ section</a> for quick answers to common questions.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100">

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-primary-accent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-primary-accent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-primary-accent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what's on your mind..."
                                    rows="6"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-primary-accent outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-primary-accent text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Sending...' : (
                                    <>
                                        <Send className="size-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
