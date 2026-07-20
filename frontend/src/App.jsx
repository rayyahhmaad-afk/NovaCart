import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import { ShoppingCart, LogOut, User } from 'lucide-react';

function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-3xl font-black text-red-600 tracking-tighter">JD.id</Link>
            <div className="space-x-4 flex items-center">
                {user ? (
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="text-gray-600 hover:text-red-600 transition flex items-center gap-2 font-semibold">
                            <ShoppingCart size={22} /> <span className="hidden sm:inline">Keranjang</span>
                        </Link>
                        <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                            <span className="text-gray-800 font-bold flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <User size={18} className="text-gray-500"/> {user.name}
                            </span>
                            <button onClick={logout} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 font-bold p-2.5 rounded-xl transition shadow-sm" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-700 hover:text-red-600 font-bold transition">Masuk</Link>
                        <Link to="/register" className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95">Daftar</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

function Cart() {
    return (
        <div className="max-w-4xl mx-auto p-12 text-center mt-10 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black text-gray-800 mb-4">Keranjang Belanja</h1>
            <p className="text-gray-500 font-medium">(Protected Route) Keranjang Anda masih kosong.</p>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Catalog />} />
                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
