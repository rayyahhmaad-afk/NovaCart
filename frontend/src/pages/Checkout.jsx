import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Truck, CreditCard, ShieldCheck } from 'lucide-react';

export default function Checkout() {
    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('transfer');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/cart').then(res => {
            if (!res.data.items || res.data.items.length === 0) {
                navigate('/cart');
            } else {
                setCart(res.data);
            }
        });
    }, [navigate]);

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/checkout', {
                shipping_address: address,
                payment_method: paymentMethod
            });
            navigate(`/order-success/${res.data.order_id}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout gagal');
            setLoading(false);
        }
    };

    if (!cart) return <div className="p-12 text-center text-gray-500">Memuat detail pesanan...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Pengiriman & Pembayaran</h1>
            
            <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Truck size={20}/></div>
                            <label htmlFor="address">Alamat Pengiriman</label>
                        </h2>
                        <textarea 
                            id="address"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Tulis alamat lengkap Anda (Nama Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos)..."
                            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition resize-none h-32 text-gray-800"
                        ></textarea>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><CreditCard size={20}/></div>
                            Pilih Pembayaran
                        </h2>
                        <div className="space-y-4">
                            {[
                                { id: 'transfer', name: 'Transfer Bank (BCA, Mandiri, BNI, BRI)' },
                                { id: 'ewallet', name: 'E-Wallet (GoPay, OVO, DANA)' },
                                { id: 'cod', name: 'Bayar di Tempat (COD)' }
                            ].map(method => (
                                <label key={method.id} className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === method.id ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={e => setPaymentMethod(e.target.value)} className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300" />
                                    <span className="ml-4 font-bold text-gray-800">{method.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-[26rem] shrink-0">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Ringkasan Pesanan</h2>
                        <div className="space-y-5 mb-8">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-bold line-clamp-2 leading-snug">{item.product.name}</p>
                                        <p className="text-gray-500 text-sm mt-1">{item.quantity} x Rp {new Intl.NumberFormat('id-ID').format(item.product.price)}</p>
                                    </div>
                                    <span className="font-extrabold text-gray-900 shrink-0">Rp {new Intl.NumberFormat('id-ID').format(item.product.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 mb-6 border border-gray-100">
                            <ShieldCheck className="text-green-500 shrink-0" size={24}/>
                            <span className="text-sm font-medium text-gray-600 leading-tight">Transaksi aman dan dilindungi asuransi JD.id</span>
                        </div>

                        <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
                            <span className="text-gray-500 font-bold text-lg">Total Tagihan</span>
                            <span className="text-3xl font-black text-red-600 tracking-tight">Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                        </div>
                        <button 
                            type="submit"
                            disabled={loading || !address}
                            className={`w-full font-bold py-4 rounded-2xl transition-all active:scale-95 text-lg shadow-lg ${
                                loading || !address ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200'
                            }`}
                        >
                            {loading ? 'Memproses Order...' : 'Konfirmasi Pesanan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
