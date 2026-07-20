<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@jd.id',
            'role' => 'admin',
        ]);
        \App\Models\User::factory()->create([
            'name' => 'Buyer User',
            'email' => 'buyer@jd.id',
            'role' => 'buyer',
        ]);

        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
