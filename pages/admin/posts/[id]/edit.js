import AdminLayout from '../../../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Yükleniyor...</p>,
});
import 'react-quill/dist/quill.snow.css';

const categories = [
    'Software', 'History', 'Personal', 'HipHop',
    'Technology', 'Art', 'Science', 'Literature'
];

export default function EditPost() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        isPublic: false,
    });

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Blog yazısı yüklenemedi');
            }

            setFormData({
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                category: data.category,
                isPublic: data.isPublic,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditorChange = (content) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Bir hata oluştu');
            }

            router.push('/admin/posts');
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
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
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Başlık */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Başlık
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Özet */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                            Özet
                        </label>
                        <textarea
                            name="excerpt"
                            id="excerpt"
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <select
                            name="category"
                            id="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Kategori seçin</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* İçerik */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            İçerik
                        </label>
                        <div className="prose max-w-full">
                            <ReactQuill
                                value={formData.content}
                                onChange={handleEditorChange}
                                className="h-64 mb-12"
                                theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        [{ color: [] }, { background: [] }],
                                        ['link', 'image', 'video'],
                                        ['clean'],
                                    ],
                                }}
                            />
                        </div>
                    </div>

                    {/* Yayın Durumu */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isPublic"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                            Yayında
                        </label>
                    </div>

                    {/* Butonlar */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
                        >
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
} 