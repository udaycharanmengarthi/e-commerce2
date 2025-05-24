import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { getProductById, products } from '../data/products';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RelatedProducts from '../components/product/RelatedProducts';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = productId ? getProductById(productId) : undefined;
  
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }
  
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex < product.images.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : product.images.length - 1
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row -mx-4">
        {/* Product Images */}
        <div className="lg:w-1/2 px-4 mb-8 lg:mb-0">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4 aspect-square">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-800 hover:text-blue-600 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-800 hover:text-blue-600 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="flex -mx-1 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`mx-1 rounded-md overflow-hidden flex-shrink-0 w-16 h-16 border-2 ${
                    currentImageIndex === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="lg:w-1/2 px-4">
          <div className="mb-2">
            <Badge variant="secondary" size="sm">
              {product.category}
            </Badge>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <Rating value={product.rating} showCount reviewCount={product.reviewCount} size="md" />
          </div>
          
          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600 mr-3">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          
          {/* Stock status */}
          <div className="mb-6">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShoppingCart size={20} />}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            
            <Button
              onClick={handleWishlistToggle}
              variant={inWishlist ? 'danger' : 'outline'}
              size="lg"
              leftIcon={<Heart size={20} className={inWishlist ? 'fill-current' : ''} />}
            >
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          
          {/* Product Features */}
          <div className="border-t border-b py-4 mb-8">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Truck className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <span className="text-sm text-gray-700">Free shipping on orders over $50</span>
              </li>
              <li className="flex items-start">
                <Shield className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <span className="text-sm text-gray-700">2-year warranty included</span>
              </li>
              <li className="flex items-start">
                <RotateCcw className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <span className="text-sm text-gray-700">30-day money-back guarantee</span>
              </li>
            </ul>
          </div>
          
          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        category={product.category}
        products={products}
      />
    </div>
  );
};

export default ProductDetailPage;