import axios from "axios";

export const roleApplication = async (authtoken, form) => {
  return await axios.post(`https://innteriors-backend.onrender.com/api/application`, form, {
    headers: {
      authtoken,
    },
  });
};
export const roleApplicationDecision = async (authtoken, form) => {
  return await axios.post(`https://innteriors-backend.onrender.com/api/application/v2`, form, {
    headers: {
      authtoken,
    },
  });
};
