import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  onLoad(){
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'UserInfo',
      success: (res) => {
        app.globalData.User_Phone = res.data.User_Phone
        app.globalData.User_name = res.data.User_name
        this.IfHasWirteQuestionnaire(res.data.User_Phone)
        //获取home list
        requestPromisified({
          url: h.main + '/selectallhome?ftelphone=' + res.data.User_Phone,
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
                if (res.data.homelist1[0].copyid==''){
                  app.globalData.CurHomeId = res.data.homelist1[0].id
                }else{
                  app.globalData.CurHomeId = res.data.homelist1[0].copyid
                }
              }
              wx.switchTab({
                url: '../index/index'
              })
              break
            case 0:
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '服务器繁忙！'
              });
              break
            default:
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '服务器繁忙！'
              });
          }
        }).catch((res) => {
          console.log(res)
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
        })
        
      },
      fail: (res) => {
        wx.navigateTo({
          url: '../login/index'
        })
      },
      complete: (res) => {
        wx.hideLoading()
      },
    })
  },
  //是否填过问卷
  IfHasWirteQuestionnaire(PhoneNumber){
    requestPromisified({
      url: h.main + '/selectregisterstatus?ftelphone=' + PhoneNumber,
      data: {
      },
      method: 'GET', 
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          app.globalData.IfHasWirteQuestionnaire = res.data.registerlist[0].fstatus1   //1-已填 0-未填 2-跳过
          app.globalData.QuestionnaireId = res.data.registerlist[0].collectionid
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '问卷填写失败！'
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  }
})