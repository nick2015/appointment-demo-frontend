import Taro from '@tarojs/taro';
import { TOKEN, APP_SERVER_URL } from '@/models/common/const';


export function defaultInterceptor(chain: Taro.Chain) {
  const requestParams = chain.requestParams;
  let {url, contentType} = requestParams;

  url = url.indexOf('http') !== -1 || url.indexOf('https') !== -1 ? url : APP_SERVER_URL + url;
  contentType = contentType || 'application/json';
  requestParams.url = url;
  requestParams.header = {
    ...requestParams.header,
    'content-type': contentType
  };

  return chain
    .proceed(requestParams)
    .then((res) => {
      // TODO: 响应状态码拦截提示
      return res;
    })
}


export function authInterceptor(chain: Taro.Chain) {
  const requestParams = chain.requestParams;
  const {header} = requestParams;
  const Authorization = Taro.getStorageSync(TOKEN) || '';

  requestParams.header = {...header, 'X-Auth-Token': Authorization};

  return chain.proceed(requestParams);
}
