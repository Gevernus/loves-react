// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/Home/HomeScreen';
import ARView from './components/AR/ARView';
import LoadingScreen from './components/common/LoadingScreen';
import { ARProvider } from './context/ARContext';
import { BanubaProvider, useBanuba } from './context/BanubaContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import CartView from './components/Cart/CartView';

// This component handles initialization and loading state
const AppContent = () => {
  const { loading: isUserLoading } = useUser();
  const { isInitialized: isBanubaReady, initialize: initializeBanuba } = useBanuba();
  const { loading: isProductLoading, refresh } = useProducts();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isBanubaReady) {
          await initializeBanuba();
        }

        if (!isProductLoading) {
          await refresh();
        }

      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    initializeApp();
  }, [initializeBanuba]);

  // Show loading screen until both services are ready
  if (isUserLoading || !isBanubaReady || isProductLoading) {
    return <LoadingScreen />;
  }

  return (
    <ARProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/ar/:category" element={<ARView />} />
        <Route path="/cart" element={<CartView />} />
      </Routes>
    </ARProvider>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <BanubaProvider>
          <ProductProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </ProductProvider>
        </BanubaProvider>
      </UserProvider>
    </Router>
  );
};

export default App;