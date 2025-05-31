import { React, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  CloseOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  GiftOutlined,
  HistoryOutlined,
  LockOutlined,
  MessageOutlined,
  ShoppingOutlined,
  TagOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const AdminNav = () => {
  const [menuHidden, setmenuHidden] = useState(false);
  return (
    <nav>
      <ul className="list-group montserrat-complementary-ss mt-3">
        {menuHidden?(<li className="d-flex align-items-center pointer" onClick={() => setmenuHidden(!menuHidden)}>
            <AppstoreOutlined className="me-2"/> Show Menu
        </li>):
        (<><li className="list-group cancel-buttton font-bold" onClick={() => setmenuHidden(!menuHidden)}><CloseOutlined size={24} className="me-2" /></li><li className="list-group-item shadow bg-body">
          <Link
            to="/admin/dashboard"
            className="nav-link text-dark d-flex align-items-center "
          >
            <HistoryOutlined className="me-2" /> History
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/product"
            className="d-flex align-items-center nav-link text-dark"
          >
            <TagOutlined className="me-2" />
            Product
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/products"
            className="d-flex align-items-center nav-link text-dark"
          >
            <ShoppingOutlined className="me-2" /> Products
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/category"
            className="d-flex align-items-center nav-link text-dark"
          >
            <AppstoreOutlined className="me-2" />
            Category
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/sub"
            className="d-flex align-items-center nav-link text-dark"
          >
            <FolderOpenOutlined className="me-2" /> Sub-Category
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/coupon"
            className="d-flex align-items-center nav-link text-dark"
          >
            <GiftOutlined className="me-2" /> Coupon
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/user/password"
            className="d-flex align-items-center nav-link text-dark"
          >
            <LockOutlined className="me-2" /> Password
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/coupon"
            className="d-flex align-items-center nav-link text-dark"
          >
            <TeamOutlined className="me-2" /> User-Management
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/admin/coupon"
            className="d-flex align-items-center nav-link text-dark"
          >
            <MessageOutlined className="me-2" /> User-Complaints
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/user/password"
            className="d-flex align-items-center nav-link text-dark"
          >
            <FileTextOutlined className="me-2" /> Role-Application
          </Link>
        </li>
        <li className="list-group-item shadow bg-body">
          <Link
            to="/user/password"
            className="d-flex align-items-center nav-link text-dark"
          >
            <UserSwitchOutlined className="me-2" /> Role-Management
          </Link>
        </li></>)}
      </ul>
    </nav>
  );
};

export default AdminNav;
