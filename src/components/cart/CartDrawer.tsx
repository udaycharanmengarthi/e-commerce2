import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  
  if (!isCartOpen) return null;
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="mr-2 text-blue-600" size={20} />
                <h2 className="text-lg font-semibold">Your Cart ({totalItems})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Cart items */}
            <div className="flex-grow overflow-y-auto py-2">
              {items.length > 0 ? (
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.product.id} className="px-4 py-3 flex">
                      {/* Product image */}
                      <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Product details */}
                      <div className="ml-3 flex-grow">
                        <Link
                          to={`/products/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        
                        <p className="mt-1 text-sm font-medium text-blue-600">
                          {formatPrice(item.product.discountPrice || item.product.price)}
                        </p>
                        
                        {/* Quantity controls */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-2 py-1 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-500 hover:text-red-600 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 text-gray-400" size={40} />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    variant="primary"
                    size="md"
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 mb-4">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium">Calculated at checkout</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Button
                      variant="outline"
                      fullWidth
                    >
                      View Cart
                    </Button>
                  </Link>
                  
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Button
                      variant="primary"
                      fullWidth
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;