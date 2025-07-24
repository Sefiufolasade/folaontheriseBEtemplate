import axios from "axios";

export const roleApplication = async (authtoken, form) => {
  return await axios.post(`${process.env.REACT_APP_SERVER}/application`, form, {
    headers: {
      authtoken,
    },
  });
};
export const roleApplicationDecision = async (authtoken, form) => {
  return await axios.post(`${process.env.REACT_APP_SERVER}/application/v2`, form, {
    headers: {
      authtoken,
    },
  });
};
