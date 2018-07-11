import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Room_name:'',
    IconList: [],
    Room_Icon:'',
    Room_Icon_index:[0],
    Type:0  //0新增 1修改

  },
  onLoad: function (options) {
    this.setData({
      IconList: app.globalData.RoomIconList
    })
    if (options.type == 1){
      //this.GetIconList(options.roomicon)
      this.setData({
        Type: options.type,
        Room_name: options.roomname,
        Room_Icon: options.roomicon,
        RoomId: options.roomid,
        
      })
    }else{
      //this.GetIconList()
      this.setData({
        Type: options.type,
        Room_name: '',
        Room_Icon: '',
      })
    }
   
  },
  onShow() {
    let temp = []
    app.globalData.RoomIconList.map((Item,Idx)=>{
      if(Item.roomimg == this.data.Room_Icon){
        temp[0] = Idx
        this.setData({
          Room_Icon_index: temp
        })
      }
    })
  },
  //选择图片
  bindChange: function (e) {
    console.log(this.data.IconList[e.detail.value[0]].roomimg)
    this.setData({
      Room_Icon: this.data.IconList[e.detail.value[0]].roomimg
    })
  },
  ChangeRoomName(e){
    this.setData({
      Room_name: e.detail.value
    })
  },
  //保存
  Save(){
    if (app.globalData.CurHomeRole == 3) {
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    if(this.data.Type == 0){
      this.CreateRoom()
    }else{
      this.ModifyRoom(this.data.RoomId)
    }
  },
  //新增房间
  CreateRoom() {
    let DATA = {
      registerappuserid: app.globalData.CurHomeId,
      fname: this.data.Room_name,
      room_img: this.data.Room_Icon == '' ? this.data.IconList[0].roomimg : this.data.Room_Icon,
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + '/insertroom',
      data: {
        rooms: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '创建房间成功!',
            icon: 'success',
            duration: 1500
          })
          var pages = getCurrentPages();
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            prePage.GetCurRoomList()
          }
          wx.navigateBack()
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '创建房间失败!'
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
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },

  //ModifyRoom
  ModifyRoom(ID){
    let DATA = {
      id: ID,
      fname: this.data.Room_name,
      room_img: this.data.Room_Icon,
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    requestPromisified({
      url: h.main + '/updateuserroom',
      data: {
        rooms: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '修改成功!',
            icon: 'success',
            duration: 1500
          })
          var pages = getCurrentPages();
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            prePage.GetCurRoomList()
          }
          wx.navigateBack()
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '修改失败!'
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
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },

  //获取图标
  GetIconList(ImgSource) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectroomimg',
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          if (ImgSource!=''){
            let Temp = res.data.roomimglist
            Temp.map((Item, Idx) => {
              if (Item.roomimg == ImgSource) {
                this.setData({
                  Room_Icon_index: [1]
                })
              }
            })
          }
          this.setData({
            //IconList: res.data.roomimglist,
            Room_Icon: res.data.roomimglist[0].roomimg,
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取图标失败'
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
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  }
})