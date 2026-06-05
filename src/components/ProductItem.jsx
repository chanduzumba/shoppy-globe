function ProductItem({product}) {
  return (
    <div>
      <h1>Product Name : {product.title}</h1>
      <h1>Product Price : {product.price} </h1>
      <img src={product.images[0]} alt={product.name} />
    </div>
  )
}

export default ProductItem
