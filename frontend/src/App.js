// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeScreen from './components/Home/HomeScreen';
import ARView from './components/AR/ARView';
import LoadingScreen from './components/common/LoadingScreen';
import { BanubaProvider, useBanuba } from './context/BanubaContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { SetProvider } from "./context/SetContext";
import CartView from './components/Cart/CartView';
import { initGA, pageView } from './services/Analytics';
import BasketView from './components/Basket/BasketView';
import RecipientView from './components/Recipient/RecipientView';
import PaymentView from './components/Payment/PaymentView';
import ProfileView from "./components/Profile/ProfileView";

// This component handles initialization and loading state
const AppContent = () => {
  const { loading: isUserLoading } = useUser();
  const { isInitialized: isBanubaReady, initialize: initializeBanuba } = useBanuba();
  const { loading: isProductLoading } = useProducts();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const location = useLocation()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isBanubaReady) {
          await initializeBanuba();
        }

        if (!analyticsReady) {
          setAnalyticsReady(true)
          initGA()
        }

      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    initializeApp();
  }, [initializeBanuba, analyticsReady]);

  useEffect(() => {
    pageView(location.pathname)
  }, [location])

  // Show loading screen until both services are ready
  if (isUserLoading || !isBanubaReady || isProductLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/ar/:category" element={<ARView />} />
      <Route path="/cart" element={<CartView />} />
      <Route path="/basket" element={<BasketView />} />
      <Route path="/recipient" element={<RecipientView />} />
      <Route path="/payment" element={<PaymentView />} />
      <Route path="/my-sets" element={<ProfileView />} />
      <Route path="/referrals" element={<ProfileView />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <UserProvider>
        <BanubaProvider>
          <ProductProvider>
            <CartProvider>
              <SetProvider>
                <AppContent />
              </SetProvider>
            </CartProvider>
          </ProductProvider>
        </BanubaProvider>
      </UserProvider>
    </Router>
  );
};

export default App;