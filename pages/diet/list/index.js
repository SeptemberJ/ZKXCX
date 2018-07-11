import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    AddType: 0,
    CurKind:0,
    kindList:[
      {
        'kind_name': '常用', 'kind_icon': '../../../images/icon/cy.png', 'kind_icon_active':'../../../images/icon/cy_active.png'},
      { 'kind_name': '主食', 'kind_icon': '../../../images/icon/zs.png', 'kind_icon_active': '../../../images/icon/zs_active.png' },
      { 'kind_name': '肉蛋类', 'kind_icon': '../../../images/icon/rd.png', 'kind_icon_active': '../../../images/icon/rd_active.png' },
      { 'kind_name': '蔬菜', 'kind_icon': '../../../images/icon/sc.png', 'kind_icon_active': '../../../images/icon/sc_active.png' },
      { 'kind_name': '水果', 'kind_icon': '../../../images/icon/sg.png', 'kind_icon_active': '../../../images/icon/sg_active.png' },
      { 'kind_name': '快餐', 'kind_icon': '../../../images/icon/kc.png', 'kind_icon_active': '../../../images/icon/kc_active.png' },
      { 'kind_name': '零食', 'kind_icon': '../../../images/icon/ls.png', 'kind_icon_active': '../../../images/icon/ls_active.png' },
      { 'kind_name': '坚果', 'kind_icon': '../../../images/icon/jg.png', 'kind_icon_active': '../../../images/icon/jg_active.png' },
      { 'kind_name': '饮料饮品', 'kind_icon': '../../../images/icon/yl.png', 'kind_icon_active': '../../../images/icon/yl_active.png' },
      { 'kind_name': '饼干糕点', 'kind_icon': '../../../images/icon/bggd.png', 'kind_icon_active': '../../../images/icon/bggd_active.png' },
      { 'kind_name': '糖果', 'kind_icon': '../../../images/icon/tg.png', 'kind_icon_active':'../../../images/icon/tg_active.png' }
    ],
    foodList:[],
    ChoosedList:[]
    
  },
  onLoad: function (options) {
    console.log('onLoad---')
    this.setData({
      AddType: options.type
    })
    this.GetAllFood()
  },
  onShow(){
    
  },
  // onUnload(){
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否要保存?',
  //     success: (res)=> {
  //       if (res.confirm) {
  //         //添加
  //         this.AddFood()
  //       } else if (res.cancel) {
  //         wx.navigateBack()
  //       }
  //     }
  //   })
  // },
  //搜索框
  ToSearch(){
    wx.navigateTo({
      url: '../search/index?type=' + this.data.AddType,
    })
  },
  //改变当前食物栏目
  ChangeKind(e){
    this.setData({
      CurKind: e.currentTarget.dataset.idx
    })
  },  

  //去添加食物
  ToAddFood(e) {
    let FoodInfo = this.data.foodList[e.currentTarget.dataset.idx]
    let DietDetail = {
                        'type': this.data.AddType,
                        'idx': e.currentTarget.dataset.idx,
                        'food_name': FoodInfo.eatname,
                        'NutrientElements':{
                          'calorie': FoodInfo.eatcalories,
                          'carbohydrate': FoodInfo.carbohydrate,
                          'fat': FoodInfo.eatfat,
                          'protein': FoodInfo.eatprotein,
                        },
                        "NutrientElementsPercent":{
                          'calorie': (FoodInfo.eatcalories * 100).toFixed(0),
                          'carbohydrate': (FoodInfo.carbohydrate * 100).toFixed(0),
                          'fat': (FoodInfo.eatfat * 100).toFixed(0),
                          'protein': (FoodInfo.eatprotein * 100).toFixed(0),
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
      success: (res)=>{
        wx.navigateTo({
          url: '../add/index?sourcetype=' + 0  //食物列表界面进入添加
        })
      },
    })
  },
  // 所有食物列表
  GetAllFood(){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selecteat?ftelphone=' + app.globalData.User_Phone,
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
            foodList: res.data.eatlist,
            DailyTarget: res.data.nameforlist[0],
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
  },
  //显示勾选食物
  ShowChoosed(IDX,FOOD){
    let tempFoodList = this.data.foodList
    let tempChoosedList = this.data.ChoosedList
    let ifHas = false
    tempFoodList[IDX].choosed = true
    tempChoosedList.map((Item,Idx)=>{
      if (Item.eatname == FOOD.eatname){
        console.log('有了---')
        ifHas = true
        tempChoosedList.splice(Idx, 1, FOOD)
      }
    })
    if (!ifHas){
      tempChoosedList.push(FOOD)
    }
    this.setData({
      foodList: tempFoodList,
      ChoosedList: tempChoosedList//ifHas ? tempChoosedList : tempChoosedList.push(FOOD)
    })
  },

  AddFood(){
    requestPromisified({
      url: h.main + '/updateeat',
      data: {
        eats: this.data.ChoosedList
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
            title: '添加成功！',
            icon: 'success',
            duration: 1500
          })
          //返回食物列表
          var pages = getCurrentPages();
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            prePage.ShowChoosed(this.datta.DietDetail.idx)
          }
          wx.navigateBack()

          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '添加失败'
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
