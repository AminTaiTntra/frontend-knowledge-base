import ProductList from "./Productlist";

export async function ProductsServer() {
  console.log("ProductsServer running on server");

  const res = await fetch("https://dummyjson.com/products?limit=5", {
    cache: "no-store",
  });
  const data = await res.json();
  return <ProductList products={data.products} />;
}
