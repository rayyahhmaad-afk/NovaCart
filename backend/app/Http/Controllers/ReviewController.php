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

        $order = Order::where('id', $request->order_id)
                      ->where('user_id', $user->id)
                      ->first();
                      
        $errorMessage = null;
        $errorCode = 403;

        if (!$order) {
            $errorMessage = 'Order not found or not yours';
            $errorCode = 404;
        } elseif ($order->status !== 'completed') {
            $errorMessage = 'Order must be completed to leave a review';
        } elseif (!$order->items()->where('product_id', $request->product_id)->exists()) {
            $errorMessage = 'Product not found in this order';
        } elseif (Review::where('order_id', $request->order_id)->where('product_id', $request->product_id)->where('user_id', $user->id)->exists()) {
            $errorMessage = 'You have already reviewed this product for this order';
        }

        if ($errorMessage) {
            return response()->json(['message' => $errorMessage], $errorCode);
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
