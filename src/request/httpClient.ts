import Taro from '@tarojs/taro';
import request = Taro.request;
import RequestTask = Taro.RequestTask;

import { authInterceptor, defaultInterceptor } from './auth.interceptor';
class HttpClient {

  constructor() {
    Taro.addInterceptor(authInterceptor);
    Taro.addInterceptor(defaultInterceptor);
    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor);
  }

  get<T, U>(url: string, options: Partial<request.Option<U>> = {}): RequestTask<T> {
    const option: request.Option = {...options, url};

    return Taro.request<T, U>(option);
  }

  post<T, U>(
    url: string,
    body: U,
    options: Partial<request.Option<U>> = {},
  ): RequestTask<T> {
    const option: request.Option = {
      ...options,
      url,
      data: body,
      method: 'POST',
    };

    return Taro.request<T, U>(option);
  }

  delete<T, U>(
    url: string,
    options: Partial<request.Option<U>> = {},
  ): RequestTask<T> {
    const option: request.Option = {
      ...options,
      url,
      method: 'DELETE',
    };

    return Taro.request<T, U>(option);
  }

  put<T, U>(
    url: string,
    body: U,
    options: Partial<request.Option<U>> = {},
  ): RequestTask<T> {
    const option: request.Option = {
      ...options,
      url,
      data: body,
      method: 'PUT',
    };

    return Taro.request<T, U>(option);
  }

}

export default HttpClient;
