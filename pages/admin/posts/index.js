import AdminLayout from '../../../components/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            setError('Blog yazıları yüklenirken bir hata oluştu');
            console.error('Fetch posts error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishToggle = async (postId, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/posts/${postId}/publish`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isPublic: !currentStatus })
            });

            if (res.ok) {
                fetchPosts(); // Refresh posts list
            }
        } catch (error) {
            console.error('Toggle publish error:', error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                fetchPosts(); // Refresh posts list
            }
        } catch (error) {
            console.error('Delete post error:', error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Blog Yazıları</h2>
                <Link
                    href="/admin/posts/new"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Yeni Yazı Ekle
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {posts.map((post) => (
                        <li key={post._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {post.title}
                                        </h3>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <span className="truncate">
                                                Yazar: {post.author.username}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>{post.category}</span>
                                            <span className="mx-2">•</span>
                                            <span>
                                                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handlePublishToggle(post._id, post.isPublic)}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${post.isPublic
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {post.isPublic ? 'Yayında' : 'Taslak'}
                                        </button>
                                        <Link
                                            href={`/admin/posts/${post._id}/edit`}
                                            className="text-primary hover:text-primary-dark"
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
                                            className="text-red-600 hover:text-red-800"
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
                            </div>
                        </li>
                    ))}
                    {posts.length === 0 && (
                        <li className="px-4 py-4 sm:px-6">
                            <p className="text-gray-500 text-center">
                                Henüz blog yazısı bulunmuyor
                            </p>
                        </li>
                    )}
                </ul>
            </div>
        </AdminLayout>
    );
} 