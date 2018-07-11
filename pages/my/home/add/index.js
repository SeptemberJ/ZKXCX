import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Type:0, //0-新增 1-修改
    Home_name:'',
    Home_id:'',
    Membertype:1,
    CanDo:true
  },
  onLoad (options) {
    this.setData({
      Home_name: options.homename,
      Home_id: options.homeid,
      Type: options.type,
      Membertype: options.membertype
    })
   
  },
  onShow() {
    
  },
  ChangeHomeName(e){
    this.setData({
      Home_name: e.detail.value
    })
  },
  SaveHome(){
    if (!this.data.CanDo){
      return false
    }
    if (this.data.Home_name == '' || this.data.Home_name == undefined){
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请输入名称!'
      });
      return false
    }
    if (app.globalData.CurHomeRole == 3) {
      wx.showModal({
        title: '提示',
        content: '权限不足！',
        showCancel: false
      })
      return false
    }
    if (this.data.Type == 0){
      this.CreateHome()
    }else{
      this.ModifyHome()
    }
  },
  //DeleteHome
  DeleteHome(){
    wx.showModal({
      title: '提示',
      content: '确定删除该场景?',
      success: (res) => {
        if (res.confirm) {
          if (app.globalData.CurHomeRole == 3) {
            wx.showModal({
              title: '提示',
              content: '权限不足！',
              showCancel: false
            })
            return false
          }
          wx.showLoading({
            title: '加载中',
          })
          requestPromisified({
            url: h.main + '/deletehome?id=' + this.data.Home_id + '&memberstype=' + this.data.Membertype + '&ftelphone=' + app.globalData.User_Phone,
            data: {
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          }).then((res) => {
            switch (res.data.result) {
              case 1:
                wx.showToast({
                  title: this.data.Membertype == 1 ? '删除成功!' : '退出成功!',
                  icon: 'success',
                  duration: 1500,
                })
                wx.navigateBack()
                wx.hideLoading()
                break
              case 0:
                wx.hideLoading()
                wx.showToast({
                  image: '../../../../images/icon/attention.png',
                  title: this.data.Membertype == 1 ? '删除失败!' : '退出失败!'
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
            console.log(res)
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  //OutHome
  OutHome(){
    this.DeleteHome()
  },
  //新增家
  CreateHome() {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/insertregisterappuser?register_appid=' + app.globalData.User_Phone + '&fname=' + this.data.Home_name,
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
          wx.showToast({
            title: '新增家成功!',
            icon: 'success',
            duration: 1500
          })
          //app.globalData.CurHomeName = this.data.Home_name
          //app.globalData.CurHomeId = res.data.id
          this.ChangeCurHome(res.data.id, this.data.Home_name,1)
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '创建失败!'
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
  },
  //修改家
  ModifyHome() {
    requestPromisified({
      url: h.main + '/updatehome?id=' + this.data.Home_id + '&fname=' + this.data.Home_name,
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
          wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 1500
          })
          app.globalData.CurHomeName = this.data.Home_name
          app.globalData.CurHomeId = res.data.id
          this.ChangeCurHome(res.data.id, this.data.Home_name)
          wx.navigateBack()
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '保存失败!'
          });
          break
        default:
        console.log(res)
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })
  },

  //切换家
  ChangeCurHome(ID, NAME, MEMBERTYPE) {
    requestPromisified({
      url: h.main + '/updatehomeid?id=' + ID + '&ftelphone=' + app.globalData.User_Phone + '&y_id=' + app.globalData.CurHomeId + '&memberstype=' + MEMBERTYPE + '&y_memberstype=' + app.globalData.CurHomeRole,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          app.globalData.CurHomeName = NAME
          app.globalData.CurHomeId = ID
          app.globalData.CurHomeRole = MEMBERTYPE
          wx.navigateBack()
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '切换失败'
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
      console.log(res)
    })
  },
})