import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    chooseDate:'',
    nowDate:'',
    percent:100,
    ifOver: false,
    Surplus: '',
    dietInfo:'',
    dietInfo2:{
      'diet_id': 1,
      'diet_standard':1300,  //当天建议值
      'diet_sum': 543,       //当天目前摄入总值
      'carbohydrate': { 'sum': 69, 'standard': 169 }, //碳水已摄入  建议摄值
      'fat': { 'sum': 12, 'standard': 45.1 },//脂肪已摄入  建议摄值
      'protein': { 'sum': 9, 'standard': 67.6 },//蛋白质已摄入  建议摄值
      'breakfast':{
        'suggestion_min':200,  //早餐建议摄入最小值
        'suggestion_max': 400, //早餐建议摄入最大值
        'sum': 143,            //早餐已摄入总值
        'list':[               //早餐食物列表
          {'food_id':1,'food_name':'草莓果冻','food_amount':'100克','food_contain':'86'},  //id 名称 摄入量 摄入的千卡值
          { 'food_id': 2, 'food_name': '绿茶', 'food_amount': '250克', 'food_contain': '57' }
        ]
      },
      'lunch': {
        'suggestion_min': 350,
        'suggestion_max': 400,
        'sum': 400,
        'list': [
          { 'food_id': 3, 'food_name': '面条', 'food_amount': '200克', 'food_contain': '400' },
        ]
      },
      'dinner': {
        'suggestion_min': 300,
        'suggestion_max': 500,
        'sum': 300,
        'list': []
      },
    },
    ifShow_B:false,
    ifShow_L: false,
    ifShow_D: false,
    
  },
  onLoad(){
    this.setData({
      chooseDate: util.formatTime(new Date()),
      nowDate: util.formatTime(new Date()),
    })
  },
  onShow(){
    this.GetDietInfo(this.data.chooseDate)
  },
  //choose date
  DateChange(e){
    this.setData({
      chooseDate: e.detail.value
    })
    app.globalData.Add_date = e.detail.value
    this.GetDietInfo(e.detail.value)
  },
  //Toggles
  Toggle_B(){
    this.setData({
      ifShow_B: !this.data.ifShow_B
    })
  },
  Toggle_L() {
    this.setData({
      ifShow_L: !this.data.ifShow_L
    })
  },
  Toggle_D() {
    this.setData({
      ifShow_D: !this.data.ifShow_D
    })
  },
  // Adds
  Add_B() {
    wx.navigateTo({
      url: '../list/index?type=0',
    })
  },
  Add_L() {
    wx.navigateTo({
      url: '../list/index?type=1',
    })
  },
  Add_D(){
    wx.navigateTo({
      url: '../list/index?type=2',
    })
  },
  // 对应日期摄入信息
  GetDietInfo(CurDate) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectweighttype1?ftelphone=' + app.globalData.User_Phone + '&faddtime=' + CurDate,
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
          let Temp = res.data.dietInfo[0]
          if (Temp.diet_standard >= Temp.diet_sum){
            this.setData({
              dietInfo: Temp,
              ifOver: false,
              Surplus: (Temp.diet_standard - Temp.diet_sum).toFixed(2)
            })
          }else{
            this.setData({
              dietInfo: Temp,
              ifOver: true,
              Surplus: (Temp.diet_sum - Temp.diet_standard).toFixed(2)
            })
          }
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '获取失败'
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
  // ToDietReport
  ToDietReport(){
    wx.navigateTo({
      url: '../report/index?',
    })
  }
})
