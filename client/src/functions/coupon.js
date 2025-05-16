import axios from 'axios';

export const getCoupons = async () => 
    await axios.get("http://localhost:8000/api/coupons"); 

export const getCoupon = async (slug) => 
   await axios.get(`http://localhost:8000/api/coupon/${slug}`);

export const removeCoupon = async (slug, authtoken) => 
   await axios.delete(`http://localhost:8000/api/coupon/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateCoupon = async (slug, coupon, authtoken) => 
   await axios.put(`http://localhost:8000/api/coupon/${slug}`, coupon,
    {
        headers: {
            authtoken
        }
    });

export const createCoupon = async (coupon, authtoken) => 
   await axios.post(`http://localhost:8000/api/coupon`, coupon, 
    {
        headers: {
            authtoken
        }
    });
