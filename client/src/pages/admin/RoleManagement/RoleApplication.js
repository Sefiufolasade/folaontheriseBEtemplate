import React, { useState } from "react";
import { useSelector } from "react-redux";
import { roleApplication } from "../../../functions/applications";
import { toast } from "react-toastify";

const RoleApplicationPage = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const formTemplate = {
    fullName: "",
    email: "",
    phone: "",
    role: "",
    businessName: "",
    portfolioLink: "",
    description: "",
  }
  const [formData, setFormData] = useState(formTemplate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Application:", formData);
    // TODO: send formData to backend or API
    roleApplication(user.token, formData)
    .then((res) => {
      console.log(res.data)
      // return a toast message then refresh page
      toast.success("Application Submitted Successfully")
      setFormData(formTemplate)
    })
    .catch((err) => {
      // console.error(err)
      toast.error(err.message)
    })
  };

  return (
    <div className="monteserrat-complementary-ss mb-3">
      <div className="class-head-img d-flex align-items-center justify-content-center mb-3 px-3">
        <div>
          <h2 className="text-center mb-4">Apply for a Role</h2>
          <p className="text-center mb-5">
            Join our community of talented interior decorators or showcase your
            quality furniture and decor products by applying below.
          </p>
        </div>
      </div>
      <div className="container">
        <h3 className="text-center mb-4">Fill Role Details</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              Full Name <small className="text-danger">*</small>
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Registered Email Address <small className="text-danger">*</small>
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Phone Number <small className="text-danger">*</small>
            </label>
            <input
              type="text"
              name="phone"
              inputMode="tel"
              className="form-control"
              placeholder="+234 701 2345 678"
              pattern="^\+?\d{0,14}$"
              required
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits and optional leading +
                if (/^\+?\d*$/.test(value)) {
                  setFormData({ ...formData, phone: value });
                }
              }}
            />
          </div>
          {/* https://www.instagram.com/5_knobs*/}
          <div className="col-md-6">
            <label className="form-label">
              Select Role <small className="text-danger">*</small>
            </label>
            <select
              name="role"
              className="form-select"
              required
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option value="interior-decorator">Interior Decorator</option>
              <option value="furniture-seller">
                Furniture & Decoration Seller
              </option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Business Name (if applicable)</label>
            <input
              type="text"
              name="businessName"
              className="form-control"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Portfolio Link (or Instagram){" "}
              <small className="text-danger">*</small>
            </label>
            <input
              type="url"
              name="portfolioLink"
              className="form-control"
              value={formData.portfolioLink}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Tell us more about what you do</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              placeholder="Describe your style, experience, or products..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary px-4">
              Submit Application
            </button>
          </div>
        </form>
      </div>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default RoleApplicationPage;
