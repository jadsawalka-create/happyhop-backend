require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const ammanVenues = [
  {
    name: "Lollihop Fun World",
    description: "Amman's largest indoor playground with over 2,000 sqm of fun — Volcano slides, trampoline jumping, ball shooting, and soft play areas all under one roof.",
    city: "Amman",
    location: "Naqib Omran Al-Maayetah Street, Sweifieh",
    capacity: 200,
    min_age: 2,
    max_age: 14,
    price_per_child: 8,
    image_url: "",
    is_active: true
  },
  {
    name: "Tala Kids Club",
    description: "A leading kids destination with three creative play zones — soft play & trampolines, sand play, and a slime zone. Located inside Baraka Mall.",
    city: "Amman",
    location: "Baraka Mall, Sweifieh",
    capacity: 100,
    min_age: 2,
    max_age: 12,
    price_per_child: 6,
    image_url: "",
    is_active: true
  },
  {
    name: "Children's Museum Jordan",
    description: "An interactive world-class museum with 150 indoor and outdoor exhibits, art studio, outdoor theater, and party rooms. Perfect for curious kids.",
    city: "Amman",
    location: "Abdoun, 4th Circle",
    capacity: 300,
    min_age: 2,
    max_age: 14,
    price_per_child: 7,
    image_url: "",
    is_active: true
  },
  {
    name: "Brickshouse LEGO Play",
    description: "Jordan's ultimate LEGO experience — three giant pools filled with LEGO and LEGO Duplo bricks, learning games, soft play area, and ball pool with slides.",
    city: "Amman",
    location: "Mecca Mall, Mecca Street",
    capacity: 120,
    min_age: 2,
    max_age: 10,
    price_per_child: 7,
    image_url: "",
    is_active: true
  },
  {
    name: "Tara Park",
    description: "A thrilling indoor play complex in Dabouq featuring giant challenging slides and a dedicated safe toddler area. Great for adventurous kids.",
    city: "Amman",
    location: "Dabouq District, Khilda",
    capacity: 150,
    min_age: 2,
    max_age: 12,
    price_per_child: 6,
    image_url: "",
    is_active: true
  },
  {
    name: "Wasabi Clubhouse",
    description: "A vibrant indoor soft-play haven designed for toddlers and preschoolers — colorful interiors, creative play zones, sensory-friendly areas, and cozy spaces.",
    city: "Amman",
    location: "The Promenade Mall, Airport Road",
    capacity: 80,
    min_age: 1,
    max_age: 6,
    price_per_child: 5,
    image_url: "",
    is_active: true
  },
  {
    name: "Jungle Zone Abdali",
    description: "A fun-packed kids zone at Abdali Boulevard featuring soft play, mini rides, and interactive games in the heart of downtown Amman.",
    city: "Amman",
    location: "Abdali Boulevard, Downtown",
    capacity: 120,
    min_age: 2,
    max_age: 10,
    price_per_child: 6,
    image_url: "",
    is_active: true
  },
  {
    name: "Fun City Mecca Mall",
    description: "A family entertainment center with rides, games, soft play, and an indoor rollercoaster — perfect for kids and teens of all ages.",
    city: "Amman",
    location: "Mecca Mall, Mecca Street",
    capacity: 250,
    min_age: 3,
    max_age: 16,
    price_per_child: 10,
    image_url: "",
    is_active: true
  },
  {
    name: "Little Stars Play Cafe",
    description: "A cozy kids play cafe in the heart of Shmisani — soft play area combined with a family-friendly cafe where parents can relax while kids play.",
    city: "Amman",
    location: "Shmisani, near Housing Bank Circle",
    capacity: 60,
    min_age: 1,
    max_age: 8,
    price_per_child: 5,
    image_url: "",
    is_active: true
  },
  {
    name: "Rainbow Kids Zone",
    description: "A colorful indoor play center in the heart of Khalda with slides, ball pits, climbing walls, and dedicated birthday party rooms.",
    city: "Amman",
    location: "Khalda District, University Road",
    capacity: 100,
    min_age: 2,
    max_age: 10,
    price_per_child: 6,
    image_url: "",
    is_active: true
  }
];

async function seedAmmanVenues() {
  console.log('🌱 Seeding Amman venues...');

  const { data, error } = await supabase
    .from('venues')
    .insert(ammanVenues)
    .select();

  if (error) {
    console.error('❌ Error seeding venues:', error.message);
    return;
  }

  console.log(`✅ Successfully added ${data.length} Amman venues!`);
  data.forEach(v => console.log(`  - ${v.name} (${v.location})`));
}

seedAmmanVenues();
