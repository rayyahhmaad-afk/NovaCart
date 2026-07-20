<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder {
    public function run(): void {
        $catSmartphone = Category::where('name', 'Smartphone')->first()->id;
        $catLaptop = Category::where('name', 'Laptop')->first()->id;
        $catAksesoris = Category::where('name', 'Aksesoris Komputer')->first()->id;
        $catKamera = Category::where('name', 'Kamera')->first()->id;
        $catTV = Category::where('name', 'Televisi')->first()->id;

        $products = [
            // Smartphone
            ['category_id' => $catSmartphone, 'name' => 'iPhone 15 Pro Max', 'price' => 24000000, 'stock' => 15, 'specs' => json_encode(['RAM' => '8GB', 'Storage' => '256GB', 'Processor' => 'A17 Pro'])],
            ['category_id' => $catSmartphone, 'name' => 'Samsung Galaxy S24 Ultra', 'price' => 22000000, 'stock' => 20, 'specs' => json_encode(['RAM' => '12GB', 'Storage' => '512GB', 'Processor' => 'Snapdragon 8 Gen 3'])],
            ['category_id' => $catSmartphone, 'name' => 'Google Pixel 8 Pro', 'price' => 17000000, 'stock' => 10, 'specs' => json_encode(['RAM' => '12GB', 'Storage' => '256GB', 'Processor' => 'Tensor G3'])],
            ['category_id' => $catSmartphone, 'name' => 'Xiaomi 14 Pro', 'price' => 14000000, 'stock' => 25, 'specs' => json_encode(['RAM' => '16GB', 'Storage' => '512GB', 'Processor' => 'Snapdragon 8 Gen 3'])],
            
            // Laptop
            ['category_id' => $catLaptop, 'name' => 'MacBook Pro M3 Max', 'price' => 55000000, 'stock' => 5, 'specs' => json_encode(['RAM' => '36GB', 'Storage' => '1TB SSD', 'Processor' => 'M3 Max'])],
            ['category_id' => $catLaptop, 'name' => 'Asus ROG Zephyrus G14', 'price' => 32000000, 'stock' => 8, 'specs' => json_encode(['RAM' => '32GB', 'Storage' => '1TB SSD', 'Processor' => 'Ryzen 9'])],
            ['category_id' => $catLaptop, 'name' => 'Lenovo ThinkPad X1 Carbon', 'price' => 28000000, 'stock' => 12, 'specs' => json_encode(['RAM' => '16GB', 'Storage' => '512GB SSD', 'Processor' => 'Intel Core i7'])],
            ['category_id' => $catLaptop, 'name' => 'Dell XPS 15', 'price' => 30000000, 'stock' => 7, 'specs' => json_encode(['RAM' => '16GB', 'Storage' => '1TB SSD', 'Processor' => 'Intel Core i9'])],
            
            // Aksesoris
            ['category_id' => $catAksesoris, 'name' => 'Logitech MX Master 3S', 'price' => 1500000, 'stock' => 50, 'specs' => json_encode(['DPI' => '8000', 'Connection' => 'Wireless / Bluetooth'])],
            ['category_id' => $catAksesoris, 'name' => 'Keychron Q1 Pro', 'price' => 3200000, 'stock' => 30, 'specs' => json_encode(['Type' => 'Mechanical', 'Switch' => 'Brown', 'Layout' => '75%'])],
            ['category_id' => $catAksesoris, 'name' => 'Sony WH-1000XM5', 'price' => 5000000, 'stock' => 18, 'specs' => json_encode(['Type' => 'Over-Ear', 'Feature' => 'ANC'])],
            ['category_id' => $catAksesoris, 'name' => 'Razer BlackShark V2', 'price' => 1800000, 'stock' => 40, 'specs' => json_encode(['Type' => 'Headset', 'Mic' => 'Detachable'])],
            
            // Kamera
            ['category_id' => $catKamera, 'name' => 'Sony A7 IV', 'price' => 35000000, 'stock' => 6, 'specs' => json_encode(['Sensor' => 'Full Frame 33MP', 'Video' => '4K 60fps'])],
            ['category_id' => $catKamera, 'name' => 'Canon EOS R6', 'price' => 38000000, 'stock' => 5, 'specs' => json_encode(['Sensor' => 'Full Frame 20MP', 'Video' => '4K 60fps'])],
            ['category_id' => $catKamera, 'name' => 'Fujifilm X-T5', 'price' => 28000000, 'stock' => 10, 'specs' => json_encode(['Sensor' => 'APS-C 40MP', 'Video' => '6.2K 30fps'])],
            ['category_id' => $catKamera, 'name' => 'GoPro Hero 12 Black', 'price' => 6500000, 'stock' => 30, 'specs' => json_encode(['Sensor' => 'Action Cam', 'Video' => '5.3K'])],
            
            // TV
            ['category_id' => $catTV, 'name' => 'LG OLED C3 55 Inch', 'price' => 21000000, 'stock' => 12, 'specs' => json_encode(['Panel' => 'OLED', 'Resolution' => '4K', 'Refresh Rate' => '120Hz'])],
            ['category_id' => $catTV, 'name' => 'Samsung Neo QLED 8K 65 Inch', 'price' => 45000000, 'stock' => 3, 'specs' => json_encode(['Panel' => 'Neo QLED', 'Resolution' => '8K', 'Refresh Rate' => '144Hz'])],
            ['category_id' => $catTV, 'name' => 'Sony Bravia XR OLED 65 Inch', 'price' => 35000000, 'stock' => 5, 'specs' => json_encode(['Panel' => 'OLED', 'Resolution' => '4K', 'Smart TV' => 'Google TV'])],
            ['category_id' => $catTV, 'name' => 'TCL Mini LED 4K 55 Inch', 'price' => 8500000, 'stock' => 20, 'specs' => json_encode(['Panel' => 'Mini LED', 'Resolution' => '4K', 'Smart TV' => 'Google TV'])],
        ];

        foreach ($products as $prod) {
            Product::create([
                'category_id' => $prod['category_id'],
                'name' => $prod['name'],
                'slug' => Str::slug($prod['name']),
                'description' => 'Deskripsi untuk ' . $prod['name'],
                'price' => $prod['price'],
                'stock' => $prod['stock'],
                'specs' => json_decode($prod['specs'], true)
            ]);
        }
    }
}
