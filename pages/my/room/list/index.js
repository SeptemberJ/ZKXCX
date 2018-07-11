import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Cur_tab: 0,
    EQList:[],
    AutomaticList:[],
    SceneList:[],
    RoomName:'',
    RoomId:null,
  },
  onLoad(options){
    this.setData({
      RoomId: options.roomid,
      RoomName: options.roomname,
      CurHomeRole: app.globalData.CurHomeRole,
    })
  },
  onShow(){
    this.GetRoomEQList()
    switch (this.data.Cur_tab) {
      case '0':
        this.GetRoomEQList()
        break
      case '1':
        this.GetCurAutomaticList()
        break
      case '2':
        this.GetCurSceneList()
        break
    }
  },
  ChangeTab(e){
    switch (e.currentTarget.dataset.idx) {
      case '0':
        this.GetRoomEQList()
        break
      case '1':
         this.GetCurAutomaticList()
        break
      case '2':
        this.GetCurSceneList()
        break
    }
    this.setData({
      Cur_tab: e.currentTarget.dataset.idx
    })
  },
  AddEquipment(){
    // wx.showActionSheet({
    //   itemList: ['导入现有设备', '新增设备'],
    //   success: (res) => {
    //     console.log(res.tapIndex)
    //   },
    //   fail:(res)=> {
    //     console.log(res)
    //   }
    // })
    wx.navigateTo({
      url: '../../../equipment/add/index?roomid=' + this.data.RoomId,
    })
  },
  //添加场景
  ToAddScene() {
    wx.navigateTo({
      url: '../../scene/setting/index?type=0&roomid=' + this.data.RoomId   //0新增
    })
  },
  //添加自动化
  ToAddAutomatic() {
    wx.navigateTo({
      url: '../../automation/add/index?type=0&roomid=' + this.data.RoomId  //0新增
    })
  },
  //开关设备
  ToggleOpenClose_EQ(e) {
    let EQid = e.currentTarget.dataset.eqid
    let EQstatus = e.currentTarget.dataset.eqstatus == '0' ? '1' : '0'
    let EQIdx = e.currentTarget.dataset.idx
    requestPromisified({
      url: h.main + '/updatecurrentswitch?machineid=' + EQid + '&status=' + EQstatus,
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
          // wx.showToast({
          //   title: '修改成功！',
          //   icon: 'success',
          //   duration: 1500
          // })
          let temp = this.data.EQList
          temp[EQIdx].on_off_status = EQstatus
          this.setData({
            EQList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '修改失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })

  },
  //删除设备
  DeleteEQ(e) {
    if (app.globalData.CurHomeRole == 1) {
      return false
    }
    let ID = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该设备?',
      success: (res) => {
        if (res.confirm) {
          requestPromisified({
            url: h.main + '/deletenoqrcode?qrcodeid=' + ID,
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
                  title: '删除成功！',
                  icon: 'success',
                  duration: 1500
                })
                this.GetRoomEQList()
                break
              case 0:
                wx.showToast({
                  image: '../../../../images/icon/attention.png',
                  title: '删除失败'
                });
                break
              default:
                wx.showToast({
                  image: '../../../../images/icon/attention.png',
                  title: '服务器繁忙！'
                });
            }
          }).catch((res) => {
            wx.showToast({
              image: '../../../../images/icon/attention.png',
              title: '服务器繁忙！'
            });
            console.log(res)
          })
        } else if (res.cancel) {
          return false
        }
      }
    })
  },
  //开关场景
  ToggleOpenClose_scene(e) {
    let SceneId = e.currentTarget.dataset.sceneid
    let SceneStatus = e.currentTarget.dataset.scenestatus == '0' ? '1' : '0'
    let SceneIdx = e.currentTarget.dataset.idx
    requestPromisified({
      url: h.main + '/updatescenario?id=' + SceneId + '&status=' + SceneStatus,
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
          // wx.showToast({
          //   title: '修改成功！',
          //   icon: 'success',
          //   duration: 1500
          // })
          let temp = this.data.SceneList
          temp[SceneIdx].on_off_status = SceneStatus
          this.setData({
            SceneList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '修改失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })

  },
  //开关自动化
  ToggleOpenClose_automatic(e) {
    let AutomaticId = e.currentTarget.dataset.automaticid
    let AutomaticStatus = e.currentTarget.dataset.automaticstatus == '0' ? '1' : '0'
    let AutomaticIdx = e.currentTarget.dataset.idx
    requestPromisified({
      url: h.main + '/updatenoautomation?id=' + AutomaticId + '&status=' + AutomaticStatus,
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
          // wx.showToast({
          //   title: '修改成功！',
          //   icon: 'success',
          //   duration: 1500
          // })
          let temp = this.data.AutomaticList
          temp[AutomaticIdx].on_off_status = AutomaticStatus
          this.setData({
            AutomaticList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '修改失败!'
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
  //获取房间设备
  GetRoomEQList() {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectroommachine?roomid=' + this.data.RoomId,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            EQList: res.data.roommachine
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '删除失败'
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
  //获取当前房间下场景
  GetCurSceneList() {
    requestPromisified({
      url: h.main + '/selectallscenarioroom?id=' + this.data.RoomId,
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
            SceneList: res.data.scenariolist
          })
          break
        case 0:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '获取场景失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })

  },
  //获取当前房间下自动化
  GetCurAutomaticList() {
    requestPromisified({
      url: h.main + '/selectallautomationroom?id=' + this.data.RoomId,
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
            AutomaticList: res.data.automationlist
          })
          break
        case 0:
          wx.showToast({
            image: '../../.../../images/icon/attention.png',
            title: '获取自动化失败!'
          });
          break
        default:
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
    })

  },
  //编辑场景
  ToEdit_scene(e) {
    wx.navigateTo({
      url: '../../scene/setting/index?sceneid=' + e.currentTarget.dataset.sceneid + '&type=1' +'&roomid=' + this.data.RoomId,
    })
  },
  //编辑自动化
  ToEdit_automatic(e){
    wx.navigateTo({
      url: '../../automation/add/index?automaticid=' + e.currentTarget.dataset.automaticid + '&type=1' + '&roomid=' + this.data.RoomId,
    })

  }
})