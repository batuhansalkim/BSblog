import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import WriterLayout from '../../components/WriterLayout';

export default function WriterDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalViews: 0
    });

    useEffect(() => {
        if (user && user.role !== 'writer' && user.role !== 'admin') {
            router.push('/');
        } else {
            fetchPosts();
            fetchStats();
        }
    }, [user]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/writer/posts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            setError('Yazılar yüklenirken bir hata oluştu');
            console.error('Fetch posts error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/writer/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const res = await fetch(`/api/writer/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                fetchPosts();
                fetchStats();
            }
        } catch (error) {
            console.error('Delete post error:', error);
        }
    };

    if (loading) {
        return (
            <WriterLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </WriterLayout>
        );
    }

    return (
        <WriterLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Yazar Paneli</h1>
                        <Link
                            href="/writer/posts/new"
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                        >
                            Yeni Yazı Oluştur
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Toplam Yazı</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.totalPosts}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Toplam Beğeni</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.totalLikes}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Toplam Yorum</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.totalComments}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Toplam Görüntülenme</h3>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.totalViews}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Posts List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {posts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Henüz yazı oluşturmadınız.{' '}
                            <Link href="/writer/posts/new" className="text-primary hover:text-primary-dark">
                                İlk yazınızı oluşturun
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <li key={post._id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/post/${post._id}`}
                                                className="text-lg font-medium text-gray-900 hover:text-primary truncate"
                                            >
                                                {post.title}
                                            </Link>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {post.category}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="h-4 w-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                    {post.views || 0}
                                                </div>
                                                <div className="flex items-center ml-4">
                                                    <svg
                                                        className="h-4 w-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                                        />
                                                    </svg>
                                                    {post.likes.length}
                                                </div>
                                                <div className="flex items-center ml-4">
                                                    <svg
                                                        className="h-4 w-4 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                        />
                                                    </svg>
                                                    {post.comments.length}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                href={`/writer/posts/${post._id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </WriterLayout>
    );
} 