import { Check, ChevronDown, LayoutTemplate } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

    const updatePanelPosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const panelWidth = 320;
        const panelVerticalPadding = 24;
        const estimatedPanelHeight = Math.min(window.innerHeight - 96, 620);
        const viewportPadding = 12;
        const preferredTop = rect.bottom + 12;
        const maxTop = window.innerHeight - estimatedPanelHeight - panelVerticalPadding;
        const top = Math.max(panelVerticalPadding, Math.min(preferredTop, maxTop));
        const maxLeft = window.innerWidth - panelWidth - viewportPadding;
        const left = Math.max(viewportPadding, Math.min(rect.left, maxLeft));

        setPanelPosition({ top, left });
    };

    useEffect(() => {
        if (!isOpen) return;

        updatePanelPosition();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', updatePanelPosition);
        window.addEventListener('scroll', updatePanelPosition, true);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('resize', updatePanelPosition);
            window.removeEventListener('scroll', updatePanelPosition, true);
        };
    }, [isOpen]);

    const templates = [
        { id: "professional-academic", name: "Professional", type: "Academic" },
        { id: "technical-detailed", name: "Detailed", type: "Technical" },
        { id: "jakes-style", name: "Jake's", type: "ATS Optimized" },
        { id: "patrick-style", name: "Executive", type: "Two-Column" },
        { id: "sukumar-style", name: "Sukumar", type: "Professional" },
        { id: "modern-icons", name: "Modern Icons", type: "Modern" },
        { id: "jane-style", name: "Jane", type: "Corporate" },
        { id: "danette-style", name: "Danette", type: "Technical" },
        { id: "sebastian-style", name: "Sebastian", type: "Bold" },
        { id: "alexander-style", name: "Alexander", type: "Clean" },
        { id: "isabelle-style", name: "Isabelle", type: "Executive" },
        { id: "two-column-purple", name: "Two Column", type: "Modern" },
        { id: "modern-teal", name: "Modern Teal", type: "Clean" },
        { id: "serif-classic", name: "Serif Classic", type: "Classic" },
        { id: "clean-blue", name: "Clean Blue", type: "Professional" },
        { id: "detailed-professional", name: "Detailed Pro", type: "Technical" },
        { id: "classic", name: "Classic", type: "Standard" },
        { id: "modern", name: "Modern", type: "Sidebar" },
        { id: "minimal-image", name: "Profile", type: "Creative" },
        { id: "minimal", name: "Minimal", type: "Clean" },
    ];

    // Helper to render a mini CSS representation of the resume layout
    const renderMiniPreview = (id) => {
        switch (id) {
            case 'modern': // Sidebar Layout
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded flex overflow-hidden">
                        <div className="w-1/3 bg-slate-200 h-full"></div>
                        <div className="w-2/3 p-1 space-y-1">
                            <div className="w-1/2 h-1 bg-slate-300 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'minimal-image': // Top Image Layout
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col gap-1 overflow-hidden">
                        <div className="flex gap-1 items-center">
                            <div className="size-4 rounded-full bg-slate-300 shrink-0"></div>
                            <div className="w-full h-1 bg-slate-300 rounded"></div>
                        </div>
                        <div className="space-y-1 mt-1">
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'minimal': // Text Only Layout
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1.5 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-1 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'professional-academic':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-1.5 bg-slate-300 rounded mb-0.5"></div>
                        <div className="w-full h-px bg-slate-400 mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'technical-detailed':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col gap-1 overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div className="w-1/3 h-1.5 bg-slate-300 rounded"></div>
                            <div className="w-1/4 h-1 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-full h-px bg-slate-300 my-0.5"></div>
                        <div className="space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'jakes-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/3 h-2 bg-slate-300 rounded mb-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded px-2"></div>
                        <div className="w-full h-px bg-slate-400 my-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'patrick-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded flex overflow-hidden">
                        <div className="w-2/3 p-1 space-y-1">
                            <div className="w-3/4 h-1.5 bg-slate-300 rounded"></div>
                            <div className="w-full h-px bg-slate-200 my-1"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-1/3 bg-orange-50/50 border-l border-orange-100 p-1 space-y-1">
                            <div className="w-full h-3 bg-orange-100 rounded"></div>
                            <div className="w-1/2 h-0.5 bg-orange-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'sukumar-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col gap-1 overflow-hidden">
                        <div className="w-2/3 h-1.5 bg-slate-300 rounded self-center mb-1"></div>
                        <div className="w-full h-px bg-slate-300 mb-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-px bg-slate-300 mt-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'modern-icons':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-2 bg-slate-300 rounded mb-0.5"></div>
                        <div className="flex gap-1 mb-1">
                            <div className="size-1.5 rounded-full bg-slate-200"></div>
                            <div className="size-1.5 rounded-full bg-slate-200"></div>
                            <div className="size-1.5 rounded-full bg-slate-200"></div>
                        </div>
                        <div className="w-full h-px bg-slate-200"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'jane-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-stretch gap-1 overflow-hidden">
                        <div className="w-2/3 h-2 bg-slate-300 rounded self-center mb-0.5"></div>
                        <div className="w-full h-px bg-slate-400 mb-0.5"></div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <div className="w-1/3 h-1 bg-slate-300 rounded"></div>
                                <div className="w-1/4 h-1 bg-slate-200 rounded"></div>
                            </div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'danette-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-1.5 bg-slate-400 rounded mb-0.5"></div>
                        <div className="w-2/3 h-1 bg-blue-200 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded px-2"></div>
                        <div className="w-full h-px bg-slate-300 my-0.5"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'sebastian-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-start gap-1 overflow-hidden">
                        <div className="w-3/4 h-2 bg-slate-400 rounded mb-0.5"></div>
                        <div className="w-1/2 h-1.5 bg-blue-200 rounded mb-1"></div>
                        <div className="w-full h-px bg-slate-900 border-b border-white"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'alexander-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-2.5 bg-slate-300 rounded mb-0.5"></div>
                        <div className="w-full h-px bg-slate-200 my-0.5"></div>
                        <div className="w-full h-px bg-slate-200"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded mt-1"></div>
                    </div>
                );
            case 'isabelle-style':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-start gap-1 overflow-hidden">
                        <div className="w-full h-3 bg-slate-100 rounded-t border-b border-slate-200 p-1">
                            <div className="w-1/2 h-1 bg-slate-300 rounded"></div>
                        </div>
                        <div className="flex gap-2 w-full px-1">
                            <div className="w-1/2 h-2 bg-slate-200 rounded"></div>
                            <div className="w-1/2 h-2 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-full h-0.5 bg-slate-200 rounded px-1"></div>
                    </div>
                );
            case 'two-column-purple':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded flex overflow-hidden">
                        <div className="flex-1 p-1 space-y-1">
                            <div className="w-3/4 h-2 bg-slate-300 rounded mb-1"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-1/3 bg-purple-50 border-l border-purple-100 p-1 space-y-1">
                            <div className="w-full h-2 bg-purple-100 rounded"></div>
                            <div className="w-full h-0.5 bg-purple-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'modern-teal':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col gap-1 overflow-hidden">
                        <div className="w-1/2 h-2 bg-teal-100 rounded"></div>
                        <div className="w-full h-px bg-teal-200"></div>
                        <div className="space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'serif-classic':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-2/3 h-2 bg-slate-300 rounded mb-1"></div>
                        <div className="w-full h-px bg-slate-800"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-px bg-slate-300"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'clean-blue':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col items-center gap-1 overflow-hidden">
                        <div className="w-1/2 h-2.5 bg-blue-100 rounded mb-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded px-2"></div>
                        <div className="w-full h-1 bg-blue-200 rounded mt-1"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            case 'detailed-professional':
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 flex flex-col gap-1 overflow-hidden">
                        <div className="flex justify-between">
                            <div className="w-1/4 h-1 bg-slate-200 rounded"></div>
                            <div className="w-1/3 h-2 bg-slate-300 rounded"></div>
                            <div className="w-1/4 h-1 bg-slate-200 rounded"></div>
                        </div>
                        <div className="w-full h-px bg-slate-400"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                    </div>
                );
            default: // Classic Layout
                return (
                    <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded p-1 overflow-hidden">
                        <div className="w-full h-2 bg-slate-300 border-b border-slate-400 mb-1"></div>
                        <div className="w-1/3 h-1 bg-slate-200 rounded mb-1"></div>
                        <div className="space-y-0.5">
                            <div className="w-full h-0.5 bg-slate-200 rounded"></div>
                            <div className="w-3/4 h-0.5 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className='relative w-full'>
            {/* Desktop View (Trigger + Panel) */}
            <div className="hidden md:block">
                <button
                    ref={triggerRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className='flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary-accent hover:ring-8 hover:ring-orange-500/5 transition-all outline-none group'
                >
                    <LayoutTemplate size={16} className="text-slate-600 group-hover:text-primary-accent transition-colors" />
                    <span className='text-xs font-black text-slate-700 uppercase tracking-wider'>Select Layout</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[999] hidden md:block" onClick={() => setIsOpen(false)}></div>
                        <div
                            data-lenis-prevent
                            className='fixed bottom-0 left-0 right-0 md:bottom-auto md:left-auto w-full md:w-96 h-auto md:max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain bg-white border md:border border-slate-100 rounded-[1.5rem] shadow-2xl z-[1000] p-4 animate-in fade-in zoom-in-95 duration-300'
                            style={{
                                top: `${panelPosition.top}px`,
                                left: `${panelPosition.left}px`
                            }}
                            onWheelCapture={(event) => event.stopPropagation()}
                            onTouchMoveCapture={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-2 py-3 mb-3 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <LayoutTemplate size={14} className="text-primary-accent" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Curated Frameworks</span>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                {templates.map((template) => {
                                    const isActive = selectedTemplate === template.id;
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => { onChange(template.id); setIsOpen(false); }}
                                            className={`relative p-3 rounded-[1.25rem] cursor-pointer border-2 transition-all duration-300 group ${isActive ? 'bg-orange-50 border-primary-accent shadow-lg shadow-orange-500/10' : 'bg-white border-slate-100 hover:border-orange-200 hover:bg-slate-50/50'}`}
                                        >
                                            <div className={`mb-3 transition-transform duration-500 ${isActive ? 'scale-105' : 'group-hover:scale-105 opacity-70 group-hover:opacity-100'}`}>
                                                {renderMiniPreview(template.id)}
                                            </div>
                                            <div className="flex items-center justify-between gap-2 px-1">
                                                <div className="overflow-hidden">
                                                    <h4 className={`text-[11px] font-black truncate tracking-tight ${isActive ? 'text-primary-accent' : 'text-slate-900 group-hover:text-primary-accent'}`}>{template.name}</h4>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{template.type}</p>
                                                </div>
                                                {isActive && (
                                                    <div className='shrink-0 size-4 bg-primary-accent rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-in zoom-in duration-300'>
                                                        <Check className='size-2.5 text-white' strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Mobile View (Horizontal Scrollable Tabs) */}
            <div className="md:hidden w-full">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 scroll-smooth">
                    {templates.map((template) => {
                        const isActive = selectedTemplate === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => onChange(template.id)}
                                className={`flex-shrink-0 flex flex-col items-center gap-2 p-2 rounded-[2rem] border-2 transition-all duration-500 ${isActive ? 'bg-orange-50 border-primary-accent shadow-xl shadow-orange-500/10 scale-105 z-10' : 'bg-white border-slate-100 opacity-60'}`}
                            >
                                <div className="w-16 h-20 bg-slate-50 rounded-[1.25rem] overflow-hidden border border-slate-100 relative group-hover:border-orange-200 transition-colors">
                                    <div className="scale-[0.6] origin-top translate-y-1">
                                        {renderMiniPreview(template.id)}
                                    </div>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary-accent/5 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="size-6 bg-primary-accent rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                                <Check className="size-3.5 text-white" strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest max-w-[70px] truncate ${isActive ? 'text-primary-accent' : 'text-slate-400'}`}>
                                    {template.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
          .text-primary-accent { color: #F95200; }
          .bg-primary-accent { background-color: #F95200; }
          .border-primary-accent { border-color: #F95200; }
          .hover\\:border-primary-accent:hover { border-color: #F95200; }
          .hover\\:ring-orange-500\\/5:hover { --tw-ring-color: rgba(249, 82, 0, 0.05); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    )
}

export default TemplateSelector