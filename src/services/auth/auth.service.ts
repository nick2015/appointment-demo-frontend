import { IResponse } from '@/models/common/common.model';
import { requestWithoutToken } from '@/request/request';
import { HTTP_RESPONSE_STATE } from '@/models/common/const';
import { LoginInfoDto, UserInfoDto } from '@/models/auth/auth.model';
import Taro from '@tarojs/taro';

export class AuthService {
  async sendSmsCode(phoneNumber: string): Promise<boolean> {
    try {
      const url = `/sendCode?phoneNum=${phoneNumber}`;
      const result = await requestWithoutToken<IResponse<boolean>, unknown>(url)
      
      return result != undefined && result.state === HTTP_RESPONSE_STATE.success;
  
    } catch (e) {
      return false;
    }
  }

  async login(phoneNumber: string, smsCode: string): Promise<UserInfoDto> {
    try {
      const data = {phoneNumber, smsCode}
      const url = `/login`;
      const result = await requestWithoutToken<IResponse<UserInfoDto>, LoginInfoDto>(url, data)
      
      if (result?.data) {
        Taro.setStorageSync("",result.data.token)
        return result.data;
      }
      else {
        return undefined;
      }
    } catch (e) {
      return false;
    }
  };

  
}
