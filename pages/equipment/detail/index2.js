import * as echarts from '../../../ec-canvas/echarts';
import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
const app = getApp();
let chart = null;
var DATA = null
// 不同指标的划分范围
var LimitRange = {
  'PM2.5': [{
    gt: 0,
    lte: 35,
    color: '#096'
  }, {
    gt: 35,
    lte: 75,
    color: '#ffde33'
  }, {
    gt: 75,
    lte: 115,
    color: '#ff9933'
  }, {
    gt: 115,
    lte: 150,
    color: '#cc0033'
  }, {
    gt: 150,
    lte: 250,
    color: '#660099'
  }, {
    gt: 250,
    color: '#7e0023'
  }],
  'CO2': [{
    gt: 350,
    lte: 450,
    color: '#096'
  }, {
    gt: 450,
    lte: 1000,
    color: '#ffde33'
  }, {
    gt: 1000,
    lte: 2000,
    color: '#ff9933'
  }, {
    gt: 2000,
    lte: 5000,
    color: '#cc0033'
  }, {
    gt: 5000,
    color: '#660099'
  }],
  'CO': [{
    gt: 0.1,
    lte: 0.5,
    color: '#096'
  }, {
    gt: 0.5,
    lte: 5,
    color: '#ffde33'
  }, {
    gt: 5,
    lte: 15,
    color: '#ff9933'
  }, {
    gt: 15,
    lte: 100,
    color: '#cc0033'
  }, {
    gt: 100,
    lte: 200,
    color: '#660099'
  }, {
    gt: 200,
    color: '#7e0023'
  }],
  '甲醛': [{
    gt: 0.06,
    lte: 0.1,
    color: '#096'
  }, {
    gt: 0.1,
    lte: 0.5,
    color: '#ffde33'
  }, {
    gt: 0.5,
    lte: 1,
    color: '#ff9933'
  }, {
    gt: 1,
    color: '#cc0033'
  }],
}

// 延迟
function setOption(chart, DAY) {
  wx.getStorage({
    key: 'equipmentInfo',
    success: (res) => {
      let DATA = {
        day: DAY,
        qrcodeid: res.data.EquipmentId,
        kind: res.data.Kind,
      }
      requestPromisified({
        url: h.main + '/selectnoqrcode1',
        data: {
          qrcodes: DATA
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'Accept': 'application/json'
        // }, // 设置请求的 header
      }).then((res) => {
        const option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: res.data.qrcodelist.map(function (item) {
              return item[0];
            })
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          // toolbox: {
          //   left: 'center',
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: 'none'
          //     },
          //     restore: {},
          //     saveAsImage: {}
          //   }
          // },
          // dataZoom: [{
          //   startValue: '2014-06-01'
          // }, {
          //   type: 'inside'
          // }],
          visualMap: {
            top: 10,
            right: 10,
            pieces: LimitRange[DATA.kind],
            outOfRange: {
              color: '#999'
            }
          },
          series: {
            name: '',
            type: 'line',
            data: res.data.qrcodelist.map(function (item) {
              return item[1];
            }),
            markLine: {
              silent: true,
              data: []
            }
          }
        };
        chart.setOption(option);
      }).catch((res) => {
        console.log(res)
      })
    }
  })
}
// 初始无延迟
function initChart(canvas, width, height) {
  console.log('initChart-----------')

  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });

  canvas.setChart(chart);

  var labelRight = {
    normal: {
      position: 'right'
    }
  };

  wx.getStorage({
    key: 'equipmentInfo',
    success: (res) => {
      DATA = {
        day: 7,
        qrcodeid: res.data.EquipmentId,
        kind: res.data.Kind,
      }
      requestPromisified({
        url: h.main + '/selectnoqrcode1',
        data: {
          qrcodes: DATA
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'Accept': 'application/json'
        // }, // 设置请求的 header
      }).then((res) => {
        console.log(LimitRange[DATA.kind])
        const option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: res.data.qrcodelist.map(function (item) {
              return item[0];
            })
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          // toolbox: {
          //   left: 'center',
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: 'none'
          //     },
          //     restore: {},
          //     saveAsImage: {}
          //   }
          // },
          // dataZoom: [{
          //   startValue: '2014-06-01'
          // }, {
          //   type: 'inside'
          // }],
          visualMap: {
            top: 10,
            right: 10,
            pieces: LimitRange[DATA.kind],
            outOfRange: {
              color: '#999'
            }
          },
          series: {
            name: 'Beijing AQI',
            type: 'line',
            data: res.data.qrcodelist.map(function (item) {
              return item[1];
            }),
            markLine: {
              silent: true,
              data: []
            }
          }
        };
        chart.setOption(option);
      }).catch((res) => {
        wx.showToast({
          image: '/images/attention.png',
          title: '服务器繁忙！'
        });
        console.log(res)
      })
    }
  })


}

Page({
  onShareAppMessage: res => {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },

  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },

  data: {
    Kind: 'PM2.5',
    EquipmentId: '',
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    ec2: {
      onInit: initChart
    },
    isLoaded: false,
    isDisposed: false,
    isShowFirst: false,
    DataInfo: [],
    CurTab: 0,
    TabMenu: ['最近7天', '最近2周', '最近一个月'],

  },
  onLoad: function (options) {
    this.GetEquipmentInfo()
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        this.setData({
          Kind: res.data.Kind,
          EquipmentId: res.data.EquipmentId
        })
      }
    })
  },

  // 点击按钮后初始化图表
  init: function (DAY) {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, DAY);

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
  //释放
  dispose: function () {
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      // isDisposed: true,
      isShowFirst: true
    });
  },
  //tab change
  ChangeTab(e) {
    let IDX = e.currentTarget.dataset.idx
    let DAY
    switch (IDX) {
      case 0:
        DAY = 7
        break
      case 1:
        DAY = 14
        break
      case 2:
        DAY = 30
        break
    }
    this.setData({
      CurTab: IDX,
      Day: DAY
    })
    this.init(DAY)
    this.init(DAY)
    this.dispose()
    // if (!this.data.isShowFirst){
    //   this.dispose()
    // }
  },
  GetEquipmentInfo() {
    wx.getStorage({
      key: 'equipmentInfo',
      success: (res) => {
        DATA = {
          day: 7,
          qrcodeid: res.data.EquipmentId,
          kind: res.data.Kind,
        }
        requestPromisified({
          url: h.main + '/selectnoqrcode1',
          data: {
            qrcodes: DATA
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
                EquipmentName: res.data.malist[0].second_name,
                unit: res.data.malist[0].unit,
                Number: res.data.malist[0].number
              })
              break
            case 0:
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '详细数据获取失败！'
              });
              break
            default:
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '服务器繁忙！'
              });
          }
        }).catch((res) => {
          wx.showToast({
            image: '/images/attention.png',
            title: '服务器繁忙！'
          });
          console.log(res)
        })
      }
    })
  }
});
