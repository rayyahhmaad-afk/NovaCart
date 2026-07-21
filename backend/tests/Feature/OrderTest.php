<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_checkout_cart()
    {
        $user = User::factory()->create();
        
        $category = Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'slug' => 'test-product',
            'description' => 'Test',
            'price' => 10000,
            'stock' => 10,
        ]);

        $this->actingAs($user)->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($user)->postJson('/api/checkout', [
            'shipping_address' => '123 Test St',
            'payment_method' => 'transfer',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Checkout berhasil']);
                 
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_price' => 20000,
            'shipping_address' => '123 Test St',
        ]);
    }
}
