import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const checkoutsCol = collection(db, 'checkouts');

export async function createCheckout(items) {
  const ref = await addDoc(checkoutsCol, {
    items, // array of product items
    createdAt: Date.now()
  });
  return ref.id;
}