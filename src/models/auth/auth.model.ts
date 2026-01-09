export interface LoginInfoDto {
  phoneNumber: string;
  smsCode: string; 
}

export interface UserInfoDto {
  token: string;
  userId: string;
  username: string;
}