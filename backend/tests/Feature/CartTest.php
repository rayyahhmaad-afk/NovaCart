<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_item_to_cart()
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

        $response = $this->actingAs($user)->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Produk berhasil ditambahkan ke keranjang']);
                 
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);
    }
}
