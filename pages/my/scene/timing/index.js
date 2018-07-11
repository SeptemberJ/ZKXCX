import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    TimeStart:'00:00',
    TimeEnd: '23:59',
    SingleTime:true, 
    Monday:false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  },
  onLoad(options) {
    if (options.sceneid !=''){
      this.GetSceneInfo(options.sceneid)
    }
  },
  onShow() {
    this.setData({
      CurHomeRole: app.globalData.CurHomeRole,
    })
  },
  bindTimeChange_start(e){
    this.setData({
      TimeStart: e.detail.value
    })
  },
  bindTimeChange_end(e) {
    this.setData({
      TimeEnd: e.detail.value
    })
  },
  ChooseControl(e){
    switch(e.currentTarget.dataset.idx){
      case '0':
        this.setData({
          SingleTime: true,
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
        })
        break
      case '1':
        this.setData({
          SingleTime: false,
          Monday: !this.data.Monday,
        })
        break
      case '2':
        this.setData({
          SingleTime: false,
          Tuesday: !this.data.Tuesday,
        })
        break
      case '3':
        this.setData({
          SingleTime: false,
          Wednesday: !this.data.Wednesday,
        })
        break
      case '4':
        this.setData({
          SingleTime: false,
          Thursday: !this.data.Thursday,
        })
        break
      case '5':
        this.setData({
          SingleTime: false,
          Friday: !this.data.Friday,
        })
        break
      case '6':
        this.setData({
          SingleTime: false,
          Saturday: !this.data.Saturday,
        })
        break
      case '7':
        this.setData({
          SingleTime: false,
          Sunday: !this.data.Sunday,
        })
        break
    }
  },
  Submit(){
    if (!this.data.SingleTime && !this.data.Monday && !this.data.Tuesday && !this.data.Wednesday && !this.data.Thursday && !this.data.Friday && !this.data.Saturday && !this.data.Sunday){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请选定时日期！'
      });
      return false
    }
    let tempInfo = {
      time_start: this.data.TimeStart,
      time_end: this.data.TimeEnd,
      time_control: {
        SingleTime: this.data.SingleTime ? '1' : '0',
        Monday: this.data.Monday ? '1' : '0',
        Tuesday: this.data.Tuesday ? '1' : '0',
        Wednesday: this.data.Wednesday ? '1' : '0',
        Thursday: this.data.Thursday ? '1' : '0',
        Friday: this.data.Friday ? '1' : '0',
        Saturday: this.data.Saturday ? '1' : '0',
        Sunday: this.data.Sunday ? '1' : '0',
      }
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.UpdateTiming(tempInfo)
    }
    wx.navigateBack()
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true,
    // })
    // requestPromisified({
    //   url: h.main + '/insertroom',
    //   data: {
    //     rooms: DATA
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // }).then((res) => {
    //   switch (res.data.result) {
    //     case 1:
    //       var pages = getCurrentPages();
    //       if (pages.length > 1) {
    //         var prePage = pages[pages.length - 2];
    //         prePage.GetCurRoomList()
    //       }
    //       wx.navigateBack()
    //       break
    //     case 0:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '创建房间失败!'
    //       });
    //       break
    //     default:
    //       wx.showToast({
    //         image: '../../../../images/icon/attention.png',
    //         title: '服务器繁忙！'
    //       });
    //   }
    // }).catch((res) => {
    //   wx.showToast({
    //     image: '../../../../../images/icon/attention.png',
    //     title: '服务器繁忙！'
    //   });
    // })

  },
  //该场景的定时信息
  GetSceneInfo(ID) {
    requestPromisified({
      url: h.main + '/selectnoscenario?id=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          let Info = res.data.scenario.scenarios.Scene_timing
          this.setData({
            TimeStart: Info.time_start,
            TimeEnd: Info.time_end,
            SingleTime: Info.time_control.SingleTime == 0?false:true,
            Monday: Info.time_control.Monday == 0 ? false : true,
            Tuesday: Info.time_control.Tuesday == 0 ? false : true,
            Wednesday: Info.time_control.Wednesday == 0 ? false : true,
            Thursday: Info.time_control.Thursday == 0 ? false : true,
            Friday: Info.time_control.Friday == 0 ? false : true,
            Saturday: Info.time_control.Saturday == 0 ? false : true,
            Sunday: Info.time_control.Sunday == 0 ? false : true,
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取失败!'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！!'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })

  },

})