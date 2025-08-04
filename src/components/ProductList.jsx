import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import { ProductForm } from './ProductForm';
import './productlist.css';
import { useCart } from '../context/CartContext'; 

export function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  const { dispatch } = useCart(); 

  const load = async () => {
    const items = await getAllProducts();
    setProducts(items);
    setEditing(null);
    setShowModal(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (product) => {
    setEditing(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    load();
  };

 const handleAddToCart = (product) => {
  if (onAddToCart) onAddToCart(product); // still allow external handler
  dispatch({ type: 'ADD_TO_CART', product });
  setAddedProductName(product.name);
  setShowCartAlert(true);
  setTimeout(() => setShowCartAlert(false), 1500);
};

  return (
    <div className="product-list-container">
      <h2>{editing ? 'Edit Product' : 'New Product'}</h2>

      <button onClick={() => {
        setEditing(null);
        setShowModal(true);
      }}>
        ➕ Add New Product
      </button>

      {showCartAlert && (
        <div className="alert">
          ✅ Added <strong>{addedProductName}</strong> to cart!
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ProductForm
              existing={editing}
              onSaved={load}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            {p.image && <img src={p.image} alt={p.name} style={{ width: '150px', objectFit: 'cover' }} />}

            <div style={{ flex: 1 }}>
              <strong>{p.name}</strong> — ${p.price}
              <p>{p.description}</p>
              <small>{p.details}</small>
              <div className="product-buttons">
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
                <button onClick={() => handleAddToCart(p)}>Add to Cart 🛒</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
