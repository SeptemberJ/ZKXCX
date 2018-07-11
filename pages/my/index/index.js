import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    AccountName:'',
    MessageCount:0,  //新消息数
  },
  onLoad: function () {
    this.setData({
      // userInfo: app.globalData.userInfo,
      AccountName: app.globalData.User_name
    })
  },
  onShow(){
    this.GetMessage()
    this.IfHasInfo()
    wx.login({
      success: (res) => {
        wx.getUserInfo({
          success: (res) => {
            console.log(res)
            this.UpdateHeadImg(res.userInfo.avatarUrl)
            this.setData({
              userInfo: res.userInfo,
            })
          }
        })
      }
    })
  },
  UpdateHeadImg(HeadImg){
    requestPromisified({
      url: h.main + '/updateheagimg?fmobile=' + app.globalData.User_Phone + '&head_img=' + HeadImg,
      data: {
      },
      method: 'GET', 
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '更新失败!'
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
  LogOut() {
    wx.clearStorage()
    wx.reLaunch({
      url: '../../login/index'
    })
  },
  MyRelease() {
    wx.navigateTo({
      url: '../../Interaction/my/index'
    })
  },
  MyIntegral() {
    wx.navigateTo({
      url: '../integral/index'
    })
  },
  MyMessage() {
    wx.navigateTo({
      url: '../../Interaction/message/index'
    })
  },
  MyWeight() {
    if (app.globalData.ifHasInfo) {
      wx.navigateTo({
        url: '../../weight/index/index'
      })
    } else {
      wx.navigateTo({
        url: '../../add/index?type=0'  //0体重
      })
    }
  },
  MyDiet() {
    if (app.globalData.ifHasInfo){
      wx.navigateTo({
        url: '../../diet/index/index?type=1' //1身高
      })
    }else{
      wx.navigateTo({
        url: '../../add/index'
      })
    }
  },
  ToCookingRecord(){
    wx.navigateTo({
      url: '../../cooking/index',
    })
  },
  ToHome() {
    wx.navigateTo({
      url: '../home/list/index',
    })
  },
  ToEquipment(){
    wx.switchTab({
      url: '../../equipment/index/index',
    })
  },
  GetAuthorize(){
    wx.navigateTo({
      url: '../../authorize/index',
    })
  },
  //客服
  MakeCall(){
    wx.makePhoneCall({
      phoneNumber: '021-3100-7227' 
    })
  },
  //商城
  toMall() {
    if (wx.navigateToMiniProgram) {
      wx.navigateToMiniProgram({
        appId: 'wx6a30d2c0aea74559',
        path: '',
        extraData: {
        },
        envVersion: 'trial',
        success(res) {
          // 打开成功
          console.log(res)
        },
        fali(res) {
          // 打开失败
          console.log(res)
        },
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  //获取消息
  GetMessage() {
    requestPromisified({
      url: h.main + '/selectnewinfo?ftelphone=' + app.globalData.User_Phone,
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
            MessageCount: res.data.count
          })
          app.globalData.MessageCount = res.data.count
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
  //是否填写过身高体重
  IfHasInfo(){
    requestPromisified({
      url: h.main + '/selectweighttype?ftelphone=' + app.globalData.User_Phone,
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
          app.globalData.ifHasInfo = true
          break
        case 3:
          app.globalData.ifHasInfo = false
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
  }
})