import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CheckoutProvider } from './context/CheckoutContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CheckoutProvider>
              <Routes>
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/products/:productId" element={<Layout><ProductDetailPage /></Layout>} />
                <Route path="/category/:categoryName" element={<Layout><CategoryPage /></Layout>} />
                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account" element={<Layout><AccountPage /></Layout>} />
                <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
                <Route path="/order-success" element={<Layout><OrderSuccessPage /></Layout>} />
                <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
              </Routes>
            </CheckoutProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;