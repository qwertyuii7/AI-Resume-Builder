import React from 'react';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 group transition-all duration-300 ${className}`}>
            <div className="flex items-center justify-center p-2 bg-primary-accent rounded-xl shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
                Resume<span className="text-primary-accent">fy</span>
            </span>

            <style jsx>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
            `}</style>
        </div>
    );
};

export default Logo;
