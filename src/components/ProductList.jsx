import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct, updateProductQuantity} from '../services/productService';
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
//edit
  const handleEdit = (product) => {
    setEditing(product);
    setShowModal(true);
  };
//delete
  const handleDelete = async (id) => {
    await deleteProduct(id);
    load();
  };
 //Add tocart
  const handleAddToCart = async (product) => {
    if (product.quantity <= 0) {
      alert('Product is out of stock.');
      return;
    }

    if (onAddToCart) onAddToCart(product);
    dispatch({ type: 'ADD_TO_CART', product });

    // Decrease quantity in DB
    await updateProductQuantity(product.id, product.quantity - 1);

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
              <p>{p.quantity}</p>
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
