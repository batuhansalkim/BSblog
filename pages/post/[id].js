import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

export default function PostDetail({ post }) {
    const router = useRouter();
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (router.isFallback) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    const handleLike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                router.reload();
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleDislike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`/api/posts/${post._id}/dislike`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                router.reload();
            }
        } catch (error) {
            console.error('Dislike error:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/posts/${post._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: comment })
            });

            if (res.ok) {
                setComment('');
                router.reload();
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <article className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={`/category/${post.category.toLowerCase()}`}
                            className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                            {post.category}
                        </Link>
                        <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                {post.author.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                {post.author.username}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div
                    className="prose max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Actions */}
                <div className="flex items-center space-x-4 mb-8 border-t border-b border-gray-200 py-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 ${user && post.likes.includes(user._id)
                            ? 'text-green-600'
                            : 'text-gray-500'
                            } hover:text-green-600`}
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
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                        </svg>
                        <span>{post.likes.length}</span>
                    </button>

                    <button
                        onClick={handleDislike}
                        className={`flex items-center space-x-1 ${user && post.dislikes.includes(user._id)
                            ? 'text-red-600'
                            : 'text-gray-500'
                            } hover:text-red-600`}
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
                                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c-.163 0-.326.02-.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 6h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"
                            />
                        </svg>
                        <span>{post.dislikes.length}</span>
                    </button>
                </div>

                {/* Comments */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Yorumlar</h2>

                    {/* Comment Form */}
                    {user ? (
                        <form onSubmit={handleComment} className="mb-8">
                            {error && (
                                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div className="mb-4">
                                <textarea
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Yorumunuzu yazın..."
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {loading ? 'Gönderiliyor...' : 'Yorum Yap'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
                            <p className="text-gray-600">
                                Yorum yapmak için{' '}
                                <Link href="/login" className="text-primary hover:text-primary-dark">
                                    giriş yapın
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {post.comments.map((comment, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <div className="flex items-center mb-2">
                                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                                        {comment.user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            {comment.user.username}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600">{comment.content}</p>
                            </div>
                        ))}

                        {post.comments.length === 0 && (
                            <p className="text-gray-500 text-center">
                                Henüz yorum yapılmamış
                            </p>
                        )}
                    </div>
                </section>
            </article>
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${params.id}`);
        const post = await res.json();

        if (!post) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                post,
            },
        };
    } catch (error) {
        console.error('Get post error:', error);
        return {
            notFound: true,
        };
    }
} 