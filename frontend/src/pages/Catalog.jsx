import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, ShoppingBag } from 'lucide-react';

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('newest');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (sort) params.append('sort', sort);

            const res = await api.get(`/products?${params.toString()}`);
            setProducts(res.data.data); // Laravel pagination wraps array in data
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(delay);
        return () => clearTimeout(delay);
    }, [search, category, minPrice, maxPrice, sort]);

    const renderContent = () => {
        if (loading) {
            return new Array(8).fill(0).map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                    <div className="bg-gray-200 h-5 rounded w-3/4 mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/3 mt-4"></div>
                </div>
            ));
        }

        if (products.length > 0) {
            return products.map(product => (
                <Link to={`/product/${product.slug}`} key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 block group flex flex-col h-full">
                    <div className="bg-gray-50 aspect-square rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].image_path} alt={product.name} className="object-cover h-full w-full group-hover:scale-105 transition duration-500" />
                        ) : (
                            <ShoppingBag size={40} className="text-gray-300" />
                        )}
                    </div>
                    <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition">{product.name}</h3>
                    <p className="text-gray-400 text-xs font-medium mt-1 mb-3 uppercase tracking-wider">{product.category?.name}</p>
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                        <span className="text-lg font-extrabold text-red-600 tracking-tight">
                            Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                        </span>
                        {product.reviews_avg_rating && (
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                ⭐ {Number.parseFloat(product.reviews_avg_rating).toFixed(1)}
                            </span>
                        )}
                    </div>
                </Link>
            ));
        }

        return (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">Produk tidak ditemukan.</p>
                <p className="text-sm">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit shrink-0">
                <div className="flex items-center gap-2 mb-6 font-bold text-gray-800 border-b pb-4">
                    <Filter size={20} className="text-red-500"/> Filter Pencarian
                </div>
                
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-sm">
                        <option value="">Semua Kategori</option>
                        <option value="smartphone">Smartphone</option>
                        <option value="laptop">Laptop</option>
                        <option value="aksesoris-komputer">Aksesoris Komputer</option>
                        <option value="kamera">Kamera</option>
                        <option value="televisi">Televisi</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="min-price" className="block text-sm font-semibold text-gray-700 mb-3" id="price-range-label">Rentang Harga</label>
                    <div className="flex flex-col gap-3" aria-labelledby="price-range-label">
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">Rp</span>
                            <input id="min-price" aria-label="Harga Minimum" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">Rp</span>
                            <input aria-label="Harga Maksimum" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition" />
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-3">Urutkan</label>
                    <select id="sort" value={sort} onChange={e => setSort(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition text-sm">
                        <option value="newest">Terbaru</option>
                        <option value="price_asc">Harga Termurah</option>
                        <option value="price_desc">Harga Termahal</option>
                    </select>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                    <input 
                        aria-label="Cari produk"
                        type="text" 
                        placeholder="Cari nama produk, brand..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition text-gray-800"
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
