import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">JD.id</Link>
            <div className="space-x-4">
                {user ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                        <Link to="/cart" className="text-gray-600 hover:text-red-600 font-medium transition">Cart</Link>
                        <button onClick={logout} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded transition">Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-red-600 font-medium transition">Masuk</Link>
                        <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition">Daftar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function Home() {
    return (
        <div className="p-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Selamat datang di JD.id</h1>
            <p className="mt-4 text-lg text-gray-600">Pusat belanja elektronik dan gadget terlengkap.</p>
        </div>
    );
}

function Cart() {
    return <div className="p-12 text-center text-2xl font-bold text-gray-800">Keranjang Belanja (Protected Route)</div>;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
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
