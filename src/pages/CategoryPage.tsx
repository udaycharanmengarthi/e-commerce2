import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { filterProducts, getCategories } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Product } from '../types';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const allCategories = getCategories();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Initialize filters when category changes
  useEffect(() => {
    if (categoryName) {
      setSelectedCategories(
        categoryName.toLowerCase() === 'all' 
          ? [] 
          : [categoryName.toLowerCase()]
      );
    }
  }, [categoryName]);

  // Apply filters and update products
  useEffect(() => {
    const filtered = filterProducts({
      categories: selectedCategories,
      priceRange,
      inStock: inStockOnly,
      sortBy: sortOrder
    });
    setFilteredProducts(filtered);
  }, [selectedCategories, priceRange, inStockOnly, sortOrder]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const categoryLower = category.toLowerCase();
      if (prev.includes(categoryLower)) {
        return prev.filter(c => c !== categoryLower);
      } else {
        return [...prev, categoryLower];
      }
    });
  };
  
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      const newRange = [...priceRange] as [number, number];
      newRange[index] = value;
      setPriceRange(newRange);
    }
  };
  
  const formatCategoryName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  const displayName = categoryName ? formatCategoryName(categoryName) : 'All Products';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{displayName}</h1>
      
      {/* Filters and sort row */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="mb-4 md:mb-0 flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors md:hidden"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters
          <ChevronDown
            size={16}
            className={`ml-1 transform transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row -mx-4">
        {/* Filters sidebar */}
        <div
          className={`md:w-1/4 px-4 mb-6 md:mb-0 ${
            filtersOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-medium text-lg mb-4">Filters</h2>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3">Price Range</h3>
              <div className="flex items-center mb-3">
                <span className="text-gray-600 text-sm mr-2">$</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-24 py-1 px-2 border border-gray-300 rounded-md text-sm"
                  min="0"
                  max={priceRange[1]}
                />
                <span className="mx-2 text-gray-500">to</span>
                <span className="text-gray-600 text-sm mr-2">$</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-24 py-1 px-2 border border-gray-300 rounded-md text-sm"
                  min={priceRange[0]}
                />
              </div>
              
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full mb-2"
              />
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full"
              />
            </div>
            
            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-3">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category.toLowerCase())}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Availability Filter */}
            <div>
              <h3 className="font-medium text-sm mb-3">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="in-stock"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="md:w-3/4 px-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={3} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;