import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <ShoppingBag className="mx-auto mb-4 text-gray-400" size={64} />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet.
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
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart ({totalItems} items)</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.product.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product image */}
                    <div className="mb-4 sm:mb-0 sm:mr-6">
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Product details */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <Link
                            to={`/products/${item.product.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Category: {item.product.category}
                          </p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-lg font-medium text-blue-600">
                            {formatPrice(item.product.discountPrice || item.product.price)}
                          </p>
                          {item.product.discountPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.price)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        {/* Quantity controls */}
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="mt-2 sm:mt-0 text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Link to="/">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Estimated Total</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(subtotal)}
                </span>
              </div>
              
              <Link to="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;