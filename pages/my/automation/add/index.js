import h from '../../../../utils/url.js'
var util = require('../../../../utils/util.js')
var MD5 = require('../../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    Type: 0,
    CurAutomaticId: '',
    RoomId: '',
    AutomaticName:'',
    ConditionList:[],
    ActionList:[],
    ConditionList2: [{ 'icon': '../../../../images/icon/delete.png', 'name': '时间', 'room': '', 'when': 0, 'status': 0, 'kind': 'time', 'time_start': '00:00', 'time_end': '23:59' },{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'when': 0, 'status': 0, 'kind': 'aircondition' }, { 'icon': '../../../../images/icon/delete.png', 'name': '水晶灯', 'room': '传统', 'when': 1, 'status': 1,  'kind': 'light'}],
    ActionList2: [{ 'icon': '../../../../images/icon/delete.png', 'name': '灯带', 'room': '玄关', 'when': 0, 'status': 0, 'kind': 'equipment' }, { 'icon': '../../../../images/icon/delete.png', 'name': '回家', 'room': '', 'when': 0, 'status': 1,  'kind': 'scene' }],
    ConditionKind:{
      'time': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ]
      ],
      'd002': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ], [
          {
            id: 0,
            name: '寒冷'
          },
          {
            id: 1,
            name: '舒适'
          },
          {
            id: 2,
            name: '炎热'
          }
        ]
      ],
      'd001': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ], [
          {
            id: 0,
            name: '昏暗'
          },
          {
            id: 1,
            name: '舒适'
          },
          {
            id: 2,
            name: '明亮'
          }
        ]
      ],
      'd003': [
        [
          {
            id: 0,
            name: '变为'
          },
          {
            id: 1,
            name: '此时正好'
          }
        ], [
          {
            id: 0,
            name: '有人'
          },
          {
            id: 1,
            name: '无人'
          }
        ]
      ]
    },
    ActionKind: {
      'equipment': [
        [
          {
            id: 0,
            name: '立即'
          },
          {
            id: 1,
            name: '1分钟'
          },
          {
            id: 2,
            name: '2分钟'
          },
          {
            id: 3,
            name: '3分钟'
          },
          {
            id: 4,
            name: '4分钟'
          },
          {
            id: 5,
            name: '5分钟'
          }
        ],
        [
          {
            id: 0,
            name: '打开'
          },
          {
            id: 1,
            name: '关闭'
          }
        ]
      ],
      'scene': [
        [
          {
            id: 0,
            name: '立即'
          },
          {
            id: 1,
            name: '1分钟'
          },
          {
            id: 2,
            name: '2分钟'
          },
          {
            id: 3,
            name: '3分钟'
          },
          {
            id: 4,
            name: '4分钟'
          },
          {
            id: 5,
            name: '5分钟'
          }
        ],
        [
          {
            id: 0,
            name: '执行'
          }
        ]
      ]
    },
  },
  onLoad(options) {
    // let IndexList = []
    // this.data.ConditionList.map((Item, Idx) => {
    //   let temp = [Item.status, Item.when]
    //   IndexList.push(temp)
    // })
    // this.setData({
    //   multiIndexList: IndexList
    // })
    if (options.automaticid) {
      this.GetAutomaticInfo(options.automaticid)
      this.setData({
        Type: options.type, //0新增  1-修改
        RoomId: options.roomid ? options.roomid : '',
        CurAutomaticId: options.automaticid
      })
    } else {
      this.setData({
        Type: options.type, //0新增  1-修改
        RoomId: options.roomid ? options.roomid : '',
        CurAutomaticId: options.automaticid
      })
    }
  },
  onShow() {
    this.setData({
      CurHomeRole: app.globalData.CurHomeRole,
    })
  },
  ChangeName(e){
    this.setData({
      AutomaticName: e.detail.value
    })
  },
  //AddAction
  AddAction(){
    wx.navigateTo({
      url: '../action/index?roomid=' + this.data.RoomId,
    })
  },
  //AddCondition
  AddCondition() {
    wx.navigateTo({
      url: '../condition/index',
    })
  },
  //改变时间
  bindTimeChange_start(e){
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].time_start = e.detail.value
    this.setData({
      ConditionList: Temp
    })
  },
  bindTimeChange_end(e) {
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].time_end = e.detail.value
    this.setData({
      ConditionList: Temp
    })
  },
  bindMultiPickerChange(e) {
    let Temp = this.data.ConditionList
    Temp[e.currentTarget.dataset.idx].when = e.detail.value[0]
    if (e.detail.value[1]){
      Temp[e.currentTarget.dataset.idx].status = e.detail.value[1]
    }
    this.setData({
      ConditionList: Temp
    })
  },
  bindMultiPickerChangeAction(e) {
    let Temp = this.data.ActionList
    Temp[e.currentTarget.dataset.idx].when = e.detail.value[1]
    Temp[e.currentTarget.dataset.idx].status = e.detail.value[0]
    this.setData({
      ActionList: Temp
    })
  },
  //UpdateCondition
  UpdateCondition(ConditionList){
    //不剔除重复
    let NoRepeatArray = []
    let OldTemp = this.data.ConditionList.slice(0)
    ConditionList.map((NewItem, NewIdx) => {
      OldTemp.push(NewItem)
    })
    this.setData({
      ConditionList: OldTemp
    })
  },
  //UpdateAction
  UpdateAction(ActionList){
    //剔除重复
    let NoRepeatArray = []
    let OldTemp = this.data.ActionList.slice(0)
    ActionList.map((NewItem, NewIdx) => {
      let ifSame = false
      this.data.ActionList.map((OldItem, OldIdx) => {
        if (OldItem.id == NewItem.id) {
          ifSame = true
        }else{
          console.log(OldItem.id)
          console.log(NewItem.id)
        }
      })
      if (!ifSame) {
        OldTemp.push(NewItem)
      }
    })
    console.log(OldTemp)
    this.setData({
      ActionList: OldTemp
    })
    // console.log(this.data.EQList)

    // this.setData({
    //   ActionList: ActionList
    // })
  },
  //获取创建信息
  GetAutomaticInfo(ID) {
    requestPromisified({
      url: h.main + '/selectnoautomation?id=' + ID,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            AutomaticName: res.data.automation.automations.AutomaticName,
            ConditionList: res.data.automation.automations.ConditionList,
            ActionList: res.data.automation.automations.ActionList,
            
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
  Submit() {
    if (this.data.Type == 0) {
      this.Submit_add()
    } else {
      this.Submit_modify()
    }
  },

  //新增
  Submit_add() {
    //校验
    if (this.data.AutomaticName == '') {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请填写名称!'
      });
      return false
    }
    if (this.data.ConditionList.length == 0) {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请添加条件!'
      });
      return false
    }
    if (this.data.ActionList.length == 0) {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请添加动作!'
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
    wx.showLoading({
      title: '加载中',
    })

    let DATA = {
      AutomaticName: this.data.AutomaticName,
      ConditionList: this.data.ConditionList,
      ActionList: this.data.ActionList,
    }
    requestPromisified({
      url: h.main + '/insertautomation',
      data: {
        id: app.globalData.CurHomeId,
        roomid: this.data.RoomId,
        automations: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1500
          })
          wx.navigateBack()
          wx.hideLoading()
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '已添加过!',
            duration: 2000
          });
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '添加失败!'
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
  //修改
  Submit_modify() {
    //校验
    if (this.data.AutomaticName == '') {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请填写名称!'
      });
      return false
    }
    if (this.data.ConditionList.length == 0) {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请添加条件!'
      });
      return false
    }
    if (this.data.ActionList.length == 0) {
      wx.showToast({
        image: '../../../../images/icon/attention.png',
        title: '请添加动作!'
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
    wx.showLoading({
      title: '加载中',
    })

    let DATA = {
      AutomaticName: this.data.AutomaticName,
      ConditionList: this.data.ConditionList,
      ActionList: this.data.ActionList,
    }
    requestPromisified({
      url: h.main + '/updateautomation',
      data: {
        automationid: this.data.CurAutomaticId,
        id: app.globalData.CurHomeId,
        roomid: this.data.RoomId,
        automations: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1500
          })
          wx.navigateBack()
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../../../images/icon/attention.png',
            title: '修改失败!'
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
  //删除场景
  DeleteAutomatic() {
    wx.showModal({
      title: '提示',
      content: '确定删除该自动化?',
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
          requestPromisified({
            url: h.main + '/deleteautomation?id=' + this.data.CurAutomaticId,
            data: {
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          }).then((res) => {
            switch (res.data.result) {
              case 1:
                wx.showToast({
                  title: '删除成功!',
                  icon: 'success',
                  duration: 1500,
                })
                wx.navigateBack()
                break
              case 0:
                wx.hideLoading()
                wx.showToast({
                  image: '../../../../images/icon/attention.png',
                  title: '删除失败!'
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
        } else if (res.cancel) {
        }
      }
    })
  }
})