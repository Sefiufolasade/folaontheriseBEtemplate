import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Jumbotron from "../components/cards/Jumbotron";
import chair from "../image/chairNone.jpg";
import NewProducts from "../components/home/NewProducts";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/cards/category/CategoryList";
import SubList from "../components/cards/sub/SubList";
import CategoriesCarousel from "../components/home/CategoriesCarousel"

const Home = () => {
  // let { user } = useSelector((state) => ({...state}))
  const textList = [
    "Innterior...",
    "Innterior with style",
    "New Products",
    "Popular Designs",
    "Popular Products",
  ];
  const [loading, setloading] = useState(false);

  return (
    <div>
      <div className="jumbotron">
        <div className="container text-center">
          {loading ? (
            <h4 className="text-danger">
              Loading...
              <img className="imgrotate" alt="" src={chair} />
            </h4>
          ) : (
            <h2 className="playfair-display">
              <Jumbotron text={textList} />
            </h2>
          )}
        </div>
      </div>
      {/*  Innterior Image display */}
      <div className="top-image-display">
        <div>
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408793/albero-furniture-bratislava-xRuHNSq5rD0-unsplash_o01xqq.jpg"
            alt="innterior designs"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408793/jason-briscoe-AQl-J19ocWE-unsplash_huc0md.jpg"
            alt="innterior designs"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408791/kam-idris-_HqHX3LBN18-unsplash_ppw0to.jpg"
            alt="innterior designs"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408794/spacejoy-h2_3dL9yLpU-unsplash_npslao.jpg"
            alt="innterior designs"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408792/pexels-heyho-5998120_pqwa5s.jpg"
            alt="innterior designs"
          />
        </div>
      </div>

      <div>
        <NewProducts />
        <CategoriesCarousel/>
        <BestSellers />
        <div className="container pb-3">
          <CategoryList />
        </div>
        {/* <div className="container pb-3">
          <SubList />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
