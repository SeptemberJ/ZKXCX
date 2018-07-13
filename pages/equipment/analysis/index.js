import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    ifHasData:false,
    EquipmentId:'',
    dataList:[
      { 'kind': 'PM2.5', 'value': '', 'img': '../../../images/icon/pm2.5.png', 'unit':'μg/m³'},
      { 'kind': 'CO2', 'value': '', 'img': '../../../images/icon/co2.png', 'unit':'ppm'},
      { 'kind': 'CO', 'value': '', 'img': '../../../images/icon/CO.png', 'unit': 'ppm'},
      { 'kind': '甲醛', 'value': '', 'img': '../../../images/icon/HCHO.png', 'unit': 'ppm' },
      { 'kind': '温度', 'value': '', 'img': '../../../images/icon/temperature.png', 'unit': '°C' },
      { 'kind': 'VOCs', 'value': '', 'img': '../../../images/icon/steamer.png', 'unit': '' }
    ]
  },
  onLoad: function (options) {
    this.setData({
      EquipmentId: options.id,
      EquipmentName: options.name
    })
  },
  onShow: function(){
    this.GetCurData(this.data.EquipmentId)
  },
  ToDetail(e){
    let Info = {
      Kind: e.currentTarget.dataset.kind,
      EquipmentId: this.data.EquipmentId,
      EquipmentName: this.data.EquipmentName,
      Data: e.currentTarget.dataset.datavalue
    }
    wx.setStorage({
      key: "equipmentInfo",
      data: Info
    })
    wx.navigateTo({
      url: '../detail/index'
    })
  },
  //获取当前监测数据
  GetCurData(ID) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectnoqrcode?qrcodeid=' + ID,
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
          let temp = this.data.dataList.slice(0)
          temp.map((item,idx)=>{
            switch (item.kind){
              case 'PM2.5':
                item.value = res.data.qrcodelist[0].PM25
                break
              case 'CO2':
                item.value = res.data.qrcodelist[0].CO2
                break
              case 'CO':
                item.value = res.data.qrcodelist[0].CO
                break
              case '甲醛':
                item.value = res.data.qrcodelist[0].formaldehyde
                break
              case '温度':
                item.value = res.data.qrcodelist[0].temperature
                break
              case 'VOCs':
                item.value = res.data.qrcodelist[0].VOCs
                break
            }
          })
          this.setData({
            dataList: temp,
            ifHasData: true
          })
          wx.hideLoading()
          break
        case 2:
          wx.hideLoading()
          this.setData({
            ifHasData: false
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '获取监测数据失败'
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
})
