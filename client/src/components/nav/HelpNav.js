import React from "react";
import {
  UserOutlined,
  WalletOutlined,
  SaveOutlined,
  FileProtectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const HelpNav = () => {
  const navigate = useNavigate();
  return (
    <ul className="list-group">
      <li className="d-flex list-group-item align-items-center py-3 shadow p-3 bg-body rounded" onClick={() => navigate("/user/profile")}>
        <UserOutlined className="me-2" />
        User Details
      </li>
      <li className="d-flex list-group-item align-items-center py-3 shadow p-3 bg-body rounded" onClick={() => navigate("/user/payment-management")}>
        <WalletOutlined className="me-2" />
        Payment Settings
      </li>
      <li className="d-flex list-group-item align-items-center py-3 shadow p-3 bg-body rounded">
        <SaveOutlined className="me-2" />
        Saved Favorites
      </li>
      <li
        className="d-flex list-group-item align-items-center py-3 shadow p-3 bg-body rounded"
        onClick={() => navigate("/user/terms-and-conditions")}
      >
        <FileProtectOutlined className="me-2" />T & C's
      </li>
      <li className="d-flex list-group-item align-items-center py-3 shadow p-3 bg-body rounded">
        <SettingOutlined className="me-2" />
        General
      </li>
    </ul>
  );
};

export default HelpNav;
