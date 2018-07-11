import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    AddType:0,
    Keyword:'',
    ResultList:[],
    DailyTarget:''
    
  },
  onLoad: function (options) {
    this.setData({
      AddType: options.type
    })
  },
  onShow(){
    
  },
  //输入食物
  ChangeKeyword(e){
    this.setData({
      ResultList:[]
    })
    this.SearchFood((e.detail.value).trim())
  },

  //去添加食物
  ToAddFood(e) {
    let FoodInfo = this.data.ResultList[e.currentTarget.dataset.idx]
    let DietDetail = {
      'type': this.data.AddType,
      'idx': e.currentTarget.dataset.idx,
      'food_name': FoodInfo.eatlist[0].eatname,
      'NutrientElements': {
        'calorie': FoodInfo.eatlist[0].eatcalories,
        'carbohydrate': FoodInfo.eatlist[0].carbohydrate,
        'fat': FoodInfo.eatlist[0].eatfat,
        'protein': FoodInfo.eatlist[0].eatprotein,
      },
      "NutrientElementsPercent": {
        'calorie': (FoodInfo.eatlist[0].eatcalories * 100).toFixed(0),
        'carbohydrate': (FoodInfo.eatlist[0].carbohydrate * 100).toFixed(0),
        'fat': (FoodInfo.eatlist[0].eatfat * 100).toFixed(0),
        'protein': (FoodInfo.eatlist[0].eatprotein * 100).toFixed(0),
      },
      "DailyTarget": {
        'calorie': this.data.DailyTarget.calories,
        'carbohydrate': this.data.DailyTarget.carbohydrate,
        'fat': this.data.DailyTarget.fat,
        'protein': this.data.DailyTarget.protein,
      },
    }
    wx.setStorage({
      key: 'DietDetail',
      data: DietDetail,
      success: (res) => {
        wx.navigateTo({
          url: '../add/index?sourcetype=' + 1  //查询界面进入添加
        })
      },
    })
  },


  //查询
  SearchFood(KEYWORD){
      wx.showLoading({
        title: '加载中',
      })
      requestPromisified({
        url: h.main + '/selecteatmohu?eatname=' + KEYWORD + '&ftelphone=' + app.globalData.User_Phone,
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
            wx.hideLoading()
            this.setData({
              ResultList: res.data.mohulist,
              DailyTarget: res.data.mohulist.length>0 ? res.data.mohulist[0].nameforlist[0]:'',
            })
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
  }
  
})
