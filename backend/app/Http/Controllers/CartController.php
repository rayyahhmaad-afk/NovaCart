<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cart->load(['items.product.images']);
        return response()->json($cart);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok tidak mencukupi'], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        
        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($product->stock < $newQuantity) {
                return response()->json(['message' => 'Stok tidak mencukupi untuk tambahan ini'], 400);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = CartItem::whereHas('cart', function($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->findOrFail($id);

        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['message' => 'Stok tidak mencukupi'], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Kuantitas berhasil diupdate']);
    }

    public function remove(Request $request, $id)
    {
        $cartItem = CartItem::whereHas('cart', function($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->findOrFail($id);
        
        $cartItem->delete();

        return response()->json(['message' => 'Produk dihapus dari keranjang']);
    }
}
