import useFetch from "../hooks/useFetch";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";

function ProductList() {
  const { products, loading, error } = useFetch(
    "https://dummyjson.com/products",
  ); //useFetch hook which returns data from api response
  // const [products, setProducts] = useState(data && data.products || [])

  return (
    <div>
      {products &&
        products.map((product) => (
          <Link to={`/product/${product.id}`}>
            <ProductItem product={product} key={product.id} />
          </Link>
        ))}
    </div>
  );
}

export default ProductList;
