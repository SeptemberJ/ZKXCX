import * as echarts from '../../../ec-canvas/echarts';
import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
const app = getApp();
var HeathData

function initChart(canvas, width, height) {
  //获取消息
    requestPromisified({
      url: h.main + '/selecthealthreport?ftelphone=' + app.globalData.User_Phone,
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
          HeathData = res.data.healthreport[0]
          const chart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(chart);

          var option = {
            backgroundColor: "#ffffff",
            color: ["#37A2DA", "#73a373", "#ffdb5c", "#ea7e53", "#c23531"],
            series: [{
              name: '体重',
              type: 'gauge',
              min: 0,
              max: 150,
              detail: {
                formatter: '{value}'
              },
              axisLine: {
                show: true,
                lineStyle: {
                  width: 10,
                  shadowBlur: 0,
                  color: [
                    [0.2, '#67e0e3'],
                    [0.4, '#73a373'],
                    [0.6, '#ffdb5c'],
                    [0.8, '#ea7e53'],
                    [1, '#c23531']
                  ]
                }
              },
              splitLine: { // 分隔线
                length: 15, // 属性length控制线长
                // lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                //   width: 3,
                //   color: '#fff',
                //   shadowColor: '#fff', //默认透明
                //   shadowBlur: 10
                // }
              },
              data: [{
                value: res.data.healthreport[0].weight,
                name: '公斤',
              }]

            }]
          };

          chart.setOption(option, true);

          return chart;

          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '消息获取失败!'
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
        image: '../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    HeathData:'',
    ShapType:''
  },

  onShow() {
    this.GetHeath()
  },
  // 跳转修改体重，体围
  ToSetInfo(){
    wx.navigateTo({
      url: '../../setInfo/index',
    })
  },
  //跳转健康报告
  ToWeightReport(){
    wx.navigateTo({
      url: '../report/index',
    })
  },
  GetHeath(){
      //获取消息
      wx.showLoading({
        title: '加载中',
      })
      requestPromisified({
        url: h.main + '/selecthealthreport?ftelphone=' + app.globalData.User_Phone,
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
            if (res.data.healthreport[0].size == 0){
              this.setData({
                ShapType:'信息不够，无法判断出您的体型哦'
              })
            }else{
              switch (res.data.healthreport[0].sex){
                case '1':   //女
                  switch (res.data.healthreport[0].size){
                    case '1':
                      this.setData({
                        ShapType: '梨型'
                      })
                      break
                    case '2':
                      this.setData({
                        ShapType: '轻度梨型'
                      })
                      break
                    case '3':
                      this.setData({
                        ShapType: '正常'
                      })
                      break
                    case '4':
                      this.setData({
                        ShapType: '轻度苹果型'
                      })
                      break
                    case '5':
                      this.setData({
                        ShapType: '苹果型'
                      })
                      break
                  }
                break
                case '0':  //男
                  switch (res.data.healthreport[0].size) {
                    case '1':
                      this.setData({
                        ShapType: '正常'
                      })
                      break
                    case '2':
                      this.setData({
                        ShapType: '轻度苹果型'
                      })
                      break
                    case '3':
                      this.setData({
                        ShapType: '苹果型'
                      })
                  }
                break
              }

            }
            this.setData({
              HeathData: res.data.healthreport[0],
            })
            
            wx.hideLoading()
            break
          case 0:
            wx.hideLoading()
            wx.showToast({
              image: '../../../images/icon/attention.png',
              title: '消息获取失败!'
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
      })
    }
});
