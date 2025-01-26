import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function CategoryPage({ posts: initialPosts, category }) {
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    if (router.isFallback) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    const loadMorePosts = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page + 1,
                category,
                search: searchQuery
            });

            const res = await fetch(`/api/posts?${queryParams}`);
            const newPosts = await res.json();

            if (newPosts.length < 10) {
                setHasMore(false);
            }

            setPosts([...posts, ...newPosts]);
            setPage(page + 1);
        } catch (error) {
            console.error('Load more posts error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const queryParams = new URLSearchParams({
                page: 1,
                category,
                search: searchQuery
            });

            const res = await fetch(`/api/posts?${queryParams}`);
            const newPosts = await res.json();

            setPosts(newPosts);
            setPage(1);
            setHasMore(newPosts.length === 10);
        } catch (error) {
            console.error('Search posts error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {category.charAt(0).toUpperCase() + category.slice(1)} Kategorisi
                    </h1>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Bu kategoride ara..."
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
                        >
                            Ara
                        </button>
                    </form>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                            {post.coverImage && (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <Link href={`/post/${post._id}`}>
                                    <h2 className="text-xl font-semibold text-gray-900 hover:text-primary">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="mt-2 text-gray-600 line-clamp-3">
                                    {post.excerpt || post.content.substring(0, 150)}...
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                                            {post.author.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">
                                            {post.author.username}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center text-sm text-gray-500">
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
                        </article>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={loadMorePosts}
                            disabled={loading}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
                        </button>
                    </div>
                )}

                {posts.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        Bu kategoride henüz yazı bulunmuyor.
                    </div>
                )}
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    try {
        const category = params.slug;
        const queryParams = new URLSearchParams({
            page: 1,
            category
        });

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts?${queryParams}`);
        const posts = await res.json();

        return {
            props: {
                posts,
                category
            }
        };
    } catch (error) {
        console.error('Get category page error:', error);
        return {
            props: {
                posts: [],
                category: params.slug
            }
        };
    }
} 