import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Type:0,
    Sex:0,  //0男 1女
    Age:'',
    Height:'',
    Weight_now:'',
    Weight_target: ''
  },
  onLoad: function (options) {
    this.setData({
      Type: options.type  //0-身高  1-体重
    })
  },
  ChooseSex(e){
    this.setData({
      Sex: e.currentTarget.dataset.sex
    })
  },
  ChangeAge(e){
    this.setData({
      Age: e.detail.value
    })
  },
  ChangeHeight(e){
    this.setData({
      Height: e.detail.value
    })
  },
  ChangeWeight_now(e) {
    this.setData({
      Weight_now: e.detail.value
    })
  },
  ChangeWeight_target(e) {
    this.setData({
      Weight_target: e.detail.value
    })
  },

  
  Submit() {
    if (this.data.Age.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写年龄！'
      });
      return false
    }
    if (this.data.Height.trim() == ''){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写身高！'
      });
      return false
    }
    if (this.data.Weight_now.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写目前体重！'
      });
      return false
    }
    if (this.data.Weight_target.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写目标体重！'
      });
      return false
    }
    wx.showLoading({
      title: ' 加载中',
    })
    let DATA = {
      age: this.data.Age,
      weight: this.data.Weight_now,
      target_weight: this.data.Weight_target,
      height: this.data.Height,
      sex: this.data.Sex,
      ftelphone: app.globalData.User_Phone
    }
    requestPromisified({
      url: h.main + '/updateweight',
      data: {
        weights:DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1500
          })
          if (this.data.Type == '0') {
            wx.navigateTo({
              url: '../weight/index/index'
            })
          } else {
            wx.navigateTo({
              url: '../diet/index/index'
            })
          }
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
})
