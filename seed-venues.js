require('dotenv').config();
const supabase = require('./config/database');

const venues = [
  {
    name: 'Fun World Kids Zone',
    description: 'The ultimate indoor playground with slides, trampolines, and soft play areas for kids of all ages.',
    city: 'Riyadh',
    location: 'Al Olaya District, King Fahd Road',
    capacity: 200,
    min_age: 2,
    max_age: 12,
    price_per_child: 60,
    rating: 4.8,
    image_url: '',
    is_active: true
  },
  {
    name: 'Magic Castle Play',
    description: 'A fairy-tale themed play center with castle slides, ball pits, and a dedicated café for parents.',
    city: 'Riyadh',
    location: 'Al Nakheel District',
    capacity: 150,
    min_age: 1,
    max_age: 10,
    price_per_child: 50,
    rating: 4.6,
    image_url: '',
    is_active: true
  },
  {
    name: 'Ocean Play Center',
    description: 'Water-themed indoor play area with splash zones, wave pools, and water slides.',
    city: 'Riyadh',
    location: 'Al Malaz District',
    capacity: 180,
    min_age: 3,
    max_age: 14,
    price_per_child: 55,
    rating: 4.5,
    image_url: '',
    is_active: true
  },
  {
    name: 'Galaxy Gaming Zone',
    description: 'High-tech gaming and VR experience center for older kids and teens.',
    city: 'Riyadh',
    location: 'Al Sulimaniyah District',
    capacity: 100,
    min_age: 6,
    max_age: 16,
    price_per_child: 75,
    rating: 4.7,
    image_url: '',
    is_active: true
  },
  {
    name: 'Little Stars Play Hub',
    description: 'Cozy indoor play space designed for toddlers and young children with safe soft play equipment.',
    city: 'Jeddah',
    location: 'Al Hamra District',
    capacity: 80,
    min_age: 1,
    max_age: 6,
    price_per_child: 45,
    rating: 4.9,
    image_url: '',
    is_active: true
  },
  {
    name: 'Adventure Park Jeddah',
    description: 'Large adventure park with climbing walls, zip lines, and obstacle courses for active kids.',
    city: 'Jeddah',
    location: 'Al Corniche Road',
    capacity: 250,
    min_age: 4,
    max_age: 14,
    price_per_child: 80,
    rating: 4.7,
    image_url: '',
    is_active: true
  },
  {
    name: 'Rainbow Kids World',
    description: 'Colorful indoor play center with art workshops, role-play areas, and sensory play zones.',
    city: 'Dammam',
    location: 'Al Faisaliyah District',
    capacity: 120,
    min_age: 2,
    max_age: 10,
    price_per_child: 55,
    rating: 4.6,
    image_url: '',
    is_active: true
  },
  {
    name: 'Bounce Arena',
    description: 'Dedicated trampoline park with foam pits, dodgeball courts, and ninja warrior courses.',
    city: 'Riyadh',
    location: 'Al Yasmin District',
    capacity: 160,
    min_age: 4,
    max_age: 16,
    price_per_child: 70,
    rating: 4.8,
    image_url: '',
    is_active: true
  },
  {
    name: 'Mini World Play City',
    description: 'Role-play city where kids experience real-life careers as doctors, chefs, pilots, and more.',
    city: 'Riyadh',
    location: 'Riyadh Park Mall',
    capacity: 200,
    min_age: 3,
    max_age: 12,
    price_per_child: 65,
    rating: 4.9,
    image_url: '',
    is_active: true
  },
  {
    name: 'Splash & Play Waterpark',
    description: 'Indoor waterpark with slides, lazy river, and splash pad — fun all year round.',
    city: 'Jeddah',
    location: 'Al Rawdah District',
    capacity: 300,
    min_age: 3,
    max_age: 16,
    price_per_child: 90,
    rating: 4.5,
    image_url: '',
    is_active: true
  }
];

async function seedVenues() {
  console.log('🌱 Seeding venues...');

  // First delete the test venue we added earlier
  await supabase.from('venues').delete().eq('name', 'Jump Arena Riyadh');
  console.log('🗑️  Removed test venue');

  const { data, error } = await supabase
    .from('venues')
    .insert(venues)
    .select();

  if (error) {
    console.error('❌ Error seeding venues:', error.message);
    return;
  }

  console.log(`✅ Successfully added ${data.length} venues!`);
  data.forEach(v => console.log(`   - ${v.name} (${v.city})`));
  process.exit(0);
}

seedVenues();
