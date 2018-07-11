import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()
var Timer
Page({
  data: {
    User_Phone:null,
    IfGetCode: true,
    RealCode: null,
    CountDown: 60,
    User_Code: null,
  },
  onLoad: function () {
    
  },
  ChangeUser_Phone(e) {
    this.setData({
      User_Phone: e.detail.value
    })
  },
  ChangeUser_code(e) {
    this.setData({
      User_Code: e.detail.value
    })
  },
  //获取验证码
  GetCode() {
    if (!(/^1[34578]\d{9}$/).test(this.data.User_Phone)) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '手机号格式！',
        duration: 2000,
      });
      return false
    }
    if (this.data.IfGetCode) {
      this.setData({
        IfGetCode: false
      })
      requestPromisified({
        url: h.main + '/smsSend',
        data: {
          fmobile: this.data.User_Phone
        },
        method: 'GET',
      }).then((res) => {
        switch (res.data.result) {
          case 1:
            wx.hideLoading()
            this.setData({
              RealCode: res.data.code
            })
            break
          case 0:
            wx.hideLoading()
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '获取失败!',
            });
            break
          default:
            wx.hideLoading()
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '服务器繁忙！',
            });
        }
      }).catch((res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！',
        });
      })
      this.CountDown()
    } else {
      return false
    }
  },
  CountDown() {
    let num = this.data.CountDown
    if (num == 0) {
      clearTimeout(Timer)
      this.setData({
        CountDown: 60,
        IfGetCode: true
      })
      return false
    } else {
      this.setData({
        CountDown: num - 1
      })
    }
    Timer = setTimeout(() => {
      this.CountDown()
    }, 1000)
  },
  //调查问卷
  ToQuestionnaire(ID) {
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
  LoginIn() {
    if (!this.data.User_Phone) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '输入手机号！',
        duration: 2000,
      });
      return false
    }
    if (!this.data.User_Code) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '输入验证码！',
        duration: 2000,
      });
      return false
    }
    if (this.data.RealCode != this.data.User_Code){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '验证码错误！',
        duration: 2000,
      });
      return false
    }
    let ExperiencerAccount = {
      User_Phone:'18234567899',
      User_Psd:'111'
    }
    wx.showLoading({
      title: '加载中',
    })
    let DATA = {
      ftelphone: ExperiencerAccount.User_Phone,
      password: MD5.hexMD5(ExperiencerAccount.User_Psd),
      head_img: ''
    }
    requestPromisified({
      url: h.main + '/login',
      data: {
        logins: DATA
      },
      method: 'POST', 
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          let temp_accountInfo = {
            User_Phone: ExperiencerAccount.User_Phone,
            User_Psd: ExperiencerAccount.User_Psd,
            User_name: res.data.registerlist[0].fname
          }
          wx.setStorage({
            key: "UserInfo",
            data: temp_accountInfo
          })
          if (res.data.collectionlist.length > 0) {
            this.ToQuestionnaire(res.data.collectionlist[0].id)
          } else {
            this.SkipQuestionnaire()
          }
          app.globalData.User_Phone = ExperiencerAccount.User_Phone
          app.globalData.User_name = res.data.registerlist[0].fname
          app.globalData.Add_count = res.data.integral
          this.GetHomeList(ExperiencerAccount.User_Phone)
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
  GetHomeList(ExperiencerAccountUser_Phone) {
    //获取home list
    requestPromisified({
      url: h.main + '/selectallhome?ftelphone=' + ExperiencerAccountUser_Phone,
      data: {
      },
      method: 'GET',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          if (res.data.homelist.length > 0) {
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
