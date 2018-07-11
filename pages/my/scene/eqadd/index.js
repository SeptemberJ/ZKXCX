import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    EQList:[]
  },
  onLoad(options){
    if (options.roomid != ''){
      this.GetCurEQList_room(options.roomid)
    }else{
      this.GetCurEQList(app.globalData.CurHomeId)
    }
  },
  onShow() {
  },
  //选择切换
  Choose(e){
    let Temp = this.data.EQList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.EQList[e.currentTarget.dataset.idx].choosed
    this.setData({
      EQList: Temp
    })
  },
  //临时保存
  Submit(){
    if (app.globalData.CurHomeRole == 3){
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    let ChoosedList = []
    this.data.EQList.map((Item,Idx)=>{
      if (Item.choosed){
        Item.status = 0
        Item.when = 0
        ChoosedList.push(Item)
      }
    })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.CombineChoosedEQList(ChoosedList)
    }
    wx.navigateBack()
  },
  //获取当前家下除了传感器以外设备
  GetCurEQList(CurHomeId) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selecteqlist?homeid=' + CurHomeId,
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
          let Temp = res.data.registermachine
          Temp.map((Item,Idx)=>{
            Item.choosed = false
          })
          this.setData({
            EQList: Temp
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '设备获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
      }).catch((res) => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          image: '../../../../images/icon/attention.png',
          title: '服务器繁忙！'
        });
    })
  },
  //获取当前房间下除了传感器以外设备
  GetCurEQList_room(RoomId){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectroommachine1?roomid=' + RoomId,
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
          let Temp = res.data.roommachine
          Temp.map((Item, Idx) => {
            Item.choosed = false
          })
          this.setData({
            EQList: Temp
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '设备获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  }
})