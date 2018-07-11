import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    SceneId: '',
    RoomId: '',
    AutomaticList:[]
  },
  onLoad(options) {
    this.setData({
      SceneId: options.sceneid,
      RoomId: options.roomid
    })
    if (options.sceneid != '') {
      this.GetSceneInfo(options.sceneid)
    }

  },
  onShow() {
    this.setData({
      CurHomeRole: app.globalData.CurHomeRole,
    })
  },
  //已加入的自动化列表
  GetSceneInfo(ID) {
    requestPromisified({
      url: h.main + '/selectnoscenario?id=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      console.log(res.data.scenario)
      switch (res.data.result) {
        case 1:
          this.setData({
            AutomaticList: res.data.scenario.scenarios.Scene_AutomaticList,
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！!'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
  //加入联动
  ToAddLD(){
    wx.navigateTo({
      url: '../ldadd/index?roomid=' + this.data.RoomId,
    })
  },
  //移除自动化
  Delete(e) {
    wx.showModal({
      title: '提示',
      content: '确定移除该自动化？',
      success: (res) => {
        if (res.confirm) {
          let temp = this.data.AutomaticList
          temp.splice(e.currentTarget.dataset.idx, 1)
          this.setData({
            AutomaticList: temp
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  CombineChoosedAutomaticList(ChoosedList){
    //剔除重复
    let NoRepeatArray = []
    let OldTemp = this.data.AutomaticList.slice(0)
    // console.log(OldTemp)
    ChoosedList.map((NewItem, NewIdx) => {
      let ifSame = false
      this.data.AutomaticList.map((OldItem, OldIdx) => {
        if (OldItem.id == NewItem.id) {
          ifSame = true
        }
      })
      if (!ifSame) {
        OldTemp.push(NewItem)
      }
    })
    this.setData({
      AutomaticList: OldTemp
    })
    console.log(this.data.AutomaticList)
  },
  Submit(){
    console.log(this.data.AutomaticList)
    if (app.globalData.CurHomeRole == 3) {
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.UpdateChoosedAutomaticList(this.data.AutomaticList)
    }
    wx.navigateBack()
  }
})