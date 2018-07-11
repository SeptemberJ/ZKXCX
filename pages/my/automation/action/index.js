import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    SceneList:[],
    EQList:[],
    Toggle_Scene: false,
    Toggle_EQ:false,
  },
  onLoad(options) {
    
    if (options.roomid != '') {
      this.GetRoomEQList(options.roomid)
      this.GetRoomSceneList(options.roomid)
    } else {
      this.GetCurEQlist(app.globalData.CurHomeId)
      this.GetCurSceneList(app.globalData.CurHomeId)
    }
  },
  onShow() {

  },
  //Toggles
  Toggle(e){
    switch(e.currentTarget.dataset.kind){
      case 'EQ':
        this.setData({
          Toggle_EQ: !this.data.Toggle_EQ
        })
        break
      case 'Scene':
        this.setData({
          Toggle_Scene: !this.data.Toggle_Scene
        })
        break
    }
  },
  //选择切换--设备
  ChooseEQ(e) {
    let Temp = this.data.EQList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.EQList[e.currentTarget.dataset.idx].choosed
    this.setData({
      EQList: Temp
    })
  },
  //选择切换--场景
  ChooseScene(e) {
    let Temp = this.data.SceneList
    Temp[e.currentTarget.dataset.idx].choosed = !this.data.SceneList[e.currentTarget.dataset.idx].choosed
    this.setData({
      SceneList: Temp
    })
  },
  //获取当前家下场景列表
  GetCurSceneList(CurHomeId) {
    requestPromisified({
      url: h.main + '/selectallscenario?id=' + CurHomeId,
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
          this.setData({
            SceneList: res.data.scenariolist
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取场景失败!'
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
  //获取当前房间下场景列表
  GetRoomSceneList(CurHomeId) {
    requestPromisified({
      url: h.main + '/selectallscenarioroom?id=' + CurHomeId,
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
          this.setData({
            SceneList: res.data.scenariolist
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取场景失败!'
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
  //获取当前家下除了传感器设备列表
  GetCurEQlist(CurHomeId) {
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
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          let Temp = res.data.registermachine
          Temp.map((Item, Idx) => {
            Item.choosed = false
          })
          this.setData({
            EQList: Temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '传感器获取失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: 'D传感器服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '传感器服务器繁忙！'
      });
    })
  },
  //获取当前房间下除了传感器设备
  GetRoomEQList(RoomId) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectroommachine1?roomid=' + RoomId,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            EQList: res.data.roommachine
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '删除失败'
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
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
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
    let ActionList = []
    // let ChoosedList_EQ =[] 
    // let ChoosedList_Scene= [] 
    this.data.EQList.map((Item, Idx) => {
      if (Item.choosed) {
        Item.status = 0
        Item.when = 0
        Item.kind = 'equipment'
        ActionList.push(Item)
      }
    })
    this.data.SceneList.map((Item, Idx) => {
      if (Item.choosed) {
        Item.status = 0
        Item.when = 0
        Item.kind = 'scene'
        ActionList.push(Item)
      }
    })
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.UpdateAction(ActionList)
    }
    wx.navigateBack()
  }
})