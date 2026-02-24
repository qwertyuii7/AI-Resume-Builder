import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, Camera, Sparkles, Github } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const fields = [
        { key: "full_name", label: "Full Name", icon: User, type: "text", required: true, colSpan: "col-span-1 md:col-span-2" },
        { key: "profession", label: "Current Profession / Job Title", icon: BriefcaseBusiness, type: "text", required: true, colSpan: "col-span-1 md:col-span-2" },
        { key: "email", label: "Email Address", icon: Mail, type: "email", required: true, colSpan: "col-span-1 md:col-span-2" },
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel", colSpan: "col-span-1" },
        { key: "location", label: "City, Country", icon: MapPin, type: "text", colSpan: "col-span-1 md:col-span-2" },
        { key: "linkedin", label: "LinkedIn Profile URL", icon: Linkedin, type: "url", colSpan: "col-span-1 md:col-span-2" },
        { key: "github", label: "GitHub Profile URL", icon: Github, type: "url", colSpan: "col-span-1" },
        { key: "website", label: "Portfolio / Website URL", icon: Globe, type: "url", colSpan: "col-span-1" },
    ]

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">

            {/* Header */}
            <div className="bg-slate-50/30 px-6 py-6 border-b border-slate-50">
                <h3 className='text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight'>
                    <div className="p-2 bg-orange-50 rounded-xl text-primary-accent shadow-sm">
                        <User className="w-5 h-5" />
                    </div>
                    Personal Details
                </h3>
                <p className='text-sm text-slate-500 mt-2 font-medium italic'>Your contact information and professional headline.</p>
            </div>

            <div className="p-6 md:p-10 space-y-10">

                {/* --- Image Upload Section --- */}
                <div className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/30">
                    <div className="relative group">
                        <label className="cursor-pointer block relative">
                            <div className={`w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-xl transition-all group-hover:shadow-2xl ${!data.image ? 'bg-slate-200 flex items-center justify-center' : ''}`}>
                                {data.image ? (
                                    <img
                                        src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                                        alt="Profile"
                                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-slate-400" />
                                )}
                            </div>

                            {/* Overlay Icon */}
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera className="w-10 h-10 text-white" />
                            </div>

                            <input type="file" accept='image/jpeg, image/png, image/jpg' className='hidden' onChange={(e) => handleChange("image", e.target.files[0])} />
                        </label>

                        {/* Edit Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-primary-accent text-white p-2 rounded-xl border-4 border-white shadow-lg pointer-events-none group-hover:rotate-12 transition-transform">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-4">
                        <div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">Display Portrait</h4>
                            <p className="text-sm text-slate-500 font-medium">Clear, high-quality JPEG or PNG recommended.</p>
                        </div>

                        {/* AI Clean Up (Visible if image exists) */}
                        {data.image && (
                            <div className="inline-flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className={`p-2 rounded-xl ${data.remove_background ? 'bg-orange-100 text-primary-accent' : 'bg-slate-100 text-slate-400'}`}>
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">AI Clean Up</span>
                                    <span className="text-[10px] text-slate-500 font-bold">Remove image background</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-3">
                                    <input type="checkbox" className="sr-only peer" onChange={() => handleChange("remove_background", !data.remove_background)} checked={data.remove_background || false} />
                                    <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-accent"></div>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Form Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {fields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.key} className={field.colSpan || "col-span-1"}>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                                    {field.label} {field.required && <span className="text-primary-accent font-black">*</span>}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-primary-accent transition-colors duration-300" />
                                    </div>
                                    <input
                                        type={field.type}
                                        value={data[field.key] || ""}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all duration-300 sm:text-sm font-bold shadow-sm"
                                        placeholder={`e.g. ${field.label === "Email Address" ? "john@example.com" : field.label === "Phone Number" ? "+1 234 567 890" : ""}`}
                                        required={field.required}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .focus\\:border-primary-accent:focus { border-color: #F95200; }
                .focus\\:ring-orange-500\\/10:focus { --tw-ring-color: rgba(249, 82, 0, 0.1); }
            `}</style>
        </div>
    )
}

export default PersonalInfoForm