import React from "react";

const ProductItem = ({ product, onProcessClick }) => {
  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>
        <button
          className="btn btn-success"
          onClick={() => onProcessClick(product.id)}
        >
          Process
        </button>
      </td>
    </tr>
  );
};

export default ProductItem;
