import axios from 'axios';

export const createProduct = async (product, authtoken) => 
   await axios.post(`${process.env.APP_SERVER}/product`, product, 
    {
        headers: {
            authtoken
        }
    });

export const updateProduct = async (slug, product, authtoken) => 
    await axios.put(`${process.env.APP_SERVER}/product/${slug}`, product, 
    {
        headers: {
            authtoken
        }
    });

export const getProductsByCount = async(count) =>
    await axios.get(`${process.env.APP_SERVER}/products/${count}`)

export const removeProduct = async (slug, authtoken) =>
    await axios.delete(`${process.env.APP_SERVER}/product/${slug}`, {
        headers:{
            authtoken,
        },
    })

export const getProduct = async(slug) =>
    await axios.get(`${process.env.APP_SERVER}/product/${slug}`)

export const getProducts = async(sort,order,page) =>
    await axios.post(`${process.env.APP_SERVER}/products`,{
        sort,
        order,
        page,
    })

export const getProductsCount = async() =>
    await axios.get(`${process.env.APP_SERVER}/products/total`)

export const productStar = async (productId, star, authtoken) =>
    await axios.put(`${process.env.APP_SERVER}/product/star/${productId}`, 
    { star }, 
    {
        headers: {
            authtoken,
        }
    })

export const getRelated = async(productId) =>
    await axios.get(`${process.env.APP_SERVER}/product/related/${productId}`)

export const fetchProductByFilter = async(arg) =>
    await axios.post(`${process.env.APP_SERVER}/search/filters`, arg)