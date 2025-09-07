require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');

const items = [
  { title: 'Phone A', description: 'Nice phone', price: 299, category: 'Phones', images: ['/assets/phone.png'], stock: 50 },
  { title: 'Laptop B', description: 'Work laptop', price: 899, category: 'Laptops', images: ['/assets/laptop.png'], stock: 20 },
  { title: 'Headphones C', description: 'Wireless headphones with noise cancellation', price: 79, category: 'Accessories', images: ['/assets/headphones.png'], stock: 100 },
  { title: 'Charger D', description: 'Fast USB-C charger', price: 19, category: 'Accessories', images: ['/assets/charger.png'], stock: 200 },
  { title: 'Smartwatch E', description: 'Fitness smartwatch with heart rate monitor', price: 149, category: 'Wearables', images: ['/assets/smartwatch.png'], stock: 75 },
  { title: 'Tablet F', description: '10-inch Android tablet', price: 399, category: 'Tablets', images: ['/assets/tablet.png'], stock: 30 },
  { title: 'Gaming Mouse G', description: 'Ergonomic mouse with RGB lighting', price: 59, category: 'Accessories', images: ['/assets/mouse.png'], stock: 120 },
  { title: 'Keyboard H', description: 'Mechanical keyboard with backlight', price: 89, category: 'Accessories', images: ['/assets/keyboard.png'], stock: 90 },
  { title: 'Camera I', description: 'DSLR camera with 24MP sensor', price: 599, category: 'Cameras', images: ['/assets/camera.png'], stock: 15 },
  { title: 'TV J', description: '50-inch 4K Smart TV', price: 699, category: 'Electronics', images: ['/assets/tv.png'], stock: 25 },
  { title: 'Speaker K', description: 'Bluetooth portable speaker', price: 45, category: 'Audio', images: ['/assets/speaker.png'], stock: 150 },
  { title: 'Backpack L', description: 'Water-resistant laptop backpack', price: 35, category: 'Accessories', images: ['/assets/backpack.png'], stock: 85 }
];


mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Item.deleteMany({});
  await Item.insertMany(items);
  console.log('✅ Seeded items into database');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
