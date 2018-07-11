import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
import * as echarts from '../../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {

  wx.getStorage({
    key: 'DietDetail',
    success: (res) => {
      var NutrientElementData = res.data
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      var option = {
        color: ['#91c7ae', '#c23531', '#ffdb5c'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: 'vertical',
        //   x: 'left',
        //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        // },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: NutrientElementData.NutrientElements.carbohydrate, name: '碳水化合物' },
              { value: NutrientElementData.NutrientElements.fat, name: '脂肪' },
              { value: NutrientElementData.NutrientElements.protein, name: '蛋白质' }
            ]
          }
        ]
      };

      chart.setOption(option, true);

      return chart;

    }
  })



}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    DietDetail:'',
    IngestionAmount:100,
    Calorie:'',
    Carbohydrate: '',
    Fat: '',
    Protein: '',
    DishStyle:'',
    CookingMethodIndex:0,
    CookingMethodList:[]
  },
  onLoad(options){
    this.setData({
      sourceType: options.sourcetype
    })
    console.log('options---' + options.sourcetype)
  },
  onShow(){
    this.GetCookingMethod()
    wx.getStorage({
      key: 'DietDetail',
      success: (res)=>{
        this.setData({
          DietDetail: res.data,
          Calorie: (res.data.NutrientElements.calorie * this.data.IngestionAmount / 100).toFixed(0),
          Carbohydrate: (res.data.NutrientElements.carbohydrate * this.data.IngestionAmount / 100).toFixed(2),
          Fat: (res.data.NutrientElements.fat * this.data.IngestionAmount / 100).toFixed(2),
          Protein: (res.data.NutrientElements.protein * this.data.IngestionAmount / 100).toFixed(2),
        })
      },
    })
    
  },
  //改变摄入值
  ChangeIngestionAmount(e){
    let AMOUNT = e.detail.value
    this.setData({
      IngestionAmount: AMOUNT,
      Calorie: (this.data.DietDetail.NutrientElements.calorie * AMOUNT/100).toFixed(2),
      Carbohydrate: (this.data.DietDetail.NutrientElements.carbohydrate * AMOUNT / 100).toFixed(2),
      Fat: (this.data.DietDetail.NutrientElements.fat * AMOUNT / 100).toFixed(2),
      Protein: (this.data.DietDetail.NutrientElements.protein * AMOUNT / 100).toFixed(2),
    })
  },
  //菜式
  ChangeDishStyle(e){
    this.setData({
      DishStyle: e.detail.value
    })
  },
  //烹饪方式
  ChangeCookingMethod(e){
    this.setData({
      CookingMethodIndex: e.detail.value
    })
  },
  // 对应日期摄入信息
  AddFood2(){
    let DATA = {
      'eatname': this.data.DietDetail.food_name,
      'eatcalories': this.data.Calorie,
      'eatweight': this.data.IngestionAmount,
      'fat': this.data.Fat,
      'protein': this.data.Protein,
      'carbohydrate': this.data.Carbohydrate,
      'eattype': this.data.DietDetail.type,
      'ftelphone': app.globalData.User_Phone
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.ShowChoosed(this.data.DietDetail.idx, DATA)
    }
    wx.navigateBack()
  },
  //添加食物
  AddFood() {
    let DATA = {
      'faddtime': app.globalData.Add_date,
      'cooktype': '',//this.data.CookingMethodList[this.data.CookingMethodIndex].typename,
      'dishes': '',//this.data.DishStyle,
      'eatname': this.data.DietDetail.food_name,
      'eatcalories': this.data.Calorie,   
      'eatweight': this.data.IngestionAmount,
      'fat': this.data.Fat,    
      'protein': this.data.Protein,    
      'carbohydrate': this.data.Carbohydrate,  
      'eattype': this.data.DietDetail.type,
      'ftelphone': app.globalData.User_Phone
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/updateeat',
      data: {
        eats: DATA
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
          if(this.data.sourceType == 0){
            //返回食物列表
            var pages = getCurrentPages();
            if (pages.length > 1) {
              var prePage = pages[pages.length - 2];
              prePage.ShowChoosed(this.data.DietDetail.idx, DATA)
            }
            wx.navigateBack()
          }else{
            wx.navigateBack()
          }
          

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
  },
  //获取烹饪方式
  GetCookingMethod(){
    requestPromisified({
      url: h.main + '/selectcookingtype',
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
          wx.hideLoading()
          this.setData({
            CookingMethodList: res.data.cooklist
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '烹饪方式获取失败'
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
      })
    });
  }
});
