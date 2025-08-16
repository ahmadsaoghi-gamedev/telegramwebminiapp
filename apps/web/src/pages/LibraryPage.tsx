import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TitleCard } from '@telegramwebminiapp/types';

export const LibraryPage: React.FC = () => {
    const [titles, setTitles] = useState<TitleCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTitles();
    }, []);

    const fetchTitles = async () => {
        try {
            const response = await fetch('/api/v1/titles');
            if (!response.ok) throw new Error('Failed to fetch titles');
            const data = await response.json();
            setTitles(data.items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">Library</h1>
                        <nav className="space-x-4">
                            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
                            <Link to="/search" className="text-blue-600 hover:text-blue-800">Search</Link>
                            <Link to="/profile" className="text-blue-600 hover:text-blue-800">Profile</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {titles.map((title) => (
                        <div key={title.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{title.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{title.type}</span>
                                    <Link
                                        to={`/title/${title.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
