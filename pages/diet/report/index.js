import * as echarts from '../../../ec-canvas/echarts';
import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
const app = getApp();

function initChart_Calorie(canvas, width, height) {
  requestPromisified({
    url: h.main + '/selectreport?report_date=' + app.globalData.Add_date + '&ftelphone=' + app.globalData.User_Phone,
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
        let ChartData_C = res.data.reportData[0]
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
          series: [
            {
              name: '',
              type: 'pie',
              radius: [15, '80%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: ChartData_C.report_calorie.calorie_breakfast.amount, name: '', selected: false },
                { value: ChartData_C.report_calorie.calorie_lunch.amount, name: '' },
                { value: ChartData_C.report_calorie.calorie_dinner.amount, name: '' }
              ]
            },
          ]
        };

        chart.setOption(option);
        return chart;
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

function initChart_Nutrient(canvas, width, height) {
  requestPromisified({
    url: h.main + '/selectreport?report_date=' + app.globalData.Add_date + '&ftelphone=' + app.globalData.User_Phone,
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
        let ChartData_N = res.data.reportData[0]
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
          series: [
            {
              name: '',
              type: 'pie',
              radius: [15, '80%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: ChartData_N.report_nutrient.nutrient_carbohydrate.amount, name: '', selected: false },
                { value: ChartData_N.report_nutrient.nutrient_fat.amount, name: '' },
                { value: ChartData_N.report_nutrient.nutrient_protein.amount, name: '' }
              ]
            },
          ]
        };

        chart.setOption(option);
        return chart;
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

Page({
  data: {
    ec_Calorie: {
      onInit: initChart_Calorie
    },
    ec_Nutrient: {
      onInit: initChart_Nutrient
    },
    reportData: '', 
    reportData2: {
      'report_calorie':{           //卡路里分析
        'calorie_amount': 1235,    //卡路里摄入总量
        'calorie_breakfast':{'amount':60,'percent':'25'}, //早餐 摄入总量 三餐中占比（%号不带）
        'calorie_lunch': { 'amount': 120, 'percent': '50' },//午餐
        'calorie_dinner': { 'amount': 60, 'percent': '25' }//晚餐
      },
      'report_nutrient': {    //营养元素分析
        'nutrient_carbohydrate': { 'amount': 60, 'percent': '25' },//碳水 摄入总量 三餐中占比（%号不带）
        'nutrient_fat': { 'amount': 120, 'percent': '50' },//脂肪
        'nutrient_protein': { 'amount': 60, 'percent': '25' }///蛋白质
      },
      'report_ranking': {  //三种元素含量排名 
        'rank_carbohydrate':[  //碳水
          {'food_name':'绿茶','food_amount':300},  //食物  含量
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ],
        'rank_fat': [  //脂肪
          { 'food_name': '绿茶', 'food_amount': 300 },
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ],
        'rank_protein': [ //蛋白质
          { 'food_name': '绿茶', 'food_amount': 300 },
          { 'food_name': '蛋糕', 'food_amount': 200 }
        ]
      }
    }
  },

  onLoad(options) {
    this.setData({
      reporDate: app.globalData.Add_date
    })
    this.GetReport()
  },
  //获取报告
  GetReport() {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectreport?report_date=' + app.globalData.Add_date + '&ftelphone=' + app.globalData.User_Phone,
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
          let Temp = res.data.reportData[0]
          Temp.report_ranking.rank_carbohydrate = res.data.reportData[0].report_ranking.rank_carbohydrate.reverse().slice(0,3)
          Temp.report_ranking.rank_fat = res.data.reportData[0].report_ranking.rank_fat.reverse().slice(0, 3)
          Temp.report_ranking.rank_protein = res.data.reportData[0].report_ranking.rank_protein.reverse().slice(0, 3)
          wx.hideLoading()
          this.setData({
            reportData: Temp,
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
});
