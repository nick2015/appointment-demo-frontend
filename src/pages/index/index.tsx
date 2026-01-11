import { Component } from 'react'
import { View, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import httpClient from '@/request'
import { IResponse } from '@/models/common/common.model'
import { HTTP_RESPONSE_STATE, TOKEN } from '@/models/common/const'
import { LoginInfoDto, UserInfoDto } from '@/models/auth/auth.model'

export class Login extends Component<any, any> {
  private timer: NodeJS.Timeout | null = null

  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      code: '',
      isCounting: false,    // 是否正在倒计时
      count: 60             // 倒计时秒数
    }
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer)
  }

  handlePhoneInput = (e) => {
    this.setState({ phone: e.detail.value })
  }

  handleCodeInput = (e) => {
    this.setState({ code: e.detail.value })
  }

  sendSmsCode = async () => {
    const { phone, isCounting } = this.state

    if (isCounting) return
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '发送中...' })

      const {data: resData} = await httpClient.get<IResponse<boolean>, object>(`/auth/sendCode?phoneNumber=${ phone }`)
      if (resData.state === HTTP_RESPONSE_STATE.success) {
        Taro.hideLoading()
        Taro.showToast({ title: '验证码已发送', icon: 'success' })

        // 开始倒计时
        this.setState({ isCounting: true })
        this.timer = setInterval(() => {
          this.setState((prevState: any) => {
            if (prevState.count <= 1) {
              if (this.timer) clearInterval(this.timer)
              return { isCounting: false, count: 60 }
            }
            return { count: prevState.count - 1 }
          })
        }, 1000)
      } else {
        Taro.hideLoading()
        console.error(resData.msg);
        Taro.showToast({ title: '发送失败，请重试', icon: 'error' })
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '发送失败，请重试', icon: 'none' })
    }
  }

  handleLogin = async () => {
    const { phone, code } = this.state

    if (!phone || !code) {
      Taro.showToast({ title: '请填写手机号和验证码', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '登录中...' })
      const param: LoginInfoDto= {  phoneNumber: phone, smsCode: code }
      const {data: resData} = await httpClient.post<IResponse<UserInfoDto>, LoginInfoDto>('/auth/login', param)
      Taro.hideLoading()

      if (resData.state === HTTP_RESPONSE_STATE.success) {
        const token = resData.data?.token
        Taro.setStorageSync(TOKEN, token)
        Taro.setStorageSync("userId", resData.data?.userId)
        Taro.showToast({ title: '登录成功' })
        
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/list/index' })
        }, 500)
      } else {
        Taro.showToast({ title: resData.msg, icon: 'error' })
      }
      
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '登录失败，请检查验证码', icon: 'none' })
    }
  }

  render() {
    const { phone, code, isCounting, count } = this.state

    return (
      <View className='login-container' style={{ padding: '40px 20px' }}>
        <View style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>欢迎登录</View>

        <View className='input-group' style={{ marginBottom: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <Input
            type='number'
            placeholder='请输入手机号'
            value={phone}
            onInput={this.handlePhoneInput}
            style={{ flex: 1, padding: '10px 0' }}
          />
          <Button
            size='mini'
            disabled={isCounting}
            onClick={this.sendSmsCode}
            style={{ fontSize: '12px', width: '100px', color: '#999' }}
          >
            {isCounting ? `${count}s` : '获取验证码'}
          </Button>
        </View>

        <View className='input-group' style={{ marginBottom: '40px', borderBottom: '1px solid #eee' }}>
          <Input
            type='number'
            placeholder='请输入验证码'
            value={code}
            onInput={this.handleCodeInput}
            style={{ padding: '10px 0' }}
          />
        </View>

        <Button type='primary' onClick={this.handleLogin}>登录</Button>
      </View>
    )
  }
}

export default Login