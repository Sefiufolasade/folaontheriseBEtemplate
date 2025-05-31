import React, { useEffect, useState } from "react";
import LoadingCard from "../cards/LoadingCard";
import ProductCard from "../cards/ProductCard";
import { getProducts, getProductsCount } from "../../functions/product";
import { Pagination } from "antd";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

const NewProducts = () => {
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [productsCount, setproductsCount] = useState(0);
  const [page, setpage] = useState(1);
  useEffect(() => {
    loadProduct();
  }, [page]);
  useEffect(() => {
    getProductsCount().then((res) => setproductsCount(res.data));
  }, []);

  const loadProduct = () => {
    setloading(true);
    getProducts("createdAt", "desc", page).then((res) => {
      setproducts(res.data);
      setloading(false);
    });
  };

  return (
    <div className="container justify-content-center">
      <div className="text-center">
        <h5 className="poppins-semibold-italic text-md">
          <em className="text-danger mb-0">New </em>Products
        </h5>
      </div>
      <br />
      <img src="/svg/ogive-right-svg.svg" className="svg-class-top-right" alt="innterior addon shapes"/>
      <img src="/svg/ogive-right-svg.svg" className="svg-class-bottom-left" alt="innterior addon shapes"/>
      {loading ? (
        <LoadingCard count={5} />
      ) : (
        <ScrollMenu>
          {products.map((product) => (
            <div key={product._id} className="me-2">
              <ProductCard product={product} />
            </div>
          ))}
        </ScrollMenu>
      )}
      <div className="text-center">
        <Pagination
          current={page}
          total={(productsCount / 5) * 10}
          onChange={(value) => setpage(value)}
        />
      </div>
    </div>
  );
};

export default NewProducts;
