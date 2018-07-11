import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    airQuality:'',
    weaid:''
  },
  onLoad(options){
    this.setData({
      weaid: options.weaid
    })
  },
  onShow: function () {
    this.GetDeatilTemperature()
  },
  GetDeatilTemperature(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + '/selecttemperature1?weaid=' + this.data.weaid,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            airQuality: res.data.temperaturelist
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取信息失败'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
      wx.hideLoading()
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  }
})
