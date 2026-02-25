import { Suspense } from "react";
import { ProductsServer } from "./ProductServer";

export default async function Page() {
  console.log("Running on SERVER");
  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">React Server Components Demo</h1>
        <Suspense fallback={<p className="loading">Loading products...</p>}>
          <ProductsServer />
        </Suspense>
      </div>
    </div>
  );
}
