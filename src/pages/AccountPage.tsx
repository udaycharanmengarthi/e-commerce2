import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCheckout, Address, PaymentMethod } from '../context/CheckoutContext';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import { User, Package, CreditCard, LogOut, MapPin, Trash2, Plus } from 'lucide-react';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { addresses, paymentMethods } = useCheckout();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'payments'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=account');
    }
  }, [isAuthenticated, navigate]);
  
  React.useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, phone: user.phone || '' });
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your account.
          </p>
          <Button
            onClick={() => navigate('/login?redirect=account')}
            variant="primary"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard size={18} /> }
  ];
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: editForm.name,
          phone: editForm.phone || null
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      // Note: In a real app, you might want to refetch the user data
      setIsEditing(false);
      
      // Reload the page to get updated user data
      window.location.reload();

      if (error) {
        throw error;
      }

      // Update local user state
      // Note: In a real app, you might want to refetch the user data
      setIsEditing(false);
      
      // Reload the page to get updated user data
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center p-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold text-lg">{user.name[0]}</span>
              </div>
              <div>
                <h2 className="font-medium">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-4 py-3 rounded-md text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                
                {!isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={user.phone || 'Not provided'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex space-x-3">
                      <Button 
                        type="submit" 
                        variant="primary"
                        isLoading={updateLoading}
                        disabled={updateLoading}
                      >
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: user.name, phone: user.phone || '' });
                        }}
                        disabled={updateLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't placed any orders yet.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="primary"
                  >
                    Start Shopping
                  </Button>
                </div>
              </div>
            )}
            
            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{address.name}</p>
                          {address.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.country}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.phone}
                        </p>
                        
                        <div className="mt-3 flex justify-end space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Edit
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-700">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
                      <Plus size={24} className="mb-2" />
                      <span>Add New Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't saved any addresses yet.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/checkout')}
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Saved Payment Methods</h2>
                
                {paymentMethods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">
                            {payment.type === 'credit' ? 'Credit Card' : 'Debit Card'}
                          </p>
                          {payment.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {payment.cardNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.cardHolder}
                        </p>
                        <p className="text-sm text-gray-600">
                          Expires: {payment.expiryMonth}/{payment.expiryYear}
                        </p>
                        
                        <div className="mt-3 flex justify-end space-x-2">
                          <button className="text-sm text-red-600 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
                      <Plus size={24} className="mb-2" />
                      <span>Add New Payment Method</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment methods saved</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't saved any payment methods yet.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/checkout')}
                    >
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;