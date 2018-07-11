import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    IconList: [],
    Equipment_Icon: 0,
    Equipment_Name: '',
    Equipment_Code_F: '',
    Equipment_Code_S: '',
    RoomId:null,
    CanDo:true
  },
  onLoad(options){
    this.setData({
      RoomId: options.roomid,
    })
    this.GetIconList()
  },
  onShow(){
    app.GetLocation()
  },
  //选择图片
  bindChange: function (e) {
    this.setData({
      Equipment_Icon: this.data.IconList[e.detail.value[0]].img
    })
  },
  //input change
  ChangeEquipment_Name(e) {
    this.setData({
      Equipment_Name: e.detail.value
    })
  },
  ChangeEquipment_Code_F(e) {
    this.setData({
      Equipment_Code_F: e.detail.value
    })
  },
  ChangeEquipment_Code_S(e) {
    this.setData({
      Equipment_Code_S: e.detail.value
    })
  },
  //扫码
  Scan_Code_F() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          Equipment_Code_F: res.result
        })
      }
    })
  },
  Scan_Code_S(){
    wx.scanCode({
      success: (res) => {
        this.setData({
          Equipment_Code_S: res.result
        })
      }
    })
  },
  //新增设备
  AddEquipment() {
    app.GetLocation()
    if (!this.data.CanDo){
      return false
    }
    if (app.globalData.CurHomeRole == 3) {
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    //校验
    if (!this.data.Equipment_Name || !this.data.Equipment_Code_F || !this.data.Equipment_Code_S) {
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '请填写相关信息！'
      });
      return false
    }
    if (app.globalData.latitude == '' || app.globalData.longitude == ''){
      wx.showToast({
        image: '../../../images/icon/attention.png',
        title: '定位失败！'
      });
      return false
    }
   
    let DATA = {
      machine_img: this.data.Equipment_Icon,
      second_name: this.data.Equipment_Name,
      master_control: this.data.Equipment_Code_F,
      second_qrcode: this.data.Equipment_Code_S,
      ftelphone: app.globalData.User_Phone,
      homeid: app.globalData.CurHomeId,
      roomid: this.data.RoomId ? this.data.RoomId:''
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectqrcode',
      data: {
        qrcodes: DATA,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude 
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
          wx.showToast({
            title: '新增成功！',
            icon: 'success',
            duration: 1500
          })
          this.setData({
            CanDo: true
          })
          //返回
          wx.navigateBack();
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '条码不存在!',
            duration:2000
          });
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '新增失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
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
  },

  //获取图标
  GetIconList(){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectmachineimg',
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            IconList: res.data.machineimglist,
            Equipment_Icon: res.data.machineimglist[0].img,
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '获取图标失败'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
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