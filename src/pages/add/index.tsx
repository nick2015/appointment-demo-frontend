import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import httpClient from '@/request'
import { IResponse } from '@/models/common/common.model'
import { AppointmentDto } from '@/models/appointment/appointment.model'
import { combineToDateTime, getCurrentDate } from '@/utils/time.util'
import { HTTP_RESPONSE_STATE } from '@/models/common/const'

export class Add extends Component<any, any> {
  constructor(props) {
    const today = getCurrentDate();
    super(props)
    this.state = {
      subject: '',
      date: today,
      startTime: '09:00',
      endTime: '10:00'
    }
  }

  // 处理输入框变化
  handleInput = (e) => {
    this.setState({ subject: e.detail.value })
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

  validateTimes = () => {
    const { startTime, endTime } = this.state
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
    const { subject, date, startTime, endTime } = this.state

    if (!subject) {
      Taro.showToast({ title: '请输入预约事项', icon: 'none' })
      return
    }

    // 执行校验
    if (!this.validateTimes()) return

    Taro.showLoading({ title: '保存中...' })

    try {
      const params: AppointmentDto = {
        userId: Taro.getStorageSync("userId"),
        subject: subject,
        startTime: combineToDateTime(date, startTime),
        endTime: combineToDateTime(date, endTime)
      }
      
      const {data: resData} = await httpClient.post<IResponse<AppointmentDto>, AppointmentDto>('/appointment/save', params)
      Taro.hideLoading()

      if(resData.state === HTTP_RESPONSE_STATE.success) {
        Taro.showToast({ title: '预约成功' })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      } else {
        Taro.showToast({title: `保存失败 ${resData.msg}`});
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  render() {
    const { subject, date, startTime, endTime } = this.state

    return (
      <View className='add-container' style={{ padding: '20px' }}>
        <View className='form-item'>
          <Text>预约事项</Text>
          <Input 
            value={subject} 
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