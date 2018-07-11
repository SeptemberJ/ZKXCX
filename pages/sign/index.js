import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()
var Timer

Page({
  data: {
    User_Name:'',
    User_Phone:'',
    User_Code:'',
    User_Psd:'',
    User_PsdAgain:'',
    IfGetCode:true,
    RealCode:'',
    CountDown:60
  },
  onLoad() {
  },
  //input change
  ChangeUser_Name(e){
    this.setData({
      User_Name:e.detail.value
    })
  },
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
  Confirm_Psd(e) {
    this.setData({
      User_PsdAgain: e.detail.value
    })
  },
  ChangeUser_code(e) {
    this.setData({
      User_Code: e.detail.value
    })
  },
  //获取验证码
  GetCode(){
    if (!(/^1[34578]\d{9}$/).test(this.data.User_Phone)) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '手机号格式！',
        duration: 2000,
      });
      return false
    }
    if (this.data.IfGetCode){
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
    }else{
      return false
    }
  },
  CountDown(){
    let num = this.data.CountDown
    if (num == 0){
      clearTimeout(Timer)
      this.setData({
        CountDown: 60,
        IfGetCode: true
      })
      return false
    }else{
      this.setData({
        CountDown: num - 1
      })
    }
    Timer = setTimeout(() => {
      this.CountDown()
    }, 1000)
  },
  //返回登录
  ToLogin() {
    wx.navigateTo({
      url: '../login/index'
    })
  },
  //注册
  Sign(){
    //校验
    if (this.data.User_Name == '' || this.data.User_Code == '' || this.data.User_Psd == '' || this.data.User_PsdAgain == '' || this.data.User_Phone == ''){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请填写相关信息！',
        duration: 2000,
      });
      return false
    }
    if (!(/^1[34578]\d{9}$/).test(this.data.User_Phone)){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '手机号格式！',
        duration: 2000,
      });
      return false
    }
    if (this.data.User_Psd != this.data.User_PsdAgain){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '密码不一致!',
        duration: 2000,
      });
      return false
    }
    if (this.data.User_Code != this.data.RealCode) {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '验证码错误!',
        duration: 2000,
      });
      return false
    }
    let DATA = {
      fname: this.data.User_Name,
      ftelphone: this.data.User_Phone,
      password: MD5.hexMD5(this.data.User_Psd),
      laiyuan :1
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/register',
      data: {
        registers: DATA
      },
      method: 'POST',
    }).then((res) => {
      switch (res.data.result){
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000,
          })
          this.ToLogin()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '注册失败!',
            duration: 2000,
          });
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '用户名重复!',
            duration: 2000,
          });
          break
        case 3:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '手机号重复！',
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
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！',
          duration: 2000,
        });
    })
  }
})
