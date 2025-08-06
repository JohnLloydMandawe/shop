// src/services/productService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../firebase';

const productsCol = collection(db, 'products');

export async function createProduct(data) {
  const ref = await addDoc(productsCol, {
    ...data,
    createdAt: Date.now()
  });
  return ref.id;
}

export const updateProductQuantity = async (productId, newQuantity) => {
  const ref = doc(db, 'products', productId);
  await updateDoc(ref, { quantity: newQuantity });
};

export async function getAllProducts() {
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProduct(id, data) {
  const ref = doc(db, 'products', id);
  await updateDoc(ref, data);
}

export async function deleteProduct(id) {
  const ref = doc(db, 'products', id);
  await deleteDoc(ref);
}