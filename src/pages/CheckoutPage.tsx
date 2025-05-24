import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCheckout, Address, PaymentMethod, CheckoutStep } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';
import { CheckCircle, Circle, ChevronRight, MapPin, CreditCard, FileText, Truck, ShoppingBag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Address form schema
const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional()
});

// Payment form schema
const paymentSchema = z.object({
  type: z.enum(['credit', 'debit']),
  cardNumber: z.string().min(16, 'Valid card number is required').max(19),
  cardHolder: z.string().min(2, 'Cardholder name is required'),
  expiryMonth: z.string().min(2, 'Month is required'),
  expiryYear: z.string().min(2, 'Year is required'),
  cvv: z.string().min(3, 'CVV is required'),
  isDefault: z.boolean().optional()
});

type AddressFormData = z.infer<typeof addressSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const {
    currentStep,
    setCurrentStep,
    addresses,
    selectedAddressId,
    addAddress,
    selectAddress,
    paymentMethods,
    selectedPaymentId,
    addPaymentMethod,
    selectPaymentMethod,
    placeOrder,
    orderProcessing,
    orderError
  } = useCheckout();
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Setup forms
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    }
  });
  
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: 'credit',
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    }
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep === 'cart') {
      navigate('/');
    }
  }, [items, navigate, currentStep]);
  
  const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { id: 'cart', label: 'Cart', icon: <ShoppingBag size={18} /> },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={18} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} /> },
    { id: 'review', label: 'Review', icon: <FileText size={18} /> }
  ];
  
  // Calculate current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  const handleAddressSubmit = (data: AddressFormData) => {
    addAddress(data);
    setShowAddressForm(false);
  };
  
  const handlePaymentSubmit = (data: PaymentFormData) => {
    // In a real app, we would tokenize the card here
    // For demo, we'll store only last 4 digits
    const last4 = data.cardNumber.slice(-4);
    const maskedNumber = '**** **** **** ' + last4;
    
    addPaymentMethod({
      ...data,
      cardNumber: maskedNumber
    });
    
    setShowPaymentForm(false);
  };
  
  const handleContinue = () => {
    const nextStep = steps[currentStepIndex + 1]?.id;
    if (nextStep) {
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    const prevStep = steps[currentStepIndex - 1]?.id;
    if (prevStep) {
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePlaceOrder = async () => {
    const success = await placeOrder();
    if (success) {
      clearCart();
    }
  };
  
  // Calculate summary values
  const shipping = 0; // Free shipping for this demo
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center space-y-2"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStepIndex
                    ? 'bg-green-500 text-white'
                    : index === currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle size={16} />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs text-center font-medium">{step.label}</span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main checkout form area */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Cart Step */}
            {currentStep === 'cart' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Your Items</h2>
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item.product.id} className="py-4 flex">
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatPrice(
                            (item.product.discountPrice || item.product.price) * item.quantity
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
                
                {!showAddressForm ? (
                  <div>
                    {addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedAddressId === address.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                            onClick={() => selectAddress(address.id)}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 pt-1">
                                {selectedAddressId === address.id ? (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium">{address.name}</p>
                                <p className="text-sm text-gray-500">
                                  {address.street}, {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {address.country}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {address.phone}
                                </p>
                                {address.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-2 inline-block">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center mt-4"
                        >
                          <MapPin size={16} className="mr-1" />
                          Add a new address
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No addresses yet</h3>
                        <p className="text-gray-500 mb-4">
                          Add a shipping address to continue with your order.
                        </p>
                        <Button
                          onClick={() => setShowAddressForm(true)}
                          variant="primary"
                        >
                          Add Address
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...addressForm.register('name')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          {...addressForm.register('phone')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="street"
                          {...addressForm.register('street')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.street && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.street.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          {...addressForm.register('city')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          {...addressForm.register('state')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          {...addressForm.register('zipCode')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.zipCode.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          {...addressForm.register('country')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {addressForm.formState.errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {addressForm.formState.errors.country.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...addressForm.register('isDefault')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save Address
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Payment Method</h2>
                
                {!showPaymentForm ? (
                  <div>
                    {paymentMethods.length > 0 ? (
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedPaymentId === method.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                            onClick={() => selectPaymentMethod(method.id)}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 pt-1">
                                {selectedPaymentId === method.id ? (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium">{method.type === 'credit' ? 'Credit Card' : 'Debit Card'}</p>
                                <p className="text-sm text-gray-500">
                                  {method.cardNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {method.cardHolder} • Expires {method.expiryMonth}/{method.expiryYear}
                                </p>
                                {method.isDefault && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-2 inline-block">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => setShowPaymentForm(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center mt-4"
                        >
                          <CreditCard size={16} className="mr-1" />
                          Add a new payment method
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No payment methods yet</h3>
                        <p className="text-gray-500 mb-4">
                          Add a payment method to continue with your order.
                        </p>
                        <Button
                          onClick={() => setShowPaymentForm(true)}
                          variant="primary"
                        >
                          Add Payment Method
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Type
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="credit"
                              {...paymentForm.register('type')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Credit Card</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="debit"
                              {...paymentForm.register('type')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Debit Card</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          {...paymentForm.register('cardNumber')}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {paymentForm.formState.errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {paymentForm.formState.errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          {...paymentForm.register('cardHolder')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {paymentForm.formState.errors.cardHolder && (
                          <p className="mt-1 text-sm text-red-600">
                            {paymentForm.formState.errors.cardHolder.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <div className="flex space-x-3">
                          <div className="w-1/2">
                            <select
                              {...paymentForm.register('expiryMonth')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0');
                                return (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                );
                              })}
                            </select>
                            {paymentForm.formState.errors.expiryMonth && (
                              <p className="mt-1 text-sm text-red-600">
                                {paymentForm.formState.errors.expiryMonth.message}
                              </p>
                            )}
                          </div>
                          <div className="w-1/2">
                            <select
                              {...paymentForm.register('expiryYear')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString();
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                            {paymentForm.formState.errors.expiryYear && (
                              <p className="mt-1 text-sm text-red-600">
                                {paymentForm.formState.errors.expiryYear.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          {...paymentForm.register('cvv')}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {paymentForm.formState.errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">
                            {paymentForm.formState.errors.cvv.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...paymentForm.register('isDefault')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Save this card for future purchases</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPaymentForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save Payment Method
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {/* Review Step */}
            {currentStep === 'review' && (
              <div>
                <h2 className="text-lg font-bold mb-4">Review Your Order</h2>
                
                {/* Shipping Address */}
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Truck size={16} className="mr-2" />
                    Shipping Address
                  </h3>
                  {selectedAddressId && addresses.length > 0 ? (
                    <div className="text-sm">
                      {(() => {
                        const address = addresses.find(addr => addr.id === selectedAddressId);
                        if (!address) return null;
                        
                        return (
                          <>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-gray-600">
                              {address.street}, {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            <p className="text-gray-600 mt-1">{address.phone}</p>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">Please select a shipping address</p>
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <CreditCard size={16} className="mr-2" />
                    Payment Method
                  </h3>
                  {selectedPaymentId && paymentMethods.length > 0 ? (
                    <div className="text-sm">
                      {(() => {
                        const method = paymentMethods.find(m => m.id === selectedPaymentId);
                        if (!method) return null;
                        
                        return (
                          <>
                            <p className="font-medium">
                              {method.type === 'credit' ? 'Credit Card' : 'Debit Card'}
                            </p>
                            <p className="text-gray-600">{method.cardNumber}</p>
                            <p className="text-gray-600">
                              {method.cardHolder} • Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">Please select a payment method</p>
                  )}
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <ShoppingBag size={16} className="mr-2" />
                    Order Items ({totalItems})
                  </h3>
                  <ul className="divide-y">
                    {items.map((item) => (
                      <li key={item.product.id} className="py-3 flex">
                        <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <p className="text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(
                              (item.product.discountPrice || item.product.price) * item.quantity
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Error display */}
                {orderError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {orderError}
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStepIndex > 0 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep !== 'review' ? (
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  disabled={
                    (currentStep === 'shipping' && !selectedAddressId) ||
                    (currentStep === 'payment' && !selectedPaymentId)
                  }
                >
                  Continue
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddressId || !selectedPaymentId || orderProcessing}
                  isLoading={orderProcessing}
                >
                  Place Order
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;