import axios from "axios";

export const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

export const productsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/products`,
});

export const userAddressesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/user-addresses`,
});

export const cartsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/carts`,
});

export const cartItemsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/cart-items`,
});

export const ordersApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/orders`,
});

export const paymentsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/payments`,
});

export const usersApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
});

export const colorsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/colors`,
});

export const brandsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/brands`,
});

export const sizesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/sizes`,
});

export const materialsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/materials`,
});

export const tagsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/tags`,
});

export const discountsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/discounts`,
});

export const productVariantsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/product-variants`,
});

export const productImagesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/product-images`,
});

export const reviewsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/reviews`,
});

[
  authApi,
  productsApi,
  cartsApi,
  cartItemsApi,
  userAddressesApi,
  ordersApi,
  paymentsApi,
  usersApi,
  colorsApi,
  brandsApi,
  sizesApi,
  materialsApi,
  tagsApi,
  discountsApi,
  productVariantsApi,
  productImagesApi,
  reviewsApi,
].forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});
