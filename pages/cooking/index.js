import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
import * as echarts from '../../ec-canvas/echarts';
//获取应用实例
const app = getApp()
//延迟
function setOption(chart,day) {
    wx.showLoading({
      title: ' 加载中',
    })
    requestPromisified({
      url: h.main + '/selectcookday?ftelphone=' + app.globalData.User_Phone + '&day=' + day,
      data: {
      },
      method: 'GET',
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          const option = {
            color: ['#37a2da', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e7bcf3','#8378ea'],
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // legend: {
            //   orient: 'vertical',
            //   x: 'left',
            //   data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
            // },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                clickable: false,
                // selectedMode: 'single',
                radius: [15, '90%'],

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
                data: res.data.cooklist
              },

            ]
          };
          chart.setOption(option);
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
}
//无延迟
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  
  requestPromisified({
    url: h.main + '/selectcookday?ftelphone=' + app.globalData.User_Phone + '&day=0',
    data: {
    },
    method: 'GET',
  }).then((res) => {
    switch (res.data.result) {
      case 1:
        wx.hideLoading()
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          // legend: {
          //   orient: 'vertical',
          //   x: 'left',
          //   data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
          // },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              clickable: false,
              // selectedMode: 'single',
              radius: [15, '90%'],

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
              data: res.data.cooklist
            },

          ]
        };
        chart.setOption(option);
        break
      case 0:
        wx.hideLoading()
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '提交失败!'
        });
        break
      default:
        wx.hideLoading()
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！'
        });
    }
  }).catch((res) => {
    console.log(res)
    wx.hideLoading()
    wx.showToast({
      image: '../../images/icon/attention.png',
      title: '服务器繁忙！'
    });
  })
  
  // return chart;
}
Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    ec2: {
      onInit: initChart
    },
    isLoaded: false,
    isDisposed: false,
    isShowFirst: true,
    array:['当天','7天','14天','一个月'],
    index:0
  },
  onLoad(options) {
    this.GetCookingData(0)
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-pie');
  },
  onShow(){
    // this.GetCookingData(0)
    
  },
  bindPickerChange(e){
    let IDX = e.detail.value
    let DAY
    switch (IDX) {
      case '0':
        DAY = 0
        break
      case '1':
        DAY = 7
        break
      case '2':
        DAY = 14
        break
      case '3':
        DAY = 30
        break
    }
    this.setData({
      index: e.detail.value
    })
    this.init(DAY)
    this.GetCookingData(DAY)
    // this.init(DAY)
    // this.dispose()
    this.setData({
      index: e.detail.value
    })
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


  GetCookingData(Day) {
    wx.showLoading({
      title: ' 加载中',
    })
    requestPromisified({
      url: h.main + '/selectcookday?ftelphone=' + app.globalData.User_Phone + '&day=' + Day,
      data: {
      },
      method: 'GET', 
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            IfEmpty: res.data.cooklist.length
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },
})
