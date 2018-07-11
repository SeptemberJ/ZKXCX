import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Cur_tab:0,
    integral:0,
    getRecordList:[],
    costRecordList:[]
  },
  onShow(){
    this.GetIntegral()
  },
  ChangeTab(){
    this.setData({
      Cur_tab: this.data.Cur_tab == 0?1:0
    })
  },
  //获取积分
  GetIntegral() {
    requestPromisified({
      url: h.main + '/selectintegral?ftelphone=' + app.globalData.User_Phone,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            getRecordList: res.data.integrallist,
            integral: res.data.count
          })
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '消息获取失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
})