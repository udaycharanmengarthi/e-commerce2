import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Generate a random order ID
  const orderId = React.useMemo(() => {
    return `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }, []);
  
  // Redirect if not authenticated (shouldn't be able to reach this page otherwise)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <CheckCircle className="mx-auto mb-4 text-green-500 w-16 h-16" />
      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-xl mb-8">Thank you for your purchase.</p>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        <div className="border-b pb-3 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{orderId}</span>
          </div>
        </div>
        
        <div className="border-b pb-3 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="border-b pb-3 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">Credit Card (**** 1234)</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Address:</span>
            <span className="font-medium text-right">123 Main St, Anytown, CA 12345</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button variant="outline" leftIcon={<ShoppingBag size={18} />}>
            Continue Shopping
          </Button>
        </Link>
        <Link to="/account?tab=orders">
          <Button variant="primary">
            View Order History
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;