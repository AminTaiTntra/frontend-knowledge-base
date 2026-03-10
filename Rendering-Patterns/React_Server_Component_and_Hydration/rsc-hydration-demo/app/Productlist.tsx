"use client";

import "./product.css";
import { useEffect, useState } from "react";

export default function ProductList({ products }: any) {
  const [hydrated, setHydrated] = useState(false);

  console.log("Running on CLIENT");

  useEffect(() => {
    console.log("Hydration finished");
    setHydrated(true);
  }, []);

  return (
    <div>
      <p
        className={`hydration-status ${hydrated ? "hydrated" : "not-hydrated"}`}
      >
        {hydrated ? "Hydrated on Client ✅" : "Not hydrated yet ❌"}
      </p>
      <div className="product-wrapper">
        {products.slice(0, 10).map((p: any) => (
          <button
            key={p.id}
            onClick={() => alert(p.title)}
            className="product-btn"
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
