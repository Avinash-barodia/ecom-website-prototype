import React, { useEffect, useState } from 'react';
import { fetchItems } from '../services/items';
import { addToCart } from '../services/cart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Slider from 'react-slick';

export default function ItemsPage({ user }) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: '', minPrice: '', maxPrice: '', sort: '' });
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState({}); // track loading per item
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await fetchItems(filters);
      setItems(data.items);
    } catch (err) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(item) {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to add items to cart');
      navigate('/login');
      return;
    }

    setCartLoading(prev => ({ ...prev, [item._id]: true }));

    try {
      await addToCart(item._id, 1);
      toast.success(`${item.title} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add item to cart');
    } finally {
      setCartLoading(prev => ({ ...prev, [item._id]: false }));
    }
  }

  async function applyFilters(e) {
    e?.preventDefault();
    await load();
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="lg:w-1/4 bg-white p-6 rounded-2xl shadow sticky top-4 h-fit">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <form onSubmit={applyFilters} className="space-y-4">
          <input placeholder="Search..." value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))} className="w-full p-2 border rounded focus:ring focus:ring-indigo-200" />
          <input placeholder="Category" value={filters.category} onChange={e=>setFilters(f=>({...f,category:e.target.value}))} className="w-full p-2 border rounded focus:ring focus:ring-indigo-200" />
          <div className="flex gap-2">
            <input placeholder="Min" type="number" value={filters.minPrice} onChange={e=>setFilters(f=>({...f,minPrice:e.target.value}))} className="w-1/2 p-2 border rounded focus:ring focus:ring-indigo-200" />
            <input placeholder="Max" type="number" value={filters.maxPrice} onChange={e=>setFilters(f=>({...f,maxPrice:e.target.value}))} className="w-1/2 p-2 border rounded focus:ring focus:ring-indigo-200" />
          </div>
          <select value={filters.sort} onChange={e=>setFilters(f=>({...f,sort:e.target.value}))} className="w-full p-2 border rounded focus:ring focus:ring-indigo-200">
            <option value="">Sort</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Apply</button>
        </form>
      </aside>

      {/* Items */}
      <section className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-xl shadow h-60"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No items found 🛒</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(it => (
              <div key={it._id} className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col">
                
                {/* Image Carousel */}
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {it.images?.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {it.images.map((img, idx) => (
                        <div key={idx} className="h-40 flex items-center justify-center">
                          <img src={img} alt={it.title} className="object-contain w-full h-40" />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <span className="text-gray-400 flex items-center justify-center h-full">No Image</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-lg">{it.title}</h3>
                  <p className="text-sm text-gray-500">{it.category}</p>
                  <p className="mt-2 font-semibold text-indigo-600 text-lg">₹{it.price}</p>
                </div>

                <div className="mt-4">
                  <button 
                    onClick={()=>handleAdd(it)} 
                    className={`w-full py-2 rounded-lg text-white transition ${cartLoading[it._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={cartLoading[it._id]}
                  >
                    {cartLoading[it._id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
