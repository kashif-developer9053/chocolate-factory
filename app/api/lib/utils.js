// /app/lib/utils.js
export const formatError = (error) => {
  let message = error.message || 'Server Error';
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(error.keyValue).join(', ')}`;
  }
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors).map(val => val.message).join(', ');
  }
  
  return message;
};

export const calculateTotals = (items) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.15; // 15% tax rate
  const taxPrice = itemsPrice * taxRate;
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
  return {
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};
