import { useState, useEffect } from 'react';
import axios from 'axios';

import { Package, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState({ open: false, orderId: null, productId: null, product: null });
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/api/reviews', {
                order_id: reviewModal.orderId,
                product_id: reviewModal.productId,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Review submitted successfully!');
            setReviewModal({ open: false, orderId: null, productId: null, product: null });
            setRating(5);
            setComment('');
            fetchOrders(); // Refresh to update review status
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        if (status === 'completed') return 'bg-green-50 text-green-600 border border-green-100';
        if (status === 'cancelled') return 'bg-red-50 text-red-600 border border-red-100';
        return 'bg-blue-50 text-blue-600 border border-blue-100';
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Package className="text-red-600" size={32} /> Riwayat Pesanan
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4">Belum ada pesanan.</p>
                    <Link to="/" className="text-red-600 font-bold hover:underline">Mulai Belanja</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-100 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">
                                        Order ID: <span className="text-gray-800">#{order.id}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${getStatusStyle(order.status)}`}>
                                        {order.status === 'completed' ? 'Diterima' : order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.items.map(item => {
                                    const hasReviewed = order.reviews?.some(r => r.product_id === item.product_id);
                                    
                                    return (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                                                    {item.product.image ? (
                                                        <img src={`http://127.0.0.1:8000/storage/${item.product.image}`} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Link to={`/product/${item.product.slug}`} className="font-bold text-gray-800 hover:text-red-600 transition">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-1">{item.quantity} x Rp {Number.parseInt(item.price, 10).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>

                                            {order.status === 'completed' && !hasReviewed && (
                                                <button
                                                    type="button"
                                                    onClick={() => setReviewModal({ open: true, orderId: order.id, productId: item.product_id, product: item.product })}
                                                    className="px-4 py-2 bg-white border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition"
                                                >
                                                    Tulis Ulasan
                                                </button>
                                            )}
                                            {order.status === 'completed' && hasReviewed && (
                                                <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold flex items-center gap-2">
                                                    <Star size={16} className="fill-yellow-400 text-yellow-400" /> Diulas
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-gray-600">Total Harga:</span>
                                <span className="text-xl font-black text-red-600">Rp {Number.parseInt(order.total_price, 10).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reviewModal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button 
                            type="button"
                            aria-label="Tutup modal ulasan"
                            onClick={() => setReviewModal({ open: false, orderId: null, productId: null, product: null })}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Tulis Ulasan</h2>
                        <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Bagaimana kepuasan Anda terhadap {reviewModal.product?.name}?</p>
                        
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-6 flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-transform hover:scale-110 p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                    >
                                        <Star size={40} className={rating >= star ? 'fill-current' : ''} />
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mb-8">
                                <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <MessageSquare size={16} /> Komentar (Opsional)
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                    className="w-full p-4 border border-gray-200 bg-gray-50 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-400 outline-none transition resize-none h-32 text-gray-800 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
