import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/login', { login, password });
            authLogin(res.data.user, res.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Masuk ke JD.id</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email atau No HP</label>
                        <input type="text" required value={login} onChange={e => setLogin(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200 focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
                        Masuk
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar sekarang</Link>
                </div>
            </div>
        </div>
    );
}
