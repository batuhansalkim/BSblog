import AdminLayout from '../../../components/AdminLayout';
import { useState, useEffect } from 'react';

export default function WriterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/admin/applications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setApplications(data);
        } catch (error) {
            setError('Başvurular yüklenirken bir hata oluştu');
            console.error('Fetch applications error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            const res = await fetch(`/api/admin/applications/${userId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                fetchApplications(); // Başvuru listesini yenile
            }
        } catch (error) {
            console.error('Approve application error:', error);
        }
    };

    const handleReject = async (userId) => {
        try {
            const res = await fetch(`/api/admin/applications/${userId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                fetchApplications(); // Başvuru listesini yenile
            }
        } catch (error) {
            console.error('Reject application error:', error);
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
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Yazar Başvuruları</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {applications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Henüz bekleyen başvuru bulunmuyor
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {applications.map((application) => (
                                <li key={application._id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                                        {application.user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {application.user.username}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {application.user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Başvuru Mesajı:
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {application.message}
                                                </p>
                                            </div>

                                            <div className="mt-2">
                                                <span className="text-sm text-gray-500">
                                                    Başvuru Tarihi:{' '}
                                                    {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleApprove(application.user._id)}
                                                className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200"
                                            >
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleReject(application.user._id)}
                                                className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                                            >
                                                Reddet
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 