import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductItem from "./productItem";

import "./App.css";

const App = () => {
  const pageSize = 10; // Number of products per page
  const maxDisplayedPages = 5;

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [goToPage, setGoToPage] = useState(currentPage);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = () => {
    setSelectedProduct(null);
    setIsLoading(true);
    // Fetch the list of products with pagination and search query
    let uri = `http://localhost:8000/products?_page=${currentPage}&_limit=${pageSize}`;
    if (!!searchQuery) {
      uri += `&name=${encodeURIComponent(searchQuery)}`;
    }

    axios
      .get(uri)
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
        // Get total number of products from response header
        const totalCount = parseInt(response.headers["x-total-count"], 10);
        setTotalPages(Math.ceil(totalCount / pageSize));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  };

  const handleProcessClick = (productId) => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/products/${productId}`)
      .then((response) => {
        // Update the selected product with enriched data
        setSelectedProduct({ ...response.data, id: productId });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error enriching product:", error);
        setIsLoading(false);
      });
  };

  const handleGoToPageChange = (event) => {
    setGoToPage(parseInt(event.target.value, 10)); // Update the goToPage state
  };

  const handleGoToPageSubmit = (event) => {
    event.preventDefault();
    if (goToPage >= 1 && goToPage <= totalPages) {
      setCurrentPage(goToPage); // Update currentPage based on the value of goToPage
    } else {
      alert(`Page should be between 1 and ${totalPages}`);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setCurrentPage(1);
    event.preventDefault();
    // Perform search when the user submits the search query
    fetchProducts();
  };

  const getDisplayedPages = () => {
    const displayedPages = [];
    if (totalPages <= maxDisplayedPages) {
      for (let i = 1; i <= totalPages; i++) {
        displayedPages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(start + maxDisplayedPages - 1, totalPages);
      for (let i = start; i <= end; i++) {
        displayedPages.push(i);
      }
    }
    return displayedPages;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h1>UNLeashed IMagation</h1>
          <div className="product-search">
            <form onSubmit={handleSearchSubmit} className="form-inline">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button type="submit" className="btn btn-light">
                Search
              </button>
            </form>
          </div>
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
          <div className="pagination">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {getDisplayedPages().map((page) => (
                <li
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                  key={page}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
          <div className="go-to-page-form">
            <form onSubmit={handleGoToPageSubmit}>
              <label>
                Go to Page:
                <input
                  type="number"
                  value={goToPage} // Use the goToPage state here
                  onChange={handleGoToPageChange}
                  min="1"
                  max={totalPages}
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Go
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          {isLoading ? (
            <div className="text-center">
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          ) : selectedProduct ? (
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
                        <li
                          key={attr.name}
                          className={attr.isSuggested ? "is-suggested" : ""}
                        >
                          {attr.name}: {attr.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">Select a product to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
