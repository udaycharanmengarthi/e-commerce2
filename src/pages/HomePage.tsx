import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { getFeaturedProducts, getCategories } from '../data/products';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();
  const categories = getCategories();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-24 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover Premium Tech For Your Lifestyle
            </h1>
            <p className="text-lg mb-8 text-blue-100 max-w-lg">
              Shop the latest and greatest in technology with exclusive deals on electronics, wearables, and accessories.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/category/audio">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Shop Now
                </Button>
              </Link>
              <Link to="/category/wearables">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Browse Trending
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <img 
              src="https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg" 
              alt="Modern technology" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link 
              to="/category/all" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} columns={4} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center group"
              >
                <div className="mb-4 flex justify-center">
                  {/* Icons would be better here, but using colored circles as placeholders */}
                  <div className={`w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors`}>
                    <span className="text-blue-600 font-semibold">{category[0]}</span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white overflow-hidden">
            <div className="md:flex">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">New Arrivals Weekly</h2>
                <p className="mb-6">Stay ahead of the curve with our latest tech products. Subscribe for early access to new arrivals.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="px-4 py-3 rounded-lg text-gray-900 flex-grow"
                  />
                  <Button
                    variant="primary"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <img 
                  src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg" 
                  alt="New tech products" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Johnson", text: "The checkout process was incredibly smooth, and my order arrived faster than expected. Fantastic service!" },
              { name: "Michael Chen", text: "I've been shopping here for years, and the quality and selection of products has consistently exceeded my expectations." },
              { name: "Emily Rodriguez", text: "Their customer service is outstanding. They helped me find the perfect laptop for my needs and budget." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;