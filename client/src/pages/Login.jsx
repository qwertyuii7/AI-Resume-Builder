import { Lock, Mail, User2Icon, ArrowRight, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
    const query = new URLSearchParams(window.location.search)
    const redirectPath = query.get('redirect') || '/app'
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [view, setView] = React.useState("identify") // identify, verify
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('')
    const [otp, setOtp] = React.useState('')

    // Handle sending OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/api/users/send-otp', { email });
            toast.success(data.message);
            setView("verify");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    }

    // Handle OTP verification
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/api/users/verify-otp', { email, otp });
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success("Welcome back!");
            navigate(redirectPath, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    }

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/api/users/google-login', {
                credential: credentialResponse.credential
            });
            dispatch(login(data));
            localStorage.setItem('token', data.token);
            toast.success("Successfully logged in with Google");
            navigate(redirectPath, { replace: true });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Google login failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='relative flex items-center justify-center min-h-screen overflow-hidden bg-white'>

            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-[#FDE3D2] blur-[120px]"></div>
                <div className="absolute bottom-[5%] -right-[5%] w-[45%] h-[45%] rounded-full bg-[#D1DCF8] blur-[130px]"></div>
                <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-[#F1DEF0] blur-[100px]"></div>
            </div>

            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-primary-accent transition-colors group">
                    <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-bold">Back to Home</span>
                </Link>
            </div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md p-10 mx-4 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-slate-200/50 rounded-2xl">

                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="scale-110 mb-8" />
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {view === "identify" ? "Welcome back" : "Verify Email"}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        {view === "identify" ? "Sign in to continue your journey" : `Enter the 6-digit code sent to ${email}`}
                    </p>
                </div>

                {view === "identify" ? (
                    <div className="space-y-6">
                        {/* Google Auth - Top Priority */}
                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Login Error")}
                                useOneTap
                                theme="filled_blue"
                                shape="pill"
                                width="320"
                            />
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/0 px-4 text-slate-400 font-bold tracking-widest backdrop-blur-sm">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary-accent" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all duration-300 font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex items-center justify-center py-4 px-4 bg-slate-900 rounded-xl text-white font-black text-lg hover:shadow-2xl hover:shadow-slate-900/30 active:scale-[0.98] transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative flex items-center gap-2">
                                    {isLoading ? (
                                        <Loader2 className="animate-spin h-6 w-6 text-primary-accent" />
                                    ) : (
                                        <>
                                            <span>Continue with OTP</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-primary-accent" />
                                </div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-xl text-center text-2xl font-black tracking-[0.5em] text-slate-900 placeholder:text-slate-200 placeholder:tracking-normal focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-primary-accent transition-all duration-300"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                />
                            </div>
                            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Didn't receive code? <button type="button" onClick={handleSendOTP} className="text-primary-accent hover:underline">Resend</button>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="group relative w-full flex items-center justify-center py-4 px-4 bg-primary-accent rounded-xl text-white font-black text-lg hover:shadow-2xl hover:shadow-orange-500/30 active:scale-[0.98] transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative flex items-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-6 w-6 text-white" />
                                ) : (
                                    <>
                                        <span>Verify & Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setView("identify")}
                            className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Use different email
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                .text-primary-accent { color: #F95200; }
                .bg-primary-accent { background-color: #F95200; }
                .shadow-orange-500\\/30 { --tw-shadow-color: rgba(249, 82, 0, 0.3); }
            `}</style>
        </div>
    )
}

export default Login
