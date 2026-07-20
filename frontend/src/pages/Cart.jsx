import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCart(res.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            await api.put(`/cart/${itemId}`, { quantity: newQty });
            fetchCart();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal update kuantitas');
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Hapus produk ini dari keranjang?')) return;
        try {
            await api.delete(`/cart/${itemId}`);
            fetchCart();
        } catch (error) {
            alert('Gagal menghapus item');
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Memuat keranjang...</div>;
    }

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Keranjang Belanja</h1>
            
            {items.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                    <ShoppingBag size={80} className="text-gray-200 mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-8">Keranjang Anda masih kosong.</p>
                    <Link to="/" className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition active:scale-95 shadow-lg shadow-red-200">Mulai Belanja</Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Item List */}
                    <div className="flex-1 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <img 
                                    src={item.product.images?.[0]?.image_path || ''} 
                                    alt={item.product.name} 
                                    className="w-24 h-24 object-cover rounded-2xl bg-gray-50 border border-gray-100"
                                />
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-2 leading-tight">{item.product.name}</h3>
                                    <div className="text-red-600 font-extrabold text-xl mt-2">
                                        Rp {new Intl.NumberFormat('id-ID').format(item.product.price)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                        <button aria-label="Kurangi kuantitas" onClick={() => updateQuantity(item.id, item.quantity, -1)} className="p-3 hover:bg-gray-200 text-gray-600 transition active:bg-gray-300"><Minus size={18}/></button>
                                        <span aria-live="polite" className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                                        <button aria-label="Tambah kuantitas" onClick={() => updateQuantity(item.id, item.quantity, 1)} className="p-3 hover:bg-gray-200 text-gray-600 transition active:bg-gray-300"><Plus size={18}/></button>
                                    </div>
                                    <button aria-label="Hapus item dari keranjang" onClick={() => removeItem(item.id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Hapus">
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-[22rem] shrink-0">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Ringkasan</h2>
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-gray-500 font-medium">Total Harga</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">Rp {new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95 text-lg"
                            >
                                Beli ({items.reduce((acc, item) => acc + item.quantity, 0)})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
