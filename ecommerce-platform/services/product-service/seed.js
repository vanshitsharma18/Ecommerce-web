const products = [
  {
    name: "ProMax Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation, 36hr battery life, and IPX5 water resistance. Premium sound with deep bass.",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=300&fit=crop",
    stock: 45
  },
  {
    name: "Urban Leather Jacket",
    description: "Genuine lambskin leather jacket with quilted lining. Classic biker style with modern fit.",
    price: 249.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    stock: 15
  },
  {
    name: "Titan Gaming Monitor 27\"",
    description: "27-inch QHD 165Hz IPS gaming monitor with 1ms response time, HDR400, and adjustable stand.",
    price: 349.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    stock: 20
  },
  {
    name: "Himalayan Pour-Over Coffee Set",
    description: "Hand-crafted ceramic pour-over dripper with double-wall glass carafe. Brews the perfect cup every time.",
    price: 54.99,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    stock: 30
  },
  {
    name: "Trail Runner X9",
    description: "All-terrain trail running shoes with Vibram sole, Gore-Tex waterproofing, and responsive cushioning.",
    price: 139.99,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    stock: 35
  },
  {
    name: "Minimalist Canvas Backpack",
    description: "Waxed canvas daypack with padded laptop sleeve, hidden anti-theft pocket, and YKK zippers.",
    price: 79.99,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    stock: 50
  },
  {
    name: "Smart Home Speaker Hub",
    description: "360° room-filling sound with built-in voice assistant, multi-room sync, and smart home control.",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop",
    stock: 25
  },
  {
    name: "Bamboo Yoga Block Set",
    description: "Set of 2 eco-friendly bamboo yoga blocks with cork grip. Naturally antimicrobial and durable.",
    price: 32.99,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    stock: 60
  },
  {
    name: "Polarized Aviator Shades",
    description: "Titanium frame aviator sunglasses with anti-glare polarized lenses. UV400 protection.",
    price: 64.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    stock: 40
  },
  {
    name: "Mechanical Keyboard V2",
    description: "Hot-swappable mechanical keyboard with PBT keycaps, per-key RGB, gasket mount, and dampening foam.",
    price: 119.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop",
    stock: 22
  },
  {
    name: "Cashmere Crew Sweater",
    description: "100% Grade-A Mongolian cashmere crew neck sweater. Ultra-soft with ribbed cuffs and hem.",
    price: 149.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=300&fit=crop",
    stock: 18
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Triple-insulated 32oz bottle keeps drinks cold 24hrs or hot 12hrs. Leak-proof lid with carrying loop.",
    price: 29.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    stock: 80
  }
];

async function seed() {
  const BASE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

  // Clear existing products
  console.log('Clearing existing products...');
  try {
    const res = await fetch(`${BASE}/api/products`);
    const existing = await res.json();
    // No delete endpoint, so we'll just add new ones
    if (existing.length > 0) {
      console.log(`Found ${existing.length} existing products (keeping them).`);
    }
  } catch (e) {
    // ignore
  }

  console.log(`Adding ${products.length} products...`);
  for (const p of products) {
    try {
      const res = await fetch(`${BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      console.log(`  ✓ ${data.name} — $${data.price}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${p.name} — ${err.message}`);
    }
  }
  console.log('Done!');
}

seed();
