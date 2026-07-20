<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // === DASHBOARD ===
    public function dashboard()
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_price');
        
        $topProducts = Product::withSum('orderItems as sales', 'quantity')
            ->orderByDesc('sales')->take(5)->get();

        return response()->json([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'top_products' => $topProducts
        ]);
    }

    // === ORDERS ===
    public function getOrders()
    {
        $orders = Order::with(['user', 'items.product'])->latest()->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,completed,cancelled']);
        
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

    // === CATEGORIES ===
    public function getCategories()
    {
        return response()->json(Category::all());
    }

    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required', 'slug' => 'required|unique:categories']);
        $category = Category::create($request->all());
        return response()->json($category);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    // === PRODUCTS ===
    public function getProducts()
    {
        return response()->json(Product::with('category')->get());
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required',
            'slug' => 'required|unique:products',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'description' => 'nullable'
        ]);
        $product = Product::create($request->all());
        return response()->json($product);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    public function deleteProduct($id)
    {
        Product::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
