import Taro from '@tarojs/taro';
const BASE_URL = 'http://localhost:8888';

export const request = async <T, U>(url, options = {}) => {
  const token = Taro.getStorageSync('token');
  try {
    const res = await Taro.request<T, U>({
      url: `${BASE_URL}${url}`,
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      ...options
    });
    // 统一处理 401 或业务错误
    return res.data;
  } catch (err) {
    console.error('API Error', err);
  }
};

export const requestWithoutToken = async <T, U>(url, options = {}) => {
  try {
    const res = await Taro.request<T, U>({
      url: `${BASE_URL}${url}`,
      header: {
        'Content-Type': 'application/json'
      },
      ...options
    });
    return res.data;
  } catch (err) {
    console.error('API Error', err);
  }
};

