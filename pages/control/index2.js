import * as echarts from '../../ec-canvas/echarts';
import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()
let chart = null;
var DATA = null
var DataInfo = {
  '0': [['0', 0], ['6', 2], ['12', 8], ['18', 12]],
  '1': [['一', 0], ['二', 2], ['三', 8], ['四', 12], ['五', 12], ['六', 30], ['日', 33]],
  '2': [['4', '0'], ['11', '2'], ['18', '8'], ['25', '12']],
  '3': [['1', '32'], ['2', '2'], ['3', '8'], ['4', '12'], ['5', '12'], ['6', '30'], ['7', '120'], ['8', '145'], ['9', '12'], ['10', '12'], ['11', '55'], ['12', '60']],
}
var data2 = [['0', '0'], ['6', '2'], ['12', '80'], ['18', '12']];
// 延迟
function setOption(chart, DAY) {
  //静态
  const option = {
    title: {
      text: 'Beijing AQI'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      splitLine: {
        show: true
      },
      data: data2.map(function (item) {
        return item[0];
      })
    },
    yAxis: {
      splitLine: {
        show: true
      }
    },
    // toolbox: {
    //     left: 'center',
    //     feature: {
    //         dataZoom: {
    //             yAxisIndex: 'none'
    //         },
    //         restore: {},
    //         saveAsImage: {}
    //     }
    // },
    dataZoom: [{
      startValue: '2014-06-01'
    }, {
      type: 'inside'
    }],
    visualMap: {
      top: 10,
      right: 10,
      pieces: [{
        gt: 0,
        lte: 50,
        color: '#096'
      }, {
        gt: 50,
        lte: 100,
        color: '#ffde33'
      }, {
        gt: 100,
        lte: 150,
        color: '#ff9933'
      }, {
        gt: 150,
        lte: 200,
        color: '#cc0033'
      }, {
        gt: 200,
        lte: 300,
        color: '#660099'
      }, {
        gt: 300,
        color: '#7e0023'
      }],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      name: 'Beijing AQI',
      type: 'line',
      data: data2.map(function (item) {
        return item[1];
      }),
      markLine: {
        silent: true,
        data: [{
          yAxis: 50
        }, {
          yAxis: 100
        }, {
          yAxis: 150
        }, {
          yAxis: 200
        }, {
          yAxis: 300
        }]
      }
    }
  }
  // const option = {
  //   title: {
  //     text: ''
  //   },
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   xAxis: {
  //     splitLine: {
  //       show: true
  //     },
  //     data: DataInfo[DAY].map(function (item) {
  //       return item[0];
  //     })
  //   },
  //   yAxis: {
  //     splitLine: {
  //       show: true
  //     }
  //   },
  //   toolbox: {
  //     left: 'center',
  //     feature: {
  //       dataZoom: {
  //         yAxisIndex: 'none'
  //       },
  //       restore: {},
  //       saveAsImage: {}
  //     }
  //   },
  //   dataZoom: [{
  //     startValue: '2014-06-01'
  //   }, {
  //     type: 'inside'
  //   }],
  //   visualMap: {
  //     top: 10,
  //     right: 10,
  //     pieces: [{
  //       gt: 0,
  //       lte: 50,
  //       color: '#096'
  //     }, {
  //       gt: 50,
  //       lte: 100,
  //       color: '#ffde33'
  //     }, {
  //       gt: 100,
  //       lte: 150,
  //       color: '#ff9933'
  //     }, {
  //       gt: 150,
  //       lte: 200,
  //       color: '#cc0033'
  //     }, {
  //       gt: 200,
  //       lte: 300,
  //       color: '#660099'
  //     }, {
  //       gt: 300,
  //       color: '#7e0023'
  //     }],
  //     outOfRange: {
  //       color: '#999'
  //     }
  //   },
  //   series: {
  //     name: '',
  //     type: 'line',
  //     data: DataInfo[DAY].map(function (item) {
  //       return item[1];
  //     }),
  //     markLine: {
  //       silent: true,
  //       data: []
  //     }
  //   }
  // };
  chart.setOption(option);
  return chart;
  //服务器
  // wx.showLoading({
  //   title: '加载中',
  // })
  // let DATA = {
  //   day: DAY,
  //   qrcodeid: res.data.EquipmentId,
  //   kind: res.data.Kind,
  // }
  // console.log(LimitRange[DATA.kind])
  // requestPromisified({
  //   url: h.main + '/selectnoqrcode1',
  //   data: {
  //     qrcodes: DATA
  //   },
  //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //   // header: {
  //   //   'content-type': 'application/x-www-form-urlencoded',
  //   //   'Accept': 'application/json'
  //   // }, // 设置请求的 header
  // }).then((res) => {
  //   switch (res.data.result) {
  //     case 1:
  //       const option = {
  //         title: {
  //           text: ''
  //         },
  //         tooltip: {
  //           trigger: 'axis'
  //         },
  //         xAxis: {
  //           data: res.data.qrcodelist.map(function (item) {
  //             return item[0];
  //           })
  //         },
  //         yAxis: {
  //           splitLine: {
  //             show: false
  //           }
  //         },
  //         // toolbox: {
  //         //   left: 'center',
  //         //   feature: {
  //         //     dataZoom: {
  //         //       yAxisIndex: 'none'
  //         //     },
  //         //     restore: {},
  //         //     saveAsImage: {}
  //         //   }
  //         // },
  //         // dataZoom: [{
  //         //   startValue: '2014-06-01'
  //         // }, {
  //         //   type: 'inside'
  //         // }],
  //         visualMap: {
  //           top: 10,
  //           right: 10,
  //           pieces: [],//LimitRange[DATA.kind],
  //           outOfRange: {
  //             color: '#999'
  //           }
  //         },
  //         series: {
  //           name: '',
  //           type: 'line',
  //           data: res.data.qrcodelist.map(function (item) {
  //             return item[1];
  //           }),
  //           markLine: {
  //             silent: true,
  //             data: []
  //           }
  //         }
  //       };
  //       chart.setOption(option);
  //       wx.hideLoading()
  //       break
  //     case 0:
  //       wx.hideLoading()
  //       wx.showToast({
  //         image: '../../../images/attention.png',
  //         title: '数据获取失败！'
  //       });
  //       break
  //     default:
  //       wx.showToast({
  //         image: '../../../images/attention.png',
  //         title: '服务器繁忙！'
  //       });
  //   }
  // }).catch((res) => {
  //   console.log(res)
  // })
}
// 初始无延迟
function initChart(canvas, width, height) {
  //静态
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
  const option = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: DataInfo[0].map(function (item) {
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
      pieces: [],//LimitRange[DATA.kind],
      outOfRange: {
        color: '#999'
      }
    },
    series: {
      name: '',
      type: 'line',
      data: DataInfo[0].map(function (item) {
        return item[1];
      }),
      markLine: {
        silent: true,
        data: []
      }
    }
  };
  chart.setOption(option);
  //服务器
  // wx.showLoading({
  //   title: '加载中',
  // })
  // chart = echarts.init(canvas, null, {
  //   width: width,
  //   height: height
  // });

  // canvas.setChart(chart);

  // var labelRight = {
  //   normal: {
  //     position: 'right'
  //   }
  // };

  // DATA = {
  //   day: 7,
  //   qrcodeid: '36125338-0831-429D-B8CE-58B4667E66B2',
  //   kind: 'CO2',
  // }
  // requestPromisified({
  //   url: h.main + '/selectnoqrcode1',
  //   data: {
  //     qrcodes: DATA
  //   },
  //   method: 'POST', 
  // }).then((res) => {
  //   switch (res.data.result) {
  //     case 1:
  //       const option = {
  //         title: {
  //           text: ''
  //         },
  //         tooltip: {
  //           trigger: 'axis'
  //         },
  //         xAxis: {
  //           data: res.data.qrcodelist.map(function (item) {
  //             return item[0];
  //           })
  //         },
  //         yAxis: {
  //           splitLine: {
  //             show: false
  //           }
  //         },
  //         // toolbox: {
  //         //   left: 'center',
  //         //   feature: {
  //         //     dataZoom: {
  //         //       yAxisIndex: 'none'
  //         //     },
  //         //     restore: {},
  //         //     saveAsImage: {}
  //         //   }
  //         // },
  //         // dataZoom: [{
  //         //   startValue: '2014-06-01'
  //         // }, {
  //         //   type: 'inside'
  //         // }],
  //         visualMap: {
  //           top: 10,
  //           right: 10,
  //           pieces: [],//LimitRange[DATA.kind],
  //           outOfRange: {
  //             color: '#999'
  //           }
  //         },
  //         series: {
  //           name: '',
  //           type: 'line',
  //           data: res.data.qrcodelist.map(function (item) {
  //             return item[1];
  //           }),
  //           markLine: {
  //             silent: true,
  //             data: []
  //           }
  //         }
  //       };
  //       chart.setOption(option);
  //       wx.hideLoading()
  //       break
  //     case 0:
  //       wx.hideLoading()
  //       wx.showToast({
  //         image: '../../../images/attention.png',
  //         title: '数据获取失败！'
  //       });
  //       break
  //     default:
  //       wx.showToast({
  //         image: '../../../images/attention.png',
  //         title: '服务器繁忙！'
  //       });
  //   }
  // }).catch((res) => {
  //   wx.showToast({
  //     image: '../../../images/attention.png',
  //     title: '服务器繁忙！'
  //   });
  //   console.log(res)
  // })


}
Page({
  data: {
    EquipmentType: 1, //0-空调  1-灯
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    // ec2: {
    //   onInit: initChart
    // }, 
    isLoaded: false,
    isDisposed: false,
    isShowFirst: true,
    DataInfo: [],
    CurTab: 0,
    TabMenu: ['日', '周', '月', '年'],
    IfShowChart: false

  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },
  onLoad: function (options) {
  },
  //ToggleShowChart
  ToggleShowChart() {
    this.setData({
      IfShowChart: !this.data.IfShowChart
    })
    this.init(this.data.CurTab)
  },
  //仅开关类设备
  OnlySwitch() {
    // const innerAudioContext = wx.createInnerAudioContext()
    // innerAudioContext.autoplay = true
    // innerAudioContext.src = 'https://jingshangs.com/upload/ON.mp3'
    // innerAudioContext.onPlay(() => {
    //   console.log('播放')
    // })
    // innerAudioContext.onError((res) => {
    //   console.log(res)
    // })
    // wx.showModal({
    //   title: '提示',
    //   content: '控制器不在线！',
    //   showCancel:false,
    //   success: (res)=> {
    //   }
    // })
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
      isShowFirst: false
    });
  },
  //tab change
  ChangeTab(e) {
    let IDX = e.currentTarget.dataset.idx
    let DAY
    switch (IDX) {
      case 0:
        DAY = 0
        break
      case 1:
        DAY = 1
        break
      case 2:
        DAY = 2
        break
      case 3:
        DAY = 3
        break
    }
    this.setData({
      CurTab: IDX,
      Day: DAY
    })
    this.init(DAY)
    // this.init(DAY)
    this.dispose()
    // if (!this.data.isShowFirst){
    //   this.dispose()
    // }
  },
  // ChangeTab(e) {
  //   let IDX = e.currentTarget.dataset.idx
  //   let DAY
  //   switch (IDX) {
  //     case 0:
  //       DAY = 0
  //       break
  //     case 1:
  //       DAY = 1
  //       break
  //     case 2:
  //       DAY = 2
  //       break
  //     case 3:
  //       DAY = 3
  //       break
  //   }
  //   this.setData({
  //     CurTab: IDX,
  //     Day: DAY
  //   })
  //   this.init(DAY)
  //   this.dispose()
  // },


  Submit() {
    requestPromisified({
      url: h.main + '/',
      data: {
        weights: DATA
      },
      method: 'POST',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 1500
          })
          if (this.data.Type == '0') {
            wx.navigateTo({
              url: '../weight/index/index'
            })
          } else {
            wx.navigateTo({
              url: '../diet/index/index'
            })
          }
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败!'
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
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
})
