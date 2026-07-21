<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{slug}', [ProductController::class, 'show']);
    Route::get('/{id}/reviews', [ReviewController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
    
    Route::post('/reviews', [ReviewController::class, 'store']);
});

// Admin Routes
Route::middleware(['auth:sanctum', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    Route::get('/orders', [AdminController::class, 'getOrders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    
    Route::prefix('categories')->group(function () {
        Route::get('/', [AdminController::class, 'getCategories']);
        Route::post('/', [AdminController::class, 'storeCategory']);
        Route::put('/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/{id}', [AdminController::class, 'deleteCategory']);
    });
    
    Route::prefix('products')->group(function () {
        Route::get('/', [AdminController::class, 'getProducts']);
        Route::post('/', [AdminController::class, 'storeProduct']);
        Route::put('/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/{id}', [AdminController::class, 'deleteProduct']);
    });
});
