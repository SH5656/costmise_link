import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Camera, Copy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CreatorPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        message: '',
        image: null,
        music: 'canon',
        customMusicUrl: ''
    });
    const [generatedLink, setGeneratedLink] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Save to localStorage for local preview/same-device usage
                // Note: Real sharing would require backend storage
                localStorage.setItem('val_custom_image', reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const generateLink = () => {
        const params = new URLSearchParams();
        params.set('name', formData.name);
        if (formData.message) params.set('message', formData.message);

        let musicParam = formData.music;
        if (formData.music === 'custom' && formData.customMusicUrl) {
            musicParam = formData.customMusicUrl;
        }
        params.set('music', musicParam);

        // Construct the link (hash router)
        const baseUrl = window.location.href.split('#')[0];
        const link = `${baseUrl}#/valentine?${params.toString()}`;
        setGeneratedLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copied! Send it to your special someone ❤️');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-red-100 to-pink-300 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md w-full border border-pink-200"
            >
                <div className="text-center mb-8">
                    <Heart className="w-12 h-12 text-red-500 mx-auto animate-pulse fill-red-500" />
                    <h1 className="text-3xl font-bold text-gray-800 mt-4">Create Your Valentine</h1>
                    <p className="text-gray-600 mt-2">Make something special for her ✨</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Her Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white/50"
                            placeholder="e.g. Priyu"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white/50 min-h-[100px]"
                            placeholder="Will you be my Valentine? (default is used if empty)"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Photo (Optional)</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="photo-upload"
                            />
                            <label
                                htmlFor="photo-upload"
                                className="flex items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-pink-300 cursor-pointer hover:border-pink-500 transition bg-pink-50 hover:bg-pink-100"
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500">
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Tap to upload photo</span>
                                    </div>
                                )}
                            </label>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                *Photo works best if viewing on this device.
                                <br />Sharing the link preserves Name & Message only.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Music</label>
                        <select
                            value={formData.music}
                            onChange={(e) => setFormData({ ...formData, music: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white/50 mb-2"
                        >
                            <option value="canon">Canon in D (Piano)</option>
                            <option value="piano">Romantic Piano</option>
                            <option value="orchestral">Orchestral Love</option>
                            <option value="custom">Custom URL</option>
                        </select>

                        {formData.music === 'custom' && (
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition bg-white/50"
                                placeholder="Paste MP3 Link (e.g., https://...)"
                                value={formData.customMusicUrl}
                                onChange={(e) => setFormData({ ...formData, customMusicUrl: e.target.value })}
                            />
                        )}
                    </div>

                    {!generatedLink ? (
                        <button
                            onClick={generateLink}
                            disabled={!formData.name}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Generate Link <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 break-all text-sm text-gray-600">
                                {generatedLink}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyLink}
                                    className="flex-1 bg-white text-pink-600 border-2 border-pink-500 font-bold py-3 rounded-xl hover:bg-pink-50 transition flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-4 h-4" /> Copy
                                </button>
                                <button
                                    onClick={() => window.location.href = generatedLink}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    Preview <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CreatorPage;
