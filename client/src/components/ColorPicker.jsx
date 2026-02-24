import { Check, ChevronDown, Palette } from 'lucide-react';
import React, { useState } from 'react';

const ColorPicker = ({ onChange, selectedColor }) => {
    const [isOpen, setIsOpen] = useState(false);

    const colors = [
        { name: "Brand", value: "#F95200" }, // New Brand Color
        { name: "Indigo", value: "#6366F1" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#4B5563" },
        { name: "Black", value: "#1F2937" },
    ];

    return (
        <div className='relative'>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary-accent hover:ring-8 hover:ring-orange-500/5 transition-all outline-none group'
            >
                <div className="flex items-center gap-2">
                    <div
                        className="size-4 rounded-full border border-slate-200 shadow-sm group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: selectedColor }}
                    />
                    <span className='text-xs font-black text-slate-700 max-sm:hidden uppercase tracking-wider'>Accent Color</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

                    <div className='absolute top-full left-0 mt-3 p-5 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300'>
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
                            <Palette size={14} className="text-primary-accent" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Signature Palette</span>
                        </div>

                        <div className='grid grid-cols-5 gap-3'>
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => { onChange(color.value); setIsOpen(false); }}
                                    className='group relative flex flex-col items-center focus:outline-none'
                                    title={color.name}
                                >
                                    <div
                                        className={`size-full aspect-square rounded-full shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg flex items-center justify-center ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary-accent scale-110' : 'ring-1 ring-slate-100'}`}
                                        style={{ backgroundColor: color.value }}
                                    >
                                        {selectedColor === color.value && (
                                            <Check className='size-4 text-white drop-shadow-md' strokeWidth={4} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
                .text-primary-accent { color: #F95200; }
                .hover\\:border-primary-accent:hover { border-color: #F95200; }
                .ring-primary-accent { --tw-ring-color: #F95200; }
            `}</style>
        </div>
    )
}

export default ColorPicker