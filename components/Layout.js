import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const categories = [
        'Software', 'History', 'Personal', 'HipHop',
        'Technology', 'Art', 'Science', 'Literature'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-white text-2xl font-bold">
                                BSBLOG
                            </Link>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    {categories.map((category) => (
                                        <Link
                                            key={category}
                                            href={`/category/${category.toLowerCase()}`}
                                            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="flex items-center">
                                {user ? (
                                    <>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Çıkış Yap
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Giriş Yap
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-4"
                                        >
                                            Kayıt Ol
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/become-writer"
                                    className="ml-4 bg-white text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                                >
                                    Yazar Ol
                                </Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-200 hover:text-white"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {category}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                                    >
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Kayıt Ol
                                    </Link>
                                </>
                            )}
                            <Link
                                href="/become-writer"
                                className="bg-white text-primary block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                            >
                                Yazar Ol
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-primary">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-200">
                        <p>&copy; 2024 BSBLOG -/Batuhan SALKIM/-. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 