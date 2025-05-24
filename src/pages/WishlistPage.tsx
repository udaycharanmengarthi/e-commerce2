import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';

const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  
  // Get full product details for each wishlist item
  const wishlistProducts = items
    .map(item => {
      const product = getProductById(item.productId);
      return product ? { product } : null;
    })
    .filter(item => item !== null) as { product: ReturnType<typeof getProductById> }[];
  
  const handleAddToCart = (productId: string) => {
    const product = getProductById(productId);
    if (product) {
      addItem(product, 1);
    }
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };
  
  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <Heart className="mx-auto mb-4 text-gray-400" size={64} />
        <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-gray-600 mb-8">
          Save items you're interested in by clicking the heart icon on any product.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Wishlist ({wishlistProducts.length} items)</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={clearWishlist}
        >
          Clear Wishlist
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {wishlistProducts.map(({ product }) => (
            <li key={product?.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                {/* Product image */}
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={product?.images[0]}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Product details */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <Link
                        to={`/products/${product?.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
                        {product?.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {product?.category}
                      </p>
                    </div>
                    
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-lg font-medium text-blue-600">
                        {formatPrice(product?.discountPrice || product?.price || 0)}
                      </p>
                      {product?.discountPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(product?.price || 0)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="text-sm text-gray-500 mb-3 sm:mb-0">
                      {product?.stock && product.stock > 0
                        ? `In Stock (${product.stock} available)`
                        : 'Out of Stock'}
                    </p>
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 size={16} />}
                        onClick={() => handleRemoveFromWishlist(product?.id || '')}
                      >
                        Remove
                      </Button>
                      
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<ShoppingCart size={16} />}
                        onClick={() => handleAddToCart(product?.id || '')}
                        disabled={!product?.stock || product.stock <= 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Link to="/">
          <Button variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;