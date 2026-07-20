import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ShoppingCart, Star, ChevronRight, PackageX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${slug}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const addToCart = async () => {
        if (!user) {
            alert("Harap login terlebih dahulu.");
            return;
        }
        setAdding(true);
        // Simulasi add to cart API
        setTimeout(() => {
            alert('Berhasil ditambahkan ke keranjang!');
            setAdding(false);
        }, 600);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6 animate-pulse mt-8">
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-1/2 bg-gray-200 h-[500px] rounded-3xl"></div>
                    <div className="w-full md:w-1/2 space-y-5 pt-4">
                        <div className="bg-gray-200 h-10 rounded-lg w-3/4"></div>
                        <div className="bg-gray-200 h-6 rounded-md w-1/4"></div>
                        <div className="bg-gray-200 h-12 rounded-xl w-1/3 mt-8"></div>
                        <div className="bg-gray-200 h-4 rounded w-full mt-10"></div>
                        <div className="bg-gray-200 h-4 rounded w-full"></div>
                        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                        <div className="bg-gray-200 h-14 rounded-2xl w-full mt-10"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <PackageX size={64} className="text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800">Produk tidak ditemukan</h2>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-8 font-medium">
                <Link to="/" className="hover:text-red-600 transition">Beranda</Link>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="capitalize hover:text-red-600 cursor-pointer transition">{product.category?.name}</span>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="text-gray-800 truncate">{product.name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-12 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <div className="bg-gray-50 aspect-square rounded-[2rem] flex items-center justify-center overflow-hidden border border-gray-100 relative group">
                        {product.images?.length > 0 ? (
                            <img src={product.images[0].image_path} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        ) : (
                            <PackageX size={80} className="text-gray-200" />
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">{product.name}</h1>
                    
                    <div className="flex items-center gap-4 mb-8">
                        {product.reviews_avg_rating ? (
                            <div className="flex items-center text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                                <Star fill="currentColor" size={18} />
                                <span className="ml-1.5 font-bold text-yellow-700">{parseFloat(product.reviews_avg_rating).toFixed(1)}</span>
                                <span className="ml-2 text-sm text-yellow-600 font-medium">({product.reviews?.length || 0} Ulasan)</span>
                            </div>
                        ) : (
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">Belum ada ulasan</span>
                        )}
                        <span className="text-gray-300">|</span>
                        <span className="text-sm font-medium text-gray-500">Stok: <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock > 0 ? product.stock : 'Habis'}</span></span>
                    </div>

                    <div className="text-5xl font-black text-red-600 mb-10 tracking-tight">
                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-10 text-base leading-relaxed">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Deskripsi Produk</h3>
                        <p>{product.description}</p>
                    </div>

                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Spesifikasi</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(product.specs).map(([key, val]) => (
                                    <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</span>
                                        <span className="font-semibold text-gray-800">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-6">
                        <button 
                            onClick={addToCart}
                            disabled={adding || product.stock === 0}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all ${
                                product.stock === 0 ? 'bg-gray-300 shadow-none cursor-not-allowed text-gray-500' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200 active:scale-95'
                            }`}
                        >
                            <ShoppingCart size={24} />
                            {product.stock === 0 ? 'Stok Habis' : adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
