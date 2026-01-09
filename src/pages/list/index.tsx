import { Component } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

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
  fetchData = async () => {
    try {
      Taro.showLoading({ title: '加载中...' })
      
      /* // 实际调用后端 API
      const res = await Taro.request({
        url: 'https://your-api.com/api/appointments',
        method: 'GET',
        header: {
          'Authorization': `Bearer ${Taro.getStorageSync('token')}`
        }
      })
      this.setState({ appointments: res.data })
      */

      // 模拟数据结构，匹配 Add 页面的输入
      const mockData = [
        {
          id: 1,
          title: '牙医诊疗',
          appointmentDate: '2024-05-20',
          startTime: '10:00',
          endTime: '11:30'
        },
        {
          id: 2,
          title: '健身私教课',
          appointmentDate: '2024-05-21',
          startTime: '14:00',
          endTime: '15:00'
        }
      ]
      
      this.setState({ appointments: mockData })
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '获取数据失败', icon: 'none' })
    }
  }

  // 跳转到添加页面
  goToAdd = () => {
    Taro.navigateTo({
      url: '/pages/add/index'
    })
  }

  render() {
    const { appointments } = this.state

    return (
      <View className='list-container' style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '15px' }}>
        <View style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>我的预约</View>
        
        <ScrollView scrollY style={{ height: 'calc(100vh - 120px)' }}>
          {appointments.length > 0 ? (
            appointments.map((item) => (
              <View 
                key={item.id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <View style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                  {item.title}
                </View>
                
                <View style={{ fontSize: '14px', color: '#666', display: 'flex', flexDirection: 'column' }}>
                  <Text>日期：{item.appointmentDate}</Text>
                  <View style={{ marginTop: '4px' }}>
                    <Text>时间：</Text>
                    <Text style={{ color: '#007aff', fontWeight: '500' }}>
                      {item.startTime} ~ {item.endTime}
                    </Text>
                  </View>
                </View>
              </View>
            ))
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