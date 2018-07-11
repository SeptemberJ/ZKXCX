import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    User_Phone:'',
    User_Psd:'',
    BordeName: false,
    BordePsd: false,
    loadingHidden:true
  },
  onLoad() {
  },
  onShow(){
    console.log('app.globalData.userInfo---')
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log('onshow---')
    // wx.getUserInfo({
    //   success: (res) => {
    //     app.globalData.userInfo = res.userInfo
    //     console.log(res)
    //     this.setData({
    //       userInfo: res.userInfo
    //     })
    //   }
    // })
  }
  ,
  //border焦点
  changeBorderColor_name(){
    this.setData({
      BordeName: true
    })
  },
  changeBorderColor_pds() {
    this.setData({
      BordePsd: true
    })
  },
  NormalBorder(){
    this.setData({
        BordeName: false,
        BordePsd: false
    })
  },
  //input Change
  ChangeUser_Phone(e) {
    this.setData({
      User_Phone: e.detail.value
    })
  },
  ChangeUser_Psd(e) {
    this.setData({
      User_Psd: e.detail.value
    })
  },
  //跳转注册
  GoSign(){
    wx.navigateTo({
      url: '../sign/index'
    })
  },
  //体验者账号
  GoExperiencerAccount(){
    wx.navigateTo({
      url: '../Account/index'
    })
  },
  //调查问卷
  ToQuestionnaire(ID){
    wx.redirectTo({
      url: '../questionnaire/index?id=' + ID
    })
  },
  //跳过问卷
  SkipQuestionnaire() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //登录
  Login(){
    //验证
    if (!this.data.User_Phone){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请输入手机号!',
        duration: 2000,
      });
      return false
    }
    if (!this.data.User_Psd) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请输入密码!',
        duration: 2000,
      });
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    let DATA = {
      ftelphone: this.data.User_Phone,
      password: MD5.hexMD5(this.data.User_Psd),
      head_img: this.data.userInfo? this.data.userInfo.avatarUrl : ''
      // head_img: this.data.userInfo.avatarUrl ? this.data.userInfo.avatarUrl:''
    }
    requestPromisified({
      url: h.main + '/login',
      data: {
        logins: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1: 
          wx.hideLoading()
          let temp_accountInfo = {
            User_Phone: this.data.User_Phone,
            User_Psd: this.data.User_Psd,
            User_name: res.data.registerlist[0].fname
          }
          wx.setStorage({
            key: "UserInfo",
            data: temp_accountInfo
          })
          if (res.data.collectionlist.length>0){
            this.ToQuestionnaire(res.data.collectionlist[0].id)
          }else{
            this.SkipQuestionnaire()
          }
          app.globalData.User_Phone = this.data.User_Phone
          app.globalData.User_name = res.data.registerlist[0].fname
          app.globalData.Add_count = res.data.integral
          this.GetHomeList()
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '密码错误！',
            duration: 2000,
          });
          break
        case 3:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '用户名不存在！',
            duration: 2000,
          });
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '登录失败！',
            duration: 2000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
      }).catch((res) => {
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！',
          duration: 2000,
        });
    })
    
  },
  GetHomeList(){
    //获取home list
    requestPromisified({
      url: h.main + '/selectallhome?ftelphone=' + this.data.User_Phone,
      data: {
      },
      method: 'GET',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          if (res.data.homelist.length>0){
            app.globalData.HomeList = res.data.homelist
            app.globalData.CurHomeRole = res.data.homelist1[0].memberstype
            app.globalData.CurHomeName = res.data.homelist1[0].fname
            if (res.data.homelist1[0].copyid == '') {
              app.globalData.CurHomeId = res.data.homelist1[0].id
            } else {
              app.globalData.CurHomeId = res.data.homelist1[0].copyid
            }
          }
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取家失败！',
            duration: 2000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 2000,
      });
    })
  }
})
