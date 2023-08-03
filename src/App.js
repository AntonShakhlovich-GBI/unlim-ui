import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductItem from "./ProductItem";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const serverUri = "http://localhost:8000";

  useEffect(() => {
    // Fetch the list of products from the API and update state
    axios
      .get(`${serverUri}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleProcessClick = (productId) => {
    axios
      .get(`${serverUri}/products/${productId}`)
      .then((response) => {
        // Update the selected product with enriched data
        setSelectedProduct({ ...response.data, id: productId });
      })
      .catch((error) => {
        console.error("Error enriching product:", error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h1>Product List</h1>
          <div className="product-list">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Process</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onProcessClick={handleProcessClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6">
          {selectedProduct && (
            <div>
              <h2>Product Description</h2>
              <div className="product-details">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                />
                <p>ID: {selectedProduct.id}</p>
                <h3>{selectedProduct.name}</h3>
                <p>{selectedProduct.description}</p>
                {selectedProduct.attributes && (
                  <div>
                    <h4>Attributes:</h4>
                    <ul>
                      {selectedProduct.attributes.map((attr) => (
                        <li key={attr.name}>
                          {attr.name}: {attr.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;