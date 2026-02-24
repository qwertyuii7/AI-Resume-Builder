import React from 'react'
import Title from './Title'
import { BookUserIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const Testimonials = () => {

    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@briarmartin',
            text: "This AI builder transformed my professional profile. I landed three interviews in one week!"
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            text: "The ATS optimization feature is a game-changer. I finally feel confident sending my resume."
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            text: "Clean, modern, and incredibly fast. The UI is just beautiful to work with."
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Sarah Chen',
            handle: '@sarahchen',
            text: "I love the AI suggestions. It helped me phrase my achievements in a much more impactful way."
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-6 rounded-xl mx-4 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 w-80 shrink-0">
            <div className="flex gap-4 items-center">
                <img className="size-12 rounded-xl border-2 border-brand-lime" src={card.image} alt="User Image" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 leading-none">{card.name}</p>
                        <svg className="fill-blue-500" width="14" height="14" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                        </svg>
                    </div>
                    <span className="text-sm text-slate-400 font-medium">{card.handle}</span>
                </div>
            </div>
            <p className="text-base mt-5 text-slate-600 leading-relaxed italic">"{card.text}"</p>
        </div>
    );

    return (
        <div id='testimonials' className='py-28 bg-white overflow-hidden scroll-mt-12'>
            <div className='flex flex-col items-center mb-16 px-6 text-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-primary-accent bg-brand-peach rounded-xl px-6 py-2 font-bold"
                >
                    <BookUserIcon className='size-4' />
                    <span>User Stories</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <Title title="Trusted by professionals" description="Discover how our AI-powered platform is helping job seekers around the world land their dream roles with confidence." />
                </motion.div>
            </div>

            <div className="marquee-row w-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner flex pt-10 pb-5">
                    {[...cardsData, ...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

            <div className="marquee-row w-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex pt-10 pb-5">
                    {[...cardsData, ...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

            <style>{`
            .bg-brand-peach { background-color: #FFEDD4; }
            .bg-brand-lime { background-color: #ECFCCA; }
            .text-primary-accent { color: #F95200; }
            
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-33.33%); }
            }

            .marquee-inner {
                animation: marqueeScroll 40s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>
        </div>
    )
}

export default Testimonials
