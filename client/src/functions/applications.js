import axios from "axios";

export const roleApplication = async (authtoken, form) => {
  return await axios.post("http://localhost:8000/api/application", form, {
    headers: {
      authtoken,
    },
  });
};
export const roleApplicationDecision = async (authtoken, form) => {
  return await axios.post("http://localhost:8000/api/application/v2", form, {
    headers: {
      authtoken,
    },
  });
};
