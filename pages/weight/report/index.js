import * as echarts from '../../../ec-canvas/echarts';
import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
const app = getApp();

function setOption(chart) {
  requestPromisified({
    url: h.main + '/selecthealthreport1?ftelphone=' + app.globalData.User_Phone,
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
        const option = {
          color: ['#8ce1fa'],
          animation: false,
          legend: {
            top: 'bottom',
            data: ['意向']
          },
          tooltip: {
            triggerOn: 'none',
            position: function (pt) {
              return [pt[0], 130];
            }
          },
          xAxis: {
            type: 'time',
            // boundaryGap: [0, 0],
            axisPointer: {
              value: '2016-10-7',
              //snap: true,
              lineStyle: {
                color: '#8ce1fa',
                opacity: 0.5,
                width: 2
              },
              label: {
                show: true,
                formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd', params.value);
                },
                backgroundColor: '#8ce1fa'
              },
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              inside: true
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              inside: true,
              formatter: '{value}\n'
            },
            z: 10
          },
          grid: {
            top: 30,
            left: 15,
            right: 15,
            height: 130
          },
          dataZoom: [{
            type: 'inside',
            throttle: 50
          }],
          series: [
            {
              name: '',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: '#8ce1fa'
                }
              },
              stack: 'a',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8ce1fa'
                  }, {
                    offset: 1,
                    color: '#ffe'
                  }])
                }
              },
              data: res.data.HeathEvaluation[0].weight_trend.weight_trend_data
            }

          ]
        };
        chart.setOption(option);
        // chart.setOption(option);
        // return chart;

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

  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
  },

  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    isLoaded: false,
    isDisposed: false,
    CurSwitch: 0,
    HeathDataIndex: '',
    distance: 0,
    Distance_width: 132,
    HeathEvaluation: '',
    HeathEvaluation2: {
      weight: {
        weight_now: 50,     //现在体重数值
        weight_target: 57,  //目标体重数值
        weight_differ_i: -10,   //理想与现在的差值 (负数直接给负号保留)
        weight_differ_t: 7,   //目标与现在的差值 (负数直接给负号保留)
        weight_ideal: 60,   //理想体重数值
      },
      muscle: {    //肌肉  先写死，都给0
        muscle_now: 0,
        muscle_target: 0,
        muscle_differ_i: 0,
        muscle_ideal: 0,
      },
      fat: {
        fat_now: 16,     //现在脂肪数值
        fat_target: 13,  //目标脂肪数值
        fat_differ_i: -4,   //理想与现在的差值 (负数直接给负号保留)
        fat_ideal: 12,   //理想脂肪数值
      },
      weight_trend: {
        weight_lately_number: 6.0,  //与上一次的差值(负数直接给负号保留)
        weight_lately_date: '2018-04-01',
        weight_month_number: 16.0,  //与相近月初的差值(负数直接给负号保留)
        weight_month_date: '2018-03-01',
        weight_trend_data: [    //一个月的体重list
          ['2018-03-01', '50'],  ///日期  体重数值
          ['2018-03-02', '51'],
          ['2018-03-03', '52'],
          ['2018-03-04', '52']
        ]
      },
      disease: {       //疾病风险评估  1-5风险值
        hypertension: 1,
        fattyLiver: 2,
        bloodFat: 3,
        diabetes: 4,
      }
    }
  },

  onShow() {
    this.GetHeathIndex()
    this.GetHeathEvaluation()
  },

  // 点击按钮后初始化图表
  init: function (DAY) {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width ? width : app.globalData.width,
        height: height ? height : app.globalData.width,
      });
      setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  dispose: function () {
    // if (this.chart) {
    //   this.chart.dispose();
    // }

    this.setData({
      isDisposed: true
    });
  },
  //change tab
  Switch() {
    this.setData({
      CurSwitch: this.data.CurSwitch == 0 ? 1 : 0
    })
    if (this.data.CurSwitch == 1){
      this.init()
    }
    this.dispose()
  },
  //数据指标
  GetHeathIndex() {
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
          let Width = this.data.Distance_width
          let Info = res.data.healthreport[0]
          this.setData({
            HeathDataIndex: Info
          })
          switch (Info.type) {
            case '1':
              this.setData({
                distance: Info.BMI * (Width / 18.5) + Width * (Info.type - 1)
              })
              break
            case '2':
              this.setData({
                distance: (Info.BMI - 18.5) * (Width / (24.0 - 18.5)) + Width * (Info.type - 1)
              })
              break
            case '3':
              this.setData({
                distance: (Info.BMI - 24.0) * (Width / (28.0 - 24.0)) + Width * (Info.type - 1)
              })
              break
            case '4':
              this.setData({
                distance: (Info.BMI - 28.0) * (Width / (30.0 - 28.0)) + Width * (Info.type - 1)
              })
              break
            case '5':
              this.setData({
                distance: (Info.BMI - 30.0) * (Width / (50.0 - 30.0)) + Width * (Info.type - 1) > 710 ? 680 : (Info.BMI - 30.0) * (Width / (50.0 - 30.0)) + Width * (Info.type - 1)
              })
              break
          }

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
  },
  //身体测评
  GetHeathEvaluation() {
    //获取消息
    requestPromisified({
      url: h.main + '/selecthealthreport1?ftelphone=' + app.globalData.User_Phone,
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
          this.setData({
            HeathEvaluation: res.data.HeathEvaluation[0]
          })
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
});
