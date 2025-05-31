import React from "react";
import { useNavigate } from "react-router-dom";

const CategoriesCarousel = () => {
    const navigate = useNavigate();
  return (
    <div className="container montserrat-complementary-ss categories-carousel py-5">
      <div className="row align-items-center text-md-start px-5">
        {/* Text Section */}
        <div className="col-md-6 mb-4 mb-md-0 ps-5">
          <h2 className="fw-bold">Elevate Your Office Space</h2>
          <p className="text-white">
            Discover elegant, functional interior decoration solutions tailored
            to boost productivity and impress clients. Whether you want a full
            makeover or a sleek touch-up, we’ve got the perfect design for your
            workspace.
          </p>
          <button onClick={()=> navigate("/user/role-application")} className="btn btn-primary btn-raised me-3">
            Book Simulation Consultation
          </button>
          <button onClick={()=> navigate("/user/role-application")} className="btn btn-outline-secondary btn-raised text-white mt-2">
            Browse Talents
          </button>
        </div>

        {/* Image Section */}
        {/* <div className="col-md-6 d-flex justify-content-start">
          <img
            src="https://res.cloudinary.com/dvdy3c2af/image/upload/v1748408793/spacejoy-h2_3dL9yLpU-unsplash_npslao.jpg"
            alt="Office Interior Design"
            className="img-fluid shadow-sm"
            style={{
              width: "250px",
              objectFit: "cover",
              height: "250px",
              borderBottomLeftRadius: "50px",
              borderBottomRightRadius: "50px",
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default CategoriesCarousel;
