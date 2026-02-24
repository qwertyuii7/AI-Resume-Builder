import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ShieldCheck, Zap, ArrowRight, Loader } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { login } from '../app/features/authSlice';

const Subscription = () => {
    const { user, token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const resScript = await loadRazorpayScript();

            if (!resScript) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            // 1. Create Order on Backend
            const { data: orderData } = await api.post('/api/payments/create-order', {
                amount: 299
            }, {
                headers: { Authorization: token }
            });

            if (!orderData.success) {
                toast.error("Failed to create order");
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Resumefy",
                description: "Pro Plan Subscription",
                order_id: orderData.order.id,
                handler: async (response) => {
                    // 3. Verify Payment on Backend
                    try {
                        const { data: verifyData } = await api.post('/api/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: { Authorization: token }
                        });

                        if (verifyData.success) {
                            toast.success("Subscription activated successfully!");
                            // Refresh User Data
                            const { data: userData } = await api.get('/api/users/data', {
                                headers: { Authorization: token }
                            });
                            dispatch(login({ token, user: userData.user }));
                            navigate('/app');
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err) {
                        toast.error("Something went wrong during verification");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email
                },
                theme: {
                    color: "#F95200"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            toast.error("Payment initiation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/30 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full"></div>

            <div className="max-w-4xl w-full bg-white rounded-[40px] shadow-2xl border border-white/50 p-8 lg:p-16 relative z-10 flex flex-col lg:flex-row gap-12 items-center">

                {/* Information Side */}
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-primary-accent rounded-full border border-orange-100 animate-bounce">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-widest">Limited Offer</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            Unlock Unlimited <br />
                            <span className="text-primary-accent">Resume Potential</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Upgrade to our Pro Plan today and create high-impact, professional resumes that get you hired.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Create up to 10 Premium Resumes",
                            "Access all Advanced Templates",
                            "AI-Powered Content Optimization",
                            "Priority Customer Support",
                            "One-time Payment - Lifetime Access"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="size-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Check size={14} />
                                </div>
                                <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <ShieldCheck className="text-blue-500 size-6" />
                        <span className="text-sm font-bold text-slate-600">Secure 256-bit SSL encrypted payments</span>
                    </div>
                </div>

                {/* Pricing Card Side */}
                <div className="w-full lg:w-[380px] bg-slate-900 rounded-[32px] p-8 text-white relative shadow-2xl shadow-slate-900/40 lg:scale-110">
                    <div className="absolute -top-4 -right-4 size-24 bg-primary-accent rounded-full flex flex-col items-center justify-center rotate-12 border-4 border-white shadow-xl">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Save</span>
                        <span className="text-lg font-black leading-none">60%</span>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black tracking-tight text-white/50 uppercase">Pro Plan</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">₹299</span>
                                <span className="text-white/40 font-bold line-through text-lg">₹799</span>
                            </div>
                            <p className="text-white/60 font-medium text-sm">One plan, everything you need.</p>
                        </div>

                        <div className="h-px bg-white/10"></div>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-primary-accent"></div>
                                <span className="text-sm font-bold">10 Resume Generations</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-primary-accent"></div>
                                <span className="text-sm font-bold">Lifetime Validity</span>
                            </li>
                        </ul>

                        <button
                            disabled={loading}
                            onClick={handlePayment}
                            className="w-full py-5 bg-primary-accent hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            {loading ? <Loader className="animate-spin" /> : (
                                <>
                                    <span>Upgrade Now</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Transaction secured by Razorpay</p>
                    </div>
                </div>

            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-12 text-slate-400 hover:text-slate-600 font-bold text-sm underline underline-offset-4 decoration-slate-200 transition-colors"
            >
                Continue with Free version
            </button>

            <style>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
            `}</style>
        </div>
    );
};

export default Subscription;
