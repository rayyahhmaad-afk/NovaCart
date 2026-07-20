<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::with('user')->where('product_id', $productId)->latest()->get();
        $averageRating = $reviews->avg('rating');
        
        return response()->json([
            'success' => true,
            'data' => $reviews,
            'average_rating' => $averageRating ? round($averageRating, 1) : 0,
            'total_reviews' => $reviews->count()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $user = $request->user();

        // 1. Check if order belongs to user and is completed (diterima)
        $order = Order::where('id', $request->order_id)
                      ->where('user_id', $user->id)
                      ->first();
                      
        if (!$order) {
            return response()->json(['message' => 'Order not found or not yours'], 404);
        }

        if ($order->status !== 'completed') {
            return response()->json(['message' => 'Order must be completed to leave a review'], 403);
        }

        // 2. Check if product is actually in this order
        $productInOrder = $order->items()->where('product_id', $request->product_id)->exists();
        if (!$productInOrder) {
            return response()->json(['message' => 'Product not found in this order'], 403);
        }

        // 3. Check if user already reviewed this product for this specific order
        $existingReview = Review::where('order_id', $request->order_id)
                                ->where('product_id', $request->product_id)
                                ->where('user_id', $user->id)
                                ->first();
                                
        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this product for this order'], 403);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => $review
        ], 201);
    }
}
