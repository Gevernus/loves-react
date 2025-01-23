// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeScreen from './components/Home/HomeScreen';
import ARView from './components/AR/ARView';
import LoadingScreen from './components/common/LoadingScreen';
import { BanubaProvider, useBanuba } from './context/BanubaContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { useSetContext } from './context/SetContext';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { SetProvider } from "./context/SetContext";
import { UploadProvider } from "./context/UploadContext";
import CartView from './components/Cart/CartView';
import { initGA, pageView } from './services/Analytics';
import BasketView from './components/Basket/BasketView';
import RecipientView from './components/Recipient/RecipientView';
import PaymentView from './components/Payment/PaymentView';
import ProfileView from "./components/Profile/ProfileView";
import BonusesView from "./components/Profile/BonusesView";
import { useNavigate } from "react-router-dom";
import WebApp from '@twa-dev/sdk';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
// This component handles initialization and loading state
const AppContent = () => {
  const navigate = useNavigate();
  const { loading: isUserLoading } = useUser();
  const { isInitialized: isBanubaReady, initialize: initializeBanuba } = useBanuba();
  const { loading: isProductLoading, getCategoryById } = useProducts();
  const { setSelectedProducts } = useSetContext();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const location = useLocation()

  useEffect(() => {
    const initializeApp = async () => {
      try {

        if (!isBanubaReady) {
          console.log('Trying to init banuba');
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

  useEffect(() => {
    const handleStartParam = async () => {
      if (!isBanubaReady) return;
      const startParam = WebApp.initDataUnsafe?.start_param;
      if (startParam && isBanubaReady) {
        try {
          const response = await fetch(`${apiUrl}/share-links/${startParam}`);
          if (!response.ok) {
            throw new Error('Failed to fetch share link');
          }

          const data = await response.json();
          if (data.selectedProducts && data.selectedProducts.length > 0) {
            // Set the selected products
            setSelectedProducts(data.selectedProducts);

            // Get the category of the last product for navigation
            const lastProduct = data.selectedProducts[data.selectedProducts.length - 1];
            const category = getCategoryById(lastProduct.productId);
            navigate(`/ar/${category}`);
          }
        } catch (error) {
          console.error('Error processing share link:', error);
        }
      }
    };

    handleStartParam();
  }, [isBanubaReady]);

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
      <Route path="/bonuses" element={<BonusesView />} />
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
                <UploadProvider>
                  <AppContent />
                </UploadProvider>                
              </SetProvider>
            </CartProvider>
          </ProductProvider>
        </BanubaProvider>
      </UserProvider>
    </Router>
  );
};

export default App;