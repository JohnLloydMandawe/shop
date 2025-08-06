
export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.find(item => item.id === action.product.id);
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.id);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};