import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  cardNumber: string; // Last 4 digits only for storage
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

interface CheckoutContextType {
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  
  // Addresses
  addresses: Address[];
  selectedAddressId: string | null;
  addAddress: (address: Omit<Address, 'id'>) => void;
  selectAddress: (addressId: string) => void;
  
  // Payment methods
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string | null;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  selectPaymentMethod: (methodId: string) => void;
  
  // Order processing
  placeOrder: () => Promise<boolean>;
  orderProcessing: boolean;
  orderError: string | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Load saved addresses from localStorage
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('addresses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    return defaultAddress ? defaultAddress.id : null;
  });
  
  // Load saved payment methods from localStorage
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('paymentMethods');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(() => {
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    return defaultMethod ? defaultMethod.id : null;
  });
  
  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substring(2, 15)
    };
    
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    
    // If this is the first address, select it automatically
    if (addresses.length === 0) {
      setSelectedAddressId(newAddress.id);
    }
  };
  
  const selectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };
  
  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Math.random().toString(36).substring(2, 15)
    };
    
    const updatedMethods = [...paymentMethods, newMethod];
    setPaymentMethods(updatedMethods);
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    
    // If this is the first payment method, select it automatically
    if (paymentMethods.length === 0) {
      setSelectedPaymentId(newMethod.id);
    }
  };
  
  const selectPaymentMethod = (methodId: string) => {
    setSelectedPaymentId(methodId);
  };
  
  const placeOrder = async (): Promise<boolean> => {
    setOrderProcessing(true);
    setOrderError(null);
    
    try {
      // Validate required data
      if (!selectedAddressId) {
        throw new Error('Please select a shipping address');
      }
      
      if (!selectedPaymentId) {
        throw new Error('Please select a payment method');
      }
      
      // Simulate API call to process order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful order
      clearCart();
      
      // Reset checkout state
      setCurrentStep('cart');
      
      // Navigate to success page
      navigate('/order-success');
      
      setOrderProcessing(false);
      return true;
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'An error occurred while placing your order');
      setOrderProcessing(false);
      return false;
    }
  };
  
  return (
    <CheckoutContext.Provider
      value={{
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
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};