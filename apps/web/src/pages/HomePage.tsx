import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { zTitleListResponse, TitleCard } from '@telegramwebminiapp/types';
import { fetchJSON } from '../utils/fetchJSON';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export const HomePage: React.FC = () => {
    const { hapticFeedback, close, user, themeParams } = useTelegramWebApp();
    const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'all'>('popular');
    const [titles, setTitles] = useState<TitleCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTitles();
    }, [activeTab]);

    const fetchTitles = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                limit: '12',
                filter: activeTab
            });

            const response = await fetchJSON<unknown>(`http://localhost:3000/v1/titles?${params}`);
            const validatedResponse = zTitleListResponse.parse(response);
            setTitles(validatedResponse.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const filteredTitles = titles.filter(title =>
        title.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock data for ratings and view counts (since not in API)
    const getMockStats = (id: string) => ({
        rating: (3.5 + (parseInt(id) % 20) / 10).toFixed(1),
        views: Math.floor(Math.random() * 20000) + 1000
    });

    const formatViews = (views: number) => {
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}k`;
        }
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Bar */}
            <div className="bg-white shadow-sm">
                <div className="px-4 py-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => {
                                hapticFeedback.selection();
                                setActiveTab('popular');
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'popular'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Populer
                        </button>
                        <button
                            onClick={() => {
                                hapticFeedback.selection();
                                setActiveTab('new');
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'new'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Terbaru
                        </button>
                        <button
                            onClick={() => {
                                hapticFeedback.selection();
                                setActiveTab('all');
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Semua Film
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {activeTab === 'popular' ? 'Populer' : activeTab === 'new' ? 'Terbaru' : 'Semua Film'}
                        <span className="text-sm text-gray-500 ml-2">({filteredTitles.length} film)</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-2">Error loading content</div>
                        <div className="text-gray-500 text-sm">{error}</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTitles.map(title => {
                            const stats = getMockStats(title.id);
                            return (
                                <Link
                                    key={title.id}
                                    to={`/title/${title.id}`}
                                    className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex space-x-4">
                                        {/* Movie Poster */}
                                        <div className="flex-shrink-0">
                                            {title.posterUrl ? (
                                                <img
                                                    src={title.posterUrl}
                                                    alt={title.title}
                                                    className="w-16 h-24 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 7v11a2 2 0 002 2h14a2 2 0 002-2V7H3z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Movie Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                                {title.title}
                                            </h3>
                                            
                                            {/* Rating and Year */}
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center space-x-1">
                                                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">0.0</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-1">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">2025</span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                Kisah ini mengikuti perjalanan yang penuh dengan petualangan dan drama yang menarik...
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="grid grid-cols-5 py-2">
                    <Link to="/" className="flex flex-col items-center py-2 px-1">
                        <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="text-xs text-blue-500 mt-1">Beranda</span>
                    </Link>
                    
                    <Link to="/profile" className="flex flex-col items-center py-2 px-1">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-gray-400 mt-1">Profil</span>
                    </Link>
                    
                    <Link to="/search" className="flex flex-col items-center py-2 px-1">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-xs text-gray-400 mt-1">Riwayat</span>
                    </Link>
                    
                    <Link to="/library" className="flex flex-col items-center py-2 px-1">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-xs text-gray-400 mt-1">Perpustakaan</span>
                    </Link>
                    
                    <button 
                        onClick={() => {
                            hapticFeedback.impact('light');
                            close();
                        }}
                        className="flex flex-col items-center py-2 px-1"
                    >
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-xs text-gray-400 mt-1">Tutup</span>
                    </button>
                </div>
            </div>

            {/* Bottom padding to account for fixed navigation */}
            <div className="h-20"></div>
        </div>
    );
};
