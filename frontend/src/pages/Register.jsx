import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const isEmail = contact.includes('@');
        const payload = {
            name,
            password,
            ...(isEmail ? { email: contact } : { phone: contact })
        };

        try {
            const res = await api.post('/register', payload);
            authLogin(res.data.user, res.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar JD.id</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email atau No HP</label>
                        <input type="text" required value={contact} onChange={e => setContact(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required value={password} minLength={6} onChange={e => setPassword(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
                        Daftar
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Masuk</Link>
                </div>
            </div>
        </div>
    );
}
