// src/utils/formatter.js
export const fx = (n) => (isNaN(n) ? "0.00" : Number(n).toFixed(2));
