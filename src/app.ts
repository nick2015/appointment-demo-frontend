import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { HTTP_RESPONSE_STATE, TOKEN } from './models/common/const'
import httpClient from './request'

import './app.scss'
import { IResponse } from './models/common/common.model'

class App extends Component<PropsWithChildren> {
  componentDidMount () {
    this.checkLoginStatus()
  }

  checkLoginStatus = async () => {
    // check token exists
    const token = Taro.getStorageSync(TOKEN);
    if (!token) {
      return 
    }

    try {

      // if token exists, check whether it is expired
      const {data: reqData} = await httpClient.get<IResponse<unknown>, unknown>('/auth/tokenCheck');
      
      if (reqData.state === HTTP_RESPONSE_STATE.success) {
        Taro.reLaunch({
          url: '/pages/list/index'
        })
      } else {
        Taro.removeStorageSync(TOKEN)
      }
    } catch (err) {
      console.error('Token check failed', err)
    }
  }

  render () {
    return this.props.children
  }
}
  


export default App
