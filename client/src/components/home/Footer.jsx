import { Dribbble, Github, Linkedin, Mail, Send, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer = () => {
    return (
        <footer className="relative bg-[#F9FAFB] pt-28 pb-12 overflow-hidden border-t border-slate-100">

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">


                {/* Main Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2 lg:col-span-2 space-y-8">
                        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                            <Logo />
                        </Link>
                        <p className="text-slate-500 text-base leading-relaxed max-w-xs font-medium">
                            The intelligent platform for building professional, ATS-friendly resumes that help you land your dream job faster.
                        </p>
                        <div className="flex gap-5">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Dribbble, href: "#" },
                                { icon: Github, href: "#" }
                            ].map((Social, index) => (
                                <a
                                    key={index}
                                    href={Social.href}
                                    className="size-11 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-white hover:bg-slate-900 transition-all duration-300 shadow-sm"
                                >
                                    <Social.icon className="size-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-slate-900 text-lg">Product</h4>
                        <ul className="space-y-5 text-base text-slate-500 font-medium">
                            <li><a href="/#features" className="hover:text-primary-accent transition-colors">Features</a></li>
                            <li><Link to="/templates" className="hover:text-primary-accent transition-colors">Templates</Link></li>
                            <li><Link to="/app" className="hover:text-primary-accent transition-colors">AI Writer</Link></li>
                            <li><Link to="/app" className="hover:text-primary-accent transition-colors">ATS Check</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-slate-900 text-lg">Resources</h4>
                        <ul className="space-y-5 text-base text-slate-500 font-medium">
                            {['Blog', 'Career Advice', 'Help Center'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-primary-accent transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-bold text-slate-900 text-lg">Legal</h4>
                        <ul className="space-y-5 text-base text-slate-500 font-medium">
                            <li><Link to="/privacy" className="hover:text-primary-accent transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-primary-accent transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400 font-medium">
                    <p>© 2026 AI Resume Builder. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>System Status</span>
                        </div>
                        <a href="mailto:support@resumebuilder.ai" className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                            <Mail className="size-4" /> Support
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .hover\\:text-primary-accent:hover { color: #F95200; }
                .hover\\:shadow-orange-500\\/20:hover { --tw-shadow-color: rgba(249, 82, 0, 0.2); }
            `}</style>
        </footer>
    );
}

export default Footer;