import { Component } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { AppointmentDto } from '@/models/appointment/appointment.model'
import { IResponse } from '@/models/common/common.model'
import httpClient from '@/request'
import { splitFromDateTime } from '@/utils/time.util'
import { CommonEvent } from '@tarojs/components/types/common';
import { HTTP_RESPONSE_STATE } from '@/models/common/const'

export class List extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      appointments: [] // 预约列表数据
    }
  }

  // Taro 特有生命周期：页面显示时触发（包括从添加页返回时）
  componentDidShow() {
    this.fetchData()
  }

  // 获取后端数据
  async fetchData() {

    const userId = Taro.getStorageSync("userId");

    try {
      Taro.showLoading({ title: '加载中...' })
      
      const {data: resData} = await httpClient.get<IResponse<AppointmentDto[]>, unknown>(`/appointment/list?userId=${ userId }`)

      this.setState({ appointments: resData.data || [] })
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '获取数据失败', icon: 'none' })
    }
  }

  // 跳转到添加页面
  goToAdd() {
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }

  onItemPress(appointment: AppointmentDto, event: CommonEvent) {
    event.preventDefault();
    event.stopPropagation();

    Taro.vibrateShort();
    Taro.showModal({
      title: '提示',
      content: '确认要删除该预约？'
    }).then((res) => {
      if (res.confirm) {
        this.handleDelete(appointment && appointment.id);
      }
    });
  }

  async handleDelete(id: string | undefined) {
    Taro.showLoading({
      title: '请稍后...',
      mask: true
    });

    const { data: resData } = await httpClient.delete<IResponse<unknown>, unknown>(`/appointment/delete?id=${id}`)
    Taro.hideLoading();

    if (resData.state === HTTP_RESPONSE_STATE.success) {
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
      });
      this.fetchData();
    } else {
      Taro.showToast({
        title: resData.msg,
        icon: 'error',
      });
    }
  }

  render() {
    const { appointments } = this.state

    return (
      <View className='list-container' style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '15px' }}>
        <View style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>我的预约</View>
        
        <ScrollView scrollY style={{ height: 'calc(100vh - 120px)' }}>
          {appointments.length > 0 ? (
            appointments.map((item) => {
              const start = splitFromDateTime(item.startTime);
              const end = splitFromDateTime(item.endTime);
              
              return (
              <View 
                onLongPress={this.onItemPress.bind(this, item)}
                key={item.id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '12px',
                }}
              >
                <View style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                  {item.subject}
                </View>
                
                <View style={{ fontSize: '14px', color: '#666', display: 'flex', flexDirection: 'column' }}>
                  <Text>日期：{start.date}</Text>
                  <View style={{ marginTop: '4px' }}>
                    <Text>时间：</Text>
                    <Text style={{ color: '#007aff', fontWeight: '500' }}>
                      {start.time} ~ {end.time}
                    </Text>
                  </View>
                </View>
              </View>
            )})
          ) : (
            <View style={{ textAlign: 'center', marginTop: '100px', color: '#999' }}>暂无预约记录</View>
          )}
        </ScrollView>

        {/* 底部悬浮按钮 */}
        <Button 
          type='primary' 
          onClick={this.goToAdd}
          style={{ 
            position: 'fixed', 
            bottom: '30px', 
            left: '20px', 
            right: '20px',
            borderRadius: '25px',
            boxShadow: '0 4px 10px rgba(0,122,255,0.3)'
          }}
        >
          + 发起新预约
        </Button>
      </View>
    )
  }
}

export default List