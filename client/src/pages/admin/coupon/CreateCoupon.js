import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CouponCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [minAmount, setminAmount] = useState("");
  const [maxAmount, setmaxAmount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setloading] = useState(false);
  const [coupons, setcoupons] = useState([]);
  const [keyword, setkeyword] = useState("");

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    getCoupons().then((c) => setcoupons(c.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setloading(true);
    const couponList = {
      name,
      couponValue: discount,
      minAmount,
      maxAmount,
      expiry,
    };

    createCoupon(couponList, user.token)
      .then((res) => {
        setloading(false);
        setName("");
        setDiscount("");
        setminAmount("");
        setmaxAmount("");
        setExpiry("");
        toast.success(`${res.data.name} coupon created`);
        loadCoupons();
      })
      .catch((err) => {
        // console.log(err);
        setloading(false);
        if (err.response.status === 400) {
          toast.error(err.response.data);
        }
      });
  };

  const handleRemove = async (slug) => {
    let answer = window.confirm("Delete?");
    if (answer) {
      setloading(true);
      removeCoupon(slug, user.token)
        .then(() => {
          setloading(false);
          toast.success("Coupon Removed");
          loadCoupons();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setloading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setkeyword(e.target.value.toLowerCase());
  };
  const today = new Date().toISOString().split("T")[0];

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  const couponForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <br />
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
          required
        />
        <label>Discount Amount</label>
        <input
          type="number"
          className="form-control"
          min={0}
          onChange={(e) => setDiscount(e.target.value > 0 ? e.target.value : 0)}
          value={discount}
          autoFocus
          required
        />
        <label>Minimum Amount</label>
        <input
          type="number"
          className="form-control"
          min={0}
          onChange={(e) =>
            setminAmount(e.target.value > 0 ? e.target.value : 0)
          }
          value={minAmount}
          autoFocus
        />
        <label>Maximum Amount</label>
        <input
          type="number"
          className="form-control"
          min={0}
          onChange={(e) =>
            setmaxAmount(e.target.value > 0 ? e.target.value : 0)
          }
          value={maxAmount}
          autoFocus
        />
        <label>Expiry Date</label>
        <input
          type="date"
          className="form-control"
          min={today}
          onChange={(e) => setExpiry(e.target.value)}
          value={expiry}
          autoFocus
          required
        />
        {loading ? (
          <button className="btn btn-outlined-primary" disabled>
            Loading...
          </button>
        ) : (
          <button className="btn btn-outlined-primary">Save</button>
        )}
      </div>
    </form>
  );
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-sm-4">
          <AdminNav />
        </div>
        <div className="col">
          {couponForm()}
          <input
            type="text"
            className="form-control"
            onChange={handleSearch}
            value={keyword}
            placeholder="Search here"
          />
          <hr />
          <h3>Coupons List.</h3>
          {coupons.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary category" key={c._id}>
              {c.name}{" "}
              <span
                className="btn btn-sm options text-danger"
                onClick={() => handleRemove(c.slug)}
              >
                <DeleteOutlined className="icon" />
                delete
              </span>{" "}
              <Link
                className="btn btn-sm options text-primary"
                to={`/admin/coupon/${c.slug}`}
              >
                <EditOutlined className="icon" /> Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponCreate;
