import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function BlogCard({ post }) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes.length);
    const [dislikes, setDislikes] = useState(post.dislikes.length);
    const [hasLiked, setHasLiked] = useState(user ? post.likes.includes(user._id) : false);
    const [hasDisliked, setHasDisliked] = useState(user ? post.dislikes.includes(user._id) : false);

    const handleLike = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            const res = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                if (hasLiked) {
                    setLikes(likes - 1);
                    setHasLiked(false);
                } else {
                    setLikes(likes + 1);
                    setHasLiked(true);
                    if (hasDisliked) {
                        setDislikes(dislikes - 1);
                        setHasDisliked(false);
                    }
                }
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleDislike = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            const res = await fetch(`/api/posts/${post._id}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                if (hasDisliked) {
                    setDislikes(dislikes - 1);
                    setHasDisliked(false);
                } else {
                    setDislikes(dislikes + 1);
                    setHasDisliked(true);
                    if (hasLiked) {
                        setLikes(likes - 1);
                        setHasLiked(false);
                    }
                }
            }
        } catch (error) {
            console.error('Dislike error:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
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

                <Link href={`/post/${post._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary">
                        {post.title}
                    </h2>
                </Link>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-1 ${hasLiked ? 'text-green-600' : 'text-gray-500'
                                } hover:text-green-600`}
                        >
                            <svg
                                className="h-5 w-5"
                                fill={hasLiked ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                />
                            </svg>
                            <span>{likes}</span>
                        </button>

                        <button
                            onClick={handleDislike}
                            className={`flex items-center space-x-1 ${hasDisliked ? 'text-red-600' : 'text-gray-500'
                                } hover:text-red-600`}
                        >
                            <svg
                                className="h-5 w-5"
                                fill={hasDisliked ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 6h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"
                                />
                            </svg>
                            <span>{dislikes}</span>
                        </button>

                        <Link
                            href={`/post/${post._id}#comments`}
                            className="flex items-center space-x-1 text-gray-500 hover:text-primary"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                            <span>{post.comments.length}</span>
                        </Link>
                    </div>

                    <Link
                        href={`/post/${post._id}`}
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Devamını Oku →
                    </Link>
                </div>
            </div>
        </div>
    );
} 