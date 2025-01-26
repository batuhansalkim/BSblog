import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts/public');
            if (!res.ok) throw new Error('Blog yazıları yüklenemedi');
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch posts error:', error);
            setError('Blog yazıları yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error('Kategoriler yüklenemedi');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch categories error:', error);
        }
    };

    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post => post.category?._id === selectedCategory);

    const loadMorePosts = async () => {
        if (!hasMore || loading) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page + 1,
                category: selectedCategory !== 'all' ? selectedCategory : '',
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
                category: selectedCategory !== 'all' ? selectedCategory : '',
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

    const handleCategoryChange = async (category) => {
        setSelectedCategory(category);
        setLoading(true);

        try {
            const queryParams = new URLSearchParams({
                page: 1,
                category: category !== 'all' ? category : '',
                search: searchQuery
            });

            const res = await fetch(`/api/posts?${queryParams}`);
            const newPosts = await res.json();

            setPosts(newPosts);
            setPage(1);
            setHasMore(newPosts.length === 10);
        } catch (error) {
            console.error('Category filter error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filter Section */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Blog yazısı ara..."
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
                        >
                            Ara
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-md ${selectedCategory === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)}
                                className={`px-4 py-2 rounded-md ${selectedCategory === category._id
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Blog Yazıları Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        Henüz blog yazısı bulunmuyor.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {post.coverImage && (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">
                                        <Link href={`/posts/${post._id}`} className="hover:text-primary">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{post.author?.username || 'Anonim'}</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
            </div>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const [postsRes, categoriesRes] = await Promise.all([
            fetch(`${process.env.NEXTAUTH_URL}/api/posts?page=1`),
            fetch(`${process.env.NEXTAUTH_URL}/api/categories`)
        ]);

        const [posts, categories] = await Promise.all([
            postsRes.json(),
            categoriesRes.json()
        ]);

        return {
            props: {
                posts,
                categories
            }
        };
    } catch (error) {
        console.error('Get home page data error:', error);
        return {
            props: {
                posts: [],
                categories: []
            }
        };
    }
} 