import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${className}`}
    >
      {/* Product Image */}
      <div className="relative pt-[100%] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {product.discountPrice && (
          <Badge
            variant="danger"
            className="absolute top-3 left-3"
          >
            {calculateDiscount(product.price, product.discountPrice)}% OFF
          </Badge>
        )}
        
        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} shadow-md hover:scale-105 transition-all`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={inWishlist ? 'fill-white' : ''} />
          </button>
          
          <button
            onClick={handleAddToCart}
            className="py-2 px-3 bg-blue-600 text-white rounded-full shadow-md flex items-center space-x-1 hover:bg-blue-700 transition-colors hover:scale-105"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
            <span className="text-xs font-medium">Add to cart</span>
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        
        <div className="mb-2">
          <Rating value={product.rating} size="sm" />
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold text-blue-600">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;