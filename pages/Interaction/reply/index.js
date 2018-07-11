import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Info:'',
    ReplyContent:'',
  },
  onLoad(options) {
    this.GetInfo(options.id)
  },
  onShow(){
    console.log('onshow---')
  },
  ChangeReply(e){
    this.setData({
      ReplyContent:e.detail.value
    })
  },
  SumitInfo(){
      requestPromisified({
        url: h.main + '/insertrating1',
        data: {
          name_Z: app.globalData.User_name,
          name_F: this.data.Info.fnamez,
          remark: this.data.ReplyContent,
          ratingid: this.data.Info.ratinglist[0].id, //动态id
          ratinginfoid: this.data.Info.id,
          ftelphone: app.globalData.User_Phone,
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'Accept': 'application/json'
        // }, // 设置请求的 header
      }).then((res) => {
        console.log(res.data)
        switch (res.data.result) {
          case 1:
            wx.showToast({
              title: '回复成功！',
              icon: 'success',
              duration: 1500
            })
            //返回
            wx.navigateBack({
              delta: 1
            })
            break
          case 0:
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '回复失败!'
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
        console.log(res)
      })
  },
  //获取信息
  GetInfo(ID){
    requestPromisified({
      url: h.main + '/selectratinginfo?ratinginfoid=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          this.setData({
            Info: res.data.ratinginfo[0]
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取信息失败!'
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
      console.log(res)
    })
  }
})
