import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    AutomaticList: []
  },
  onLoad(options) {
    if (options.roomid != '') {
      this.GetCurAutomaticList_room(options.roomid)
    } else {
      this.GetCurAutomaticList(app.globalData.CurHomeId)
    }
  },
  onShow() {


  },
  //选择切换
  Choose(e) {
    let Temp = this.data.AutomaticList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.AutomaticList[e.currentTarget.dataset.idx].choosed
    this.setData({
      AutomaticList: Temp
    })
  },
  //Submit
  Submit() {
    if (app.globalData.CurHomeRole == 3) {
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    let ChoosedList = []
    this.data.AutomaticList.map((Item, Idx) => {
      if (Item.choosed) {
        // Item.status = 0
        // Item.when = 0
        ChoosedList.push(Item)
      }
    })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.CombineChoosedAutomaticList(ChoosedList)
    }
    wx.navigateBack()
  },
  //获取当前家下自动化
  GetCurAutomaticList(CurHomeId) {
    requestPromisified({
      url: h.main + '/selectallautomation?id=' + app.globalData.CurHomeId,
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
          let Temp = res.data.automationlist
          Temp.map((Item, Idx) => {
            Item.choosed = false
          })
          this.setData({
            AutomaticList: Temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取自动化失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
  //当前房间下自动化
  GetCurAutomaticList_room(RoomId) {
    requestPromisified({
      url: h.main + '/selectallautomationroom?id=' + RoomId,
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
          let Temp = res.data.automationlist
          Temp.map((Item, Idx) => {
            Item.choosed = false
          })
          this.setData({
            AutomaticList: Temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../.../../images/icon/attention.png',
            title: '获取自动化失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  }
})