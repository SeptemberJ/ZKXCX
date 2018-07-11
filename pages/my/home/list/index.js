import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    HomeList:[]   //1管理员  0家庭成员
  },
  onShow(){
    this.GetHomeList()
  },
  //添加家
  FirstAdd() {
    wx.navigateTo({
      url: '../add/index?type=0'
    })
  },
  Edit_home(e){
    // if (e.currentTarget.dataset.membertype == 1){
    //   wx.navigateTo({
    //     url: '../add/index?type=1' + '&homename=' + e.currentTarget.dataset.homename + '&homeid=' + e.currentTarget.dataset.homeid + '&membertype=' + e.currentTarget.dataset.membertype
    //   })
    // }else{
    //   return false
    // }
    wx.navigateTo({
      url: '../add/index?type=1' + '&homename=' + e.currentTarget.dataset.homename + '&homeid=' + e.currentTarget.dataset.homeid + '&membertype=' + e.currentTarget.dataset.membertype
    })
    
  },
  GetHomeList(){
    wx.showLoading({
      title: '加载中',
    })
    //获取home list
    requestPromisified({
      url: h.main + '/selectallhome?ftelphone=' + app.globalData.User_Phone,
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
            HomeList: res.data.homelist
          })
          app.globalData.HomeList = res.data.homelist
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取家失败！'
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  }
})