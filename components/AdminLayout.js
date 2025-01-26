import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }) {
    const { user } = useAuth();
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/login');
        }
    }, [user]);

    const menuItems = [
        { title: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { title: 'Blog Yazıları', path: '/admin/posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2' },
        { title: 'Yeni Yazı', path: '/admin/posts/new', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { title: 'Kullanıcılar', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { title: 'Yazar Başvuruları', path: '/admin/applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-primary text-white">
                <div className="flex items-center justify-center h-16 bg-primary-dark">
                    <Link href="/" className="text-2xl font-bold">
                        BSBLOG Admin
                    </Link>
                </div>
                <nav className="mt-5">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center px-6 py-3 text-gray-100 hover:bg-primary-dark ${router.pathname === item.path ? 'bg-primary-dark' : ''
                                }`}
                        >
                            <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={item.icon}
                                />
                            </svg>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="ml-64">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {menuItems.find((item) => item.path === router.pathname)?.title || 'Admin Panel'}
                            </h1>
                            <div className="flex items-center">
                                <span className="text-gray-600 mr-4">
                                    Hoş geldin, {user?.username}
                                </span>
                                <Link
                                    href="/"
                                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
                                >
                                    Siteye Dön
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
} 