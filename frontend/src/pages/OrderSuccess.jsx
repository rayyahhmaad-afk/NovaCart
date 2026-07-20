import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
    const { id } = useParams();

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center max-w-lg w-full flex flex-col items-center">
                <CheckCircle size={96} className="text-green-500 mb-6 drop-shadow-sm" />
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Terima Kasih!</h1>
                <p className="text-gray-500 text-lg mb-10 font-medium">Pesanan Anda telah berhasil dibuat dan akan segera kami proses.</p>
                
                <div className="bg-gray-50 w-full p-8 rounded-3xl mb-10 border border-gray-100">
                    <p className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-2">Nomor Pesanan</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">#ORD-{id.padStart(6, '0')}</p>
                </div>

                <Link to="/" className="w-full block bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-gray-800 transition active:scale-95 shadow-lg shadow-gray-200">
                    Kembali Belanja
                </Link>
            </div>
        </div>
    );
}
