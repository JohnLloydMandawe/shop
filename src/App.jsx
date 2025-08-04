import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import './App.css'; // ✅ Import the CSS

function App() {
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app-body">
         <header className="app-header">
          <div className="nav-links">
            <Link to="/"> Home</Link>
            <Link to="/Cart"> 🛒 Add Cart</Link>
          </div>
        </header>


          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProductList onAddToCart={handleAddToCart} />} />
              <Route path="/Cart" element={<Cart />} />
            </Routes>
          </main>

          <footer className="app-footer">
            &copy; 2025 Your Shop
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

