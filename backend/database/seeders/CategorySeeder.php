<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder {
    public function run(): void {
        $categories = [
            ['name' => 'Smartphone', 'description' => 'Berbagai macam smartphone terbaru.'],
            ['name' => 'Laptop', 'description' => 'Laptop untuk gaming, produktivitas, dan harian.'],
            ['name' => 'Aksesoris Komputer', 'description' => 'Mouse, Keyboard, Headset, dll.'],
            ['name' => 'Kamera', 'description' => 'Kamera DSLR, Mirrorless, dan Aksesorisnya.'],
            ['name' => 'Televisi', 'description' => 'Smart TV resolusi tinggi.']
        ];
        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'description' => $cat['description']
            ]);
        }
    }
}
