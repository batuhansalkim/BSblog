import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function WriterApplication() {
    const router = useRouter();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [existingApplication, setExistingApplication] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role === 'writer' || user.role === 'admin') {
            router.push('/writer');
            return;
        }

        checkExistingApplication();
    }, [user]);

    const checkExistingApplication = async () => {
        try {
            const res = await fetch('/api/writer/application', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();

            if (data.application) {
                setExistingApplication(data.application);
            }
        } catch (error) {
            console.error('Check application error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/writer/application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message })
            });

            if (res.ok) {
                setSuccess(true);
                setMessage('');
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

    if (existingApplication) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto px-4 py-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Yazar Başvurunuz
                        </h1>

                        <div className="mb-6">
                            <div className="bg-blue-50 border border-blue-500 text-blue-700 px-4 py-3 rounded">
                                Başvurunuz {existingApplication.status === 'pending' ? 'inceleniyor' : existingApplication.status === 'approved' ? 'onaylandı' : 'reddedildi'}.
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Başvuru Mesajınız:
                                </h3>
                                <p className="mt-1 text-gray-900">{existingApplication.message}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Başvuru Tarihi:
                                </h3>
                                <p className="mt-1 text-gray-900">
                                    {new Date(existingApplication.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Yazar Başvurusu
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600">
                            BSBLOG'da yazar olmak için başvuruda bulunun. Başvurunuz incelendikten sonra
                            size bilgi verilecektir.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded">
                            Başvurunuz başarıyla alındı. İncelendikten sonra size bilgi verilecektir.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Neden yazar olmak istiyorsunuz?
                                </label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder="Kendinizi tanıtın ve neden yazar olmak istediğinizi açıklayın..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? 'Gönderiliyor...' : 'Başvuru Yap'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
} 