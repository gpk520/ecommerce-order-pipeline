import { useEffect, useState } from "react";

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="product-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <button onClick={() => onAddToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

