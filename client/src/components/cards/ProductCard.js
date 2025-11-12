import React, { useEffect, useState } from "react";
import { Card, Tooltip } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Newrating from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

const ProductCard = ({ product }) => {
  const { Meta } = Card;
  const { title, description, images, slug } = product;
  //   const { title, description, images, slug, price, size, color } = product;
  const [tooltip, settooltip] = useState("Click to Add");
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = `Innterior - ${product.title}`
  }, [product])
  

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      //if cart is in local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({
        ...product,
        count: 1,
      });
    }
    let unique = _.uniqWith(cart, _.isEqual);

    localStorage.setItem("cart", JSON.stringify(unique));
    settooltip("Added");

    dispatch({
      type: "ADD_TO_CART",
      payload: unique,
    });
  };
    return (
      <>
          {product && product.ratings && product.ratings.length > 0 ? (Newrating(product)):<div className='d-flex pt-1 justify-content-center mb-0'><p>No ratings yet</p></div>}
          <Card
              hoverable
              style={{
              width: 200,
              marginBottom: 10,
              marginTop: 0,
              }}
              className='p-1 mt-0'
              cover={<img alt="example" style={{height: 150}}src={images && images.length ? images[0].url:"https://res.cloudinary.com/dvdy3c2af/image/upload/v1748417009/Innterior_qtmjp7.png"} />}
              actions={[
                  <Link to={`/product-details/${slug}`}>
                      <EyeOutlined className='text-success'/><br/>View Details
                  </Link>,
                  <Tooltip>
                      <a onClick={handleAddToCart}><ShoppingCartOutlined className='text-primary'/><br/> Add to Cart</a>
                  </Tooltip>
              ]}
          >
              <Meta title={title} description={`${description && description.substring(0,25)}...`} />
          </Card>
      </>

    )
};

export default ProductCard;
  //   return (
  //     <div className="flex justify-center">
  //       <div className="relative w-72 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-b from-purple-100 to-white hover:shadow-2xl transition-all duration-300">
  //         <div className="relative bg-gradient-to-tr from-purple-500 to-indigo-500 h-40 flex items-center justify-center">
  //           <img
  //             alt={title}
  //             className="h-32 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
  //             src={
  //               images && images.length
  //                 ? images[0].url
  //                 : "https://res.cloudinary.com/dvdy3c2af/image/upload/v1748417009/Innterior_qtmjp7.png"
  //             }
  //           />
  //           <button className="absolute top-3 right-3 bg-white/70 p-1.5 rounded-full hover:bg-white transition-all">
  //             <HeartOutlined className="text-purple-600 text-lg" />
  //           </button>
  //         </div>

  //         <div className="bg-white rounded-t-3xl -mt-5 pt-5 px-5 pb-4">
  //           <Link to={`/product-details/${slug}`}>
  //             <h3 className="text-gray-900 font-semibold text-sm mb-1 truncate">
  //               {title}
  //             </h3>
  //           </Link>
  //           {product && product.ratings && product.ratings.length > 0 ? (
  //             <div className="mb-1">{Newrating(product)}</div>
  //           ) : (
  //             <p className="text-gray-400 text-xs mb-1">No ratings</p>
  //           )}
  //           <div className="flex gap-2 mb-2">
  //             {size && (
  //               <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-md">
  //                 {size}
  //               </span>
  //             )}
  //             {color && (
  //               <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-md">
  //                 {color}
  //               </span>
  //             )}
  //           </div>
  //           <p className="text-gray-500 text-xs mb-3 leading-snug">
  //             {description && description.substring(0, 70)}...
  //           </p>

  //           <div className="flex items-center justify-between">
  //             <p className="text-gray-900 font-bold text-sm">
  //               ${price?.toFixed(2)}
  //             </p>
  //             <Tooltip title={tooltip}>
  //               <button
  //                 onClick={handleAddToCart}
  //                 className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all"
  //               >
  //                 <ShoppingCartOutlined className="mr-1" /> Add to cart
  //               </button>
  //             </Tooltip>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
