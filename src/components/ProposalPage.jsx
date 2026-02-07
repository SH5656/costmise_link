import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Volume2, VolumeX } from 'lucide-react';

const ProposalPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name') || 'Beautiful';
    const customMessage = searchParams.get('message') || 'Will you be my Valentine?';

    // Music mapping
    const musicTracks = {
        canon: '/songs/canon.mp3',
        piano: '/songs/piano.mp3',
        orchestral: '/songs/orchestral.mp3'
    };

    const musicParam = searchParams.get('music') || 'canon';
    const musicSrc = musicTracks[musicParam] || musicParam; // Use preset or custom URL

    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);
    const [image, setImage] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Load image from localStorage if available
    useEffect(() => {
        const savedImage = localStorage.getItem('val_custom_image');
        if (savedImage) setImage(savedImage);
    }, []);

    // Run away logic
    const moveNoButton = () => {
        const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
        const y = Math.random() * (window.innerHeight - 200) - (window.innerHeight / 2 - 100);
        setNoBtnPos({ x, y });
    };

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleYes = () => {
        setAccepted(true);
        // Play music if not already playing
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
            setIsPlaying(true);
        }

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
        });

        // Continuous confetti
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    // Default romantic images if none provided
    const defaultImage = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&auto=format&fit=crop";

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-pink-200 font-sans">

            {/* Music Toggle */}
            <button
                onClick={toggleMusic}
                className="absolute top-4 right-4 z-50 bg-white/50 p-3 rounded-full hover:bg-white transition shadow-sm cursor-pointer"
            >
                {isPlaying ? <Volume2 className="text-pink-600 w-6 h-6" /> : <VolumeX className="text-gray-500 w-6 h-6" />}
            </button>

            {/* Audio Element */}
            <audio ref={audioRef} loop src={musicSrc} />

            {/* Floating Hearts Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-pink-300 opacity-50"
                        initial={{ y: '100vh', x: Math.random() * 100 + 'vw', scale: Math.random() * 0.5 + 0.5 }}
                        animate={{
                            y: '-10vh',
                            x: Math.random() * 100 + 'vw',
                            rotate: Math.random() * 360
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 10
                        }}
                    >
                        <Heart fill="currentColor" size={Math.random() * 30 + 20} />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {!accepted ? (
                    <motion.div
                        key="proposal"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
                        className="z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-white max-w-md w-full text-center relative"
                    >
                        <div className="flex justify-center mb-6 relative">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg bg-pink-50 relative z-10">
                                <img
                                    src={image || defaultImage}
                                    alt="Valentine"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-red-500 mb-4 font-serif">Hey {name}! 🌹</h1>
                        <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">"{customMessage}"</p>

                        <div className="flex justify-center items-center gap-8 relative h-24">
                            <button
                                onClick={handleYes}
                                className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-110 active:scale-95 z-20 flex items-center gap-2 cursor-pointer"
                            >
                                <Heart className="fill-white w-6 h-6" /> YES
                            </button>

                            <motion.button
                                onMouseEnter={moveNoButton}
                                onTouchStart={moveNoButton}
                                onClick={moveNoButton}
                                animate={noBtnPos}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="bg-gray-300 text-gray-600 font-bold py-3 px-8 rounded-full shadow hover:bg-gray-400 transition-colors cursor-not-allowed"
                            >
                                No
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="celebration"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="z-10 text-center px-4"
                    >
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-6 drop-shadow-sm">Love You! 💖</h1>
                        <p className="text-3xl text-pink-700 font-bold mb-8">I knew you would say yes! ❤️</p>

                        <div className="mx-auto w-72 h-72 relative">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-2xl filter">
                                    <defs>
                                        <pattern id="img-pattern" patternUnits="userSpaceOnUse" width="24" height="24">
                                            <image href={image || defaultImage} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid slice" />
                                        </pattern>
                                    </defs>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="url(#img-pattern)" stroke="#ff4d4d" strokeWidth="1" />
                                </svg>
                            </motion.div>
                        </div>
                        <p className="mt-8 text-black/90 text-lg font-medium drop-shadow-md">See you on Valentine's Day! 😘</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 text-pink-600 underline hover:text-pink-800 cursor-pointer"
                        >
                            Replay
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProposalPage;
