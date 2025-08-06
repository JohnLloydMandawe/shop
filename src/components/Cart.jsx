// src/components/Cart.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createCheckout } from '../services/checkoutService';
import './Cart.css';

export default function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    setTotal(totalPrice.toFixed(2));
  }, [cart]);

//chedckout
  const handleCheckout = async () => {
  try {
    if (cart.length === 0) return;

    await createCheckout(cart);
    setShowModal(true); // Show confirmation modal
  } catch (error) {
    console.error('Checkout failed:', error);
  }
  };
//confirm payment
  const confirmPayment = () => {
    dispatch({ type: 'CLEAR_CART' });
    setShowModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-card">
                <img src={item.image} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h4 className='name'>{item.name}</h4>
                  <p className="description">{item.description}</p>
                  <p className='price'>Price: ${item.price}</p>
                  <p className='quantity'>Quantity: {item.quantity}</p>
                  <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="cart-total">Total: ${total}</h3>
          <button onClick={handleCheckout}>Checkout 🛒</button>
        </>
      )}

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Shop
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Payment Successful</h3>
            <p>Thank you for your purchase! 🎉</p>
            <button onClick={confirmPayment}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
