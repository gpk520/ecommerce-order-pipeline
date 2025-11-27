import { useState } from "react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import CheckoutResult from "./CheckoutResult";

function App() {
  const [cart, setCart] = useState([]);
  const [orderResult, setOrderResult] = useState(null);
  const [view, setView] = useState("products"); // "products" | "cart" | "result"

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, qty: 1 }]);
  };

  const handleCheckout = async () => {
    const payload = {
      userId: "demo-user-1",
      items: cart.map((c) => ({ productId: c.id, qty: c.qty })),
      totalAmount: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setOrderResult(data);
    setCart([]);
    setView("result");
  };

  return (
    <div className="app">
      <header>
        <h1>E-Shop Demo</h1>
        <nav>
          <button onClick={() => setView("products")}>Products</button>
          <button onClick={() => setView("cart")}>
            Cart ({cart.length})
          </button>
        </nav>
      </header>

      <main>
        {view === "products" && (
          <ProductList onAddToCart={addToCart} />
        )}
        {view === "cart" && (
          <Cart cart={cart} onCheckout={handleCheckout} />
        )}
        {view === "result" && (
          <CheckoutResult result={orderResult} />
        )}
      </main>
    </div>
  );
}

export default App;

