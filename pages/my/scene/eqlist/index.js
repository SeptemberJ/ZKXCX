import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    SceneId:'',
    RoomId:'',
    EQList:[],
    EQList2: [{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'status': 0, 'when': 0 }, { 'icon': '../../../../images/icon/delete.png', 'name': '水晶灯', 'room': '传统', 'status': 1, 'when': 2 }],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '打开'
        },
        {
          id: 1,
          name: '关闭'
        }
      ], [
        {
          id: 0,
          name: '立即'
        },
        {
          id: 1,
          name: '1分钟'
        },
        {
          id: 2,
          name: '2分钟'
        },
        {
          id: 3,
          name: '3分钟'
        },
        {
          id: 4,
          name: '4分钟'
        },
        {
          id: 5,
          name: '5分钟'
        }
      ]
    ],
  },
  onLoad(options) {
    let IndexList =[]
    this.data.EQList.map((Item,Idx)=>{
      let temp = [Item.status, Item.when]
      IndexList.push(temp)
    })
    this.setData({
      multiIndexList: IndexList,
      SceneId: options.sceneid,
      RoomId: options.roomid
    })
    if (options.sceneid != ''){
      this.GetSceneInfo(options.sceneid)
    }
  },
  onShow() {
    this.setData({
      CurHomeRole: app.globalData.CurHomeRole,
    })
  },
  Delete(e){
    wx.showModal({
      title: '提示',
      content: '确定移除该设备？',
      success: (res)=> {
        if (res.confirm) {
          let temp = this.data.EQList
          temp.splice(e.currentTarget.dataset.idx,1)
          this.setData({
            EQList: temp
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  bindMultiPickerChange(e) {
    let Temp = this.data.EQList
    Temp[e.currentTarget.dataset.idx].status = e.detail.value[0]
    Temp[e.currentTarget.dataset.idx].when = e.detail.value[1]
    this.setData({
      EQList: Temp
    })
  },
  //已加入的设备列表
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
            EQList: res.data.scenario.scenarios.Scene_EQList,

          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！!'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })

  },
  //整合设备列表
  CombineChoosedEQList(ChoosedList){
    //剔除重复
    let NoRepeatArray = []
    let OldTemp = this.data.EQList.slice(0)
    // console.log(OldTemp)
    ChoosedList.map((NewItem,NewIdx)=>{
      let ifSame = false
      this.data.EQList.map((OldItem, OldIdx) => {
        if (OldItem.id == NewItem.id) {
          ifSame = true
        }
      })
      if (!ifSame){
        OldTemp.push(NewItem)
      }
    })
    this.setData({
      EQList: OldTemp
    })
    console.log(this.data.EQList)
  },
  //加入设备
  ToAddEq(){
    wx.navigateTo({
      url: '../eqadd/index?roomid=' + this.data.RoomId,
    })
  },
  Submit(){
    console.log(this.data.EQList)
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
      prePage.UpdateChoosedEQList(this.data.EQList)
    }
    wx.navigateBack()
  }
})