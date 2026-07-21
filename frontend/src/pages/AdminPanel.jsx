import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, ListOrdered, FolderOpen, Trash2, Edit } from 'lucide-react';

export default function AdminPanel() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [data, setData] = useState({ dashboard: {}, orders: [], products: [], categories: [] });
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/admin',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        if (user?.role === 'admin') fetchData(activeTab);
    }, [activeTab, user]);

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            const endpoint = tab === 'dashboard' ? '/dashboard' : `/${tab}`;
            const res = await api.get(endpoint);
            setData(prev => ({ ...prev, [tab]: res.data }));
        } catch (error) {
            console.error(`Failed to fetch ${tab}:`, error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView data={data.dashboard} />;
            case 'orders': return <OrdersView orders={data.orders} api={api} refresh={() => fetchData('orders')} />;
            case 'products': return <ProductsView products={data.products} categories={data.categories} api={api} refresh={() => fetchData('products')} fetchCategories={() => fetchData('categories')} />;
            case 'categories': return <CategoriesView categories={data.categories} api={api} refresh={() => fetchData('categories')} />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-sm flex flex-col shrink-0 md:h-full h-auto overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-black text-red-600 tracking-tighter">Admin JD.id</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
                        { id: 'orders', label: 'Pesanan', icon: <ListOrdered size={20}/> },
                        { id: 'products', label: 'Produk', icon: <ShoppingBag size={20}/> },
                        { id: 'categories', label: 'Kategori', icon: <FolderOpen size={20}/> }
                    ].map(tab => (
                        <button
                            type="button"
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === tab.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {loading ? <p>Loading...</p> : renderTab()}
            </div>
        </div>
    );
}

// === COMPONENT: Dashboard ===
function DashboardView({ data }) {
    if (!data || Object.keys(data).length === 0) return null;
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Ringkas</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-bold mb-2">Total Pesanan</h3>
                    <p className="text-4xl font-black">{data.total_orders}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 font-bold mb-2">Total Pendapatan</h3>
                    <p className="text-4xl font-black text-green-600">Rp {Number.parseInt(data.total_revenue || 0, 10).toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">Produk Terlaris</h3>
                <ul className="space-y-3">
                    {data.top_products?.map(p => (
                        <li key={p.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold">{p.name}</span>
                            <span className="text-red-600 font-bold">{p.sales} Terjual</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// === COMPONENT: Orders ===
function OrdersView({ orders, api, refresh }) {
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            refresh();
        } catch (e) { console.error(e); alert('Gagal update status'); }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manajemen Pesanan</h2>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">ID</th>
                            <th className="p-4 font-bold text-gray-600">User</th>
                            <th className="p-4 font-bold text-gray-600">Total</th>
                            <th className="p-4 font-bold text-gray-600">Alamat</th>
                            <th className="p-4 font-bold text-gray-600">Status</th>
                            <th className="p-4 font-bold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map(o => (
                            <tr key={o.id} className="border-b border-gray-100">
                                <td className="p-4">#{o.id}</td>
                                <td className="p-4 font-medium">{o.user?.name}</td>
                                <td className="p-4 text-red-600 font-bold">Rp {Number.parseInt(o.total_price, 10).toLocaleString('id-ID')}</td>
                                <td className="p-4 text-sm max-w-xs truncate">{o.shipping_address}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase">{o.status}</span>
                                </td>
                                <td className="p-4">
                                    <select 
                                        aria-label="Update status pesanan"
                                        value={o.status} 
                                        onChange={(e) => updateStatus(o.id, e.target.value)}
                                        className="p-1.5 border rounded bg-gray-50 text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// === COMPONENT: Categories ===
function CategoriesView({ categories, api, refresh }) {
    const [form, setForm] = useState({ name: '', slug: '' });
    const [editingId, setEditingId] = useState(null);

    const save = async (e) => {
        e.preventDefault();
        try {
            if (editingId) await api.put(`/categories/${editingId}`, form);
            else await api.post('/categories', form);
            setForm({ name: '', slug: '' });
            setEditingId(null);
            refresh();
        } catch (err) { console.error(err); alert('Gagal menyimpan kategori'); }
    };

    const remove = async (id) => {
        if (!confirm('Yakin hapus?')) return;
        try { await api.delete(`/categories/${id}`); refresh(); } catch(e) { console.error(e); alert('Gagal hapus'); }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manajemen Kategori</h2>
            <form onSubmit={save} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1">
                    <label htmlFor="cat-name" className="block text-sm font-bold mb-1">Nama</label>
                    <input id="cat-name" required className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="flex-1">
                    <label htmlFor="cat-slug" className="block text-sm font-bold mb-1">Slug</label>
                    <input id="cat-slug" required className="w-full p-2 border rounded" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded font-bold">{editingId ? 'Update' : 'Simpan'}</button>
                {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name:'',slug:''})}} className="px-4 py-2 border rounded">Batal</button>}
            </form>
            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4">Nama</th><th className="p-4">Slug</th><th className="p-4 w-32">Aksi</th></tr></thead>
                    <tbody>
                        {categories?.map(c => (
                            <tr key={c.id} className="border-b">
                                <td className="p-4 font-bold">{c.name}</td>
                                <td className="p-4">{c.slug}</td>
                                <td className="p-4 flex gap-2">
                                    <button type="button" aria-label="Edit Kategori" onClick={() => {setForm({name: c.name, slug: c.slug}); setEditingId(c.id);}} className="text-blue-500"><Edit size={18}/></button>
                                    <button type="button" aria-label="Hapus Kategori" onClick={() => remove(c.id)} className="text-red-500"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// === COMPONENT: Products ===
function ProductsView({ products, categories, api, refresh, fetchCategories }) {
    const [form, setForm] = useState({ name: '', slug: '', category_id: '', price: '', stock: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { if (!categories || categories.length === 0) fetchCategories(); }, []);

    const save = async (e) => {
        e.preventDefault();
        try {
            if (editingId) await api.put(`/products/${editingId}`, form);
            else await api.post('/products', form);
            setForm({ name: '', slug: '', category_id: '', price: '', stock: '', description: '' });
            setEditingId(null);
            refresh();
        } catch (err) { console.error(err); alert('Gagal menyimpan produk'); }
    };

    const remove = async (id) => {
        if (!confirm('Yakin hapus?')) return;
        try { await api.delete(`/products/${id}`); refresh(); } catch(e) { console.error(e); alert('Gagal hapus'); }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Manajemen Produk</h2>
            <form onSubmit={save} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="prod-name" className="block text-sm font-bold mb-1">Nama</label>
                    <input id="prod-name" required className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="prod-slug" className="block text-sm font-bold mb-1">Slug</label>
                    <input id="prod-slug" required className="w-full p-2 border rounded" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="prod-cat" className="block text-sm font-bold mb-1">Kategori</label>
                    <select id="prod-cat" required className="w-full p-2 border rounded" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                        <option value="">Pilih Kategori</option>
                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="prod-price" className="block text-sm font-bold mb-1">Harga</label>
                    <input id="prod-price" type="number" required className="w-full p-2 border rounded" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label htmlFor="prod-stock" className="block text-sm font-bold mb-1">Stok</label>
                    <input id="prod-stock" type="number" required className="w-full p-2 border rounded" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <label htmlFor="prod-desc" className="block text-sm font-bold mb-1">Deskripsi</label>
                    <textarea id="prod-desc" className="w-full p-2 border rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                </div>
                <div className="col-span-2 flex gap-4 mt-2">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">{editingId ? 'Update Produk' : 'Tambah Produk'}</button>
                    {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name:'',slug:'',category_id:'',price:'',stock:'',description:''})}} className="px-4 py-2 border rounded font-bold bg-gray-100">Batal</button>}
                </div>
            </form>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4">Nama</th><th className="p-4">Kategori</th><th className="p-4">Harga</th><th className="p-4">Stok</th><th className="p-4">Aksi</th></tr></thead>
                    <tbody>
                        {products?.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-4 font-bold text-sm max-w-[200px] truncate">{p.name}</td>
                                <td className="p-4 text-sm">{p.category?.name}</td>
                                <td className="p-4 text-red-600 font-bold">Rp {Number.parseInt(p.price, 10).toLocaleString('id-ID')}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4 flex gap-2">
                                    <button type="button" aria-label="Edit Produk" onClick={() => {setForm({name: p.name, slug: p.slug, category_id: p.category_id, price: p.price, stock: p.stock, description: p.description}); setEditingId(p.id);}} className="text-blue-500"><Edit size={18}/></button>
                                    <button type="button" aria-label="Hapus Produk" onClick={() => remove(p.id)} className="text-red-500"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
