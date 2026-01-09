import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export class Add extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '10:00'
    }
  }

  // 处理输入框变化
  handleInput = (e) => {
    this.setState({ title: e.detail.value })
  }

  // 处理选择器变化
  handleDateChange = (e) => {
    this.setState({ date: e.detail.value })
  }

  handleStartTimeChange = (e) => {
    this.setState({ startTime: e.detail.value })
  }

  handleEndTimeChange = (e) => {
    this.setState({ endTime: e.detail.value })
  }

  // 核心校验逻辑
  validateTimes = () => {
    const { startTime, endTime } = this.state
    
    // 直接比较字符串即可，因为 "HH:mm" 格式支持字符串比较大小
    // 例如 "09:00" < "10:00" 是成立的
    if (endTime <= startTime) {
      Taro.showToast({
        title: '结束时间必须晚于开始时间',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    return true
  }

  handleSave = async () => {
    const { title, date, startTime, endTime } = this.state

    if (!title) {
      Taro.showToast({ title: '请输入预约事项', icon: 'none' })
      return
    }

    // 执行校验
    if (!this.validateTimes()) return

    Taro.showLoading({ title: '保存中...' })

    try {
      // 调用你的后端 API
      // await apiSaveAppointment({ title, date, startTime, endTime })
      
      Taro.hideLoading()
      Taro.showToast({ title: '预约成功' })
      
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  render() {
    const { title, date, startTime, endTime } = this.state

    return (
      <View className='add-container' style={{ padding: '20px' }}>
        <View className='form-item'>
          <Text>预约事项</Text>
          <Input 
            value={title} 
            onInput={this.handleInput} 
            placeholder='填写事项名称' 
            style={{ borderBottom: '1px solid #eee', marginBottom: '15px' }}
          />
        </View>

        <View className='form-item'>
          <Picker mode='date' onChange={this.handleDateChange} value={date}>
            <View className='picker'>
              预约日期: <Text style={{ color: '#007aff' }}>{date}</Text>
            </View>
          </Picker>
        </View>

        <View className='form-item' style={{ marginTop: '15px' }}>
          <Picker mode='time' onChange={this.handleStartTimeChange} value={startTime}>
            <View className='picker'>
              开始时间: <Text style={{ color: '#007aff' }}>{startTime}</Text>
            </View>
          </Picker>
        </View>

        <View className='form-item' style={{ marginTop: '15px' }}>
          <Picker mode='time' onChange={this.handleEndTimeChange} value={endTime}>
            <View className='picker'>
              结束时间: <Text style={{ color: '#007aff' }}>{endTime}</Text>
            </View>
          </Picker>
        </View>

        <Button 
          type='primary' 
          onClick={this.handleSave} 
          style={{ marginTop: '30px' }}
        >
          保存预约
        </Button>
      </View>
    )
  }
}

export default Add