import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    // CurHomeRole:1,
    userInfo: {},
    CurHomeName:'',
    AccountName:'',
    MessageCount:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DateInfo:'',
    SwiperCur:0, //当地天气0 室内空气质量1
    Toggle_show: 0,  //0初始 1展开 -1关闭
    airQuality:'',
    imgUrls: [
      'https://jingshangs.com/upload/carousel_1.png',
      'https://jingshangs.com/upload/carousel_2.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    HomeList:[],
    CurHomeName:null,
    CurHomeId:null,
    EQList:[],   //设备
    Roomlist:[], //房间
    AutomaticList:[], //自动化
    SceneList:[], //场景
    Cur_tab:'0',
    airQuality_inside:'', //室内空气质量
    Distance_width:66,
    distance:0,
    AQI:0,
    air_level:1,
    air_level_text:'',
    ifShow_B: false,
    ifShow_L: false,
    ifShow_D: false,
    Code_imgres:'',
    IfShowCode:false,  //二维码显示
    CookingMethodIndex: 0,
    CookStyle:'',
    CooktypeList:[],
    CooktypeLists:[],
    tipText:'',
    msgdata:'start'

    

  },
  onLoad: function () {
    var _this = this
    if (app.globalData.userInfo) {
      this.setData({
        // city: app.globalData.city,
        userInfo: app.globalData.userInfo,
        AccountName: app.globalData.User_name,
        hasUserInfo: true,
        msgdata: app.globalData.msgdata
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          AccountName: app.globalData.User_name,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //监听实时数据
    /*
    app.globalData.selfEmit.on('global msg changed', function () {
      console.log('i get it')
      _this.setData({
        msgdata: app.globalData.msgdata
      })
    });
    */
  },
  onShow: function () {
    this.GetHomeList()
    this.GetAirQuality()
    this.GetMessage()
    this.GetDietInfo(util.formatTime(new Date()))
    this.IfHasInfo()
    this.setData({
      CurHomeRole: app.globalData.CurHomeRole,
      HomeList: app.globalData.HomeList,
      CurHomeName: app.globalData.CurHomeName,
      CurHomeId: app.globalData.CurHomeId,
      CooktypeLists: app.globalData.CookingMethodList,
      Cur_tab: 0,
      IfHasWirteQuestionnaire: app.globalData.IfHasWirteQuestionnaire
    })
  },
  //userinfo
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  GoQuestionnaire(){
    wx.navigateTo({
      url: '../questionnaire/index?id=' + app.globalData.QuestionnaireId
    })
  },
  //烹饪方式
  ChangeCookingMethod(e) {
    this.setData({
      CooktypeList: e.detail.value
    })
  },
  //烹饪方式单选
  // ChangeCookingMethod(e) {
  //   this.setData({
  //     CookingMethodIndex: e.detail.value
  //   })
  // },
  ChangeCookStyle(e) {
    this.setData({
      CookStyle: e.detail.value
    })
  },
  //ReocrdSubmit
  ReocrdSubmit(){
    if (this.data.CooktypeList.length == 0){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请选择方式!',
        duration: 1500,
      });
      return false
    }
    let DATA = {
      id: app.globalData.CurHomeId,
      ftelphone: app.globalData.User_Phone,
      cookname: this.data.CookStyle,
      cooktype: this.data.CooktypeList
      // cooktype: this.data.CookingMethodList[this.data.CookingMethodIndex].typename
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/insertcook',
      data: {
        cooks: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          setTimeout(()=>{
            wx.showToast({
              title: '+' + res.data.integral + '积分',
              icon: 'success',
              duration: 3000,
            })
          },1500)
          this.setData({
            CooktypeList: [],
            CooktypeLists: app.globalData.CookingMethodList,
          })
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '明日再提交!',
            duration: 3000,
          });
          this.setData({
            CooktypeList: [],
            CooktypeLists: app.globalData.CookingMethodList,
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  //左右切换
  SwiperChange(e){
    console.log(e)
    if (e.detail.source == 'touch'){
      this.setData({
        SwiperCur: e.detail.current
      })
    }
    if (e.detail.current == 0 && this.data.Toggle_show == 1){
      this.Toggle()
    }
  },
  //Toggle temperature
  Toggle(){
    this.setData({
      Toggle_show: this.data.Toggle_show == 0 ? 1 : (this.data.Toggle_show == 1?-1:1)
    })
  },
  //调起切换
  ToggleCurHome(e){
    console.log(e.detail.value)
    if (app.globalData.HomeList[e.detail.value].copyid == ''){
      this.ChangeCurHome(app.globalData.HomeList[e.detail.value].id, app.globalData.HomeList[e.detail.value].fname, app.globalData.HomeList[e.detail.value].memberstype)
    }else{
      this.ChangeCurHome(app.globalData.HomeList[e.detail.value].copyid, app.globalData.HomeList[e.detail.value].fname,app.globalData.HomeList[e.detail.value].memberstype)
    }
    
  },
  //切换家
  ChangeCurHome(ID,NAME,MEMBERTYPE){
    requestPromisified({
      url: h.main + '/updatehomeid?id=' + ID + '&ftelphone=' + app.globalData.User_Phone + '&y_id=' + app.globalData.CurHomeId + '&memberstype=' + MEMBERTYPE + '&y_memberstype=' + app.globalData.CurHomeRole,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '切换成功！',
            icon: 'success',
            duration: 1500
          })
          this.setData({
            CurHomeName: NAME,
            CurHomeRole: MEMBERTYPE,
            Cur_tab:'0'
          })
          app.globalData.CurHomeName = NAME
          app.globalData.CurHomeId = ID
          app.globalData.CurHomeRole = MEMBERTYPE
          this.GetHomeList()
          this.GetCurEQList(ID)
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '切换失败',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: 'D切换服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '切换服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  ToAdd() {
    wx.navigateTo({
      url: '../equipment/add/index'
    })
  },
  //获取二维码
  ToGetCodeImg(){
    requestPromisified({
      url: h.main + '/selecthomecode?homeid=' + app.globalData.CurHomeId,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.setData({
            Code_imgres:res.data.homelist[0].user_code,
            IfShowCode:true
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '切换失败',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  //扫描后添加
  AfterScanAddHome(ScanHomeId,ScanHomeName){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/insertregisterappusercode?register_appid=' + ScanHomeId + '&ftelphone=' + app.globalData.User_Phone,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 3000
          })
          this.ChangeCurHome(res.data.id, ScanHomeName)
          wx.hideLoading()
          break
        case 2:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '已添加过!',
            duration: 3000
          });
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '添加失败!',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '添加失败!',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  //关闭二维码
  CloseCode(){
    this.setData({
      IfShowCode: false
    })
  },
  //扫一扫
  Scan(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let Info = JSON.parse(res.result)
        this.AfterScanAddHome(Info.id, Info.fname)
      }
    })
  },
  //弹起操作列表
  ToAddOptions(){
    wx.showActionSheet({
      itemList: ['扫一扫', '添加设备', '添加房间', '添加自动化','添加场景', '添加家庭成员'],
      success: (res)=> {
        switch (res.tapIndex){
          case 0:
            this.Scan()
            break
          case 1:
            if (this.data.CurHomeRole == 1){
              this.ToAdd()
            }else{
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '您非管理员！',
                duration: 3000
              });
            }
            break
          case 2:
            if (this.data.CurHomeRole == 1) {
              this.ToAddRoom()
            } else {
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '您非管理员！',
                duration: 3000
              });
            }
            break
          case 3:
            if (this.data.CurHomeRole == 1) {
              this.ToAddAutomatic()
            } else {
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '您非管理员！',
                duration: 3000
              });
            }
            break
          case 4:
            if (this.data.CurHomeRole == 1) {
              this.ToAddScene()
            } else {
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '您非管理员！',
                duration: 3000
              });
            }
            break
          case 5:
            if (this.data.CurHomeRole == 1) {
              this.ToGetCodeImg()
            } else {
              wx.showToast({
                image: '../../images/icon/attention.png',
                title: '您非管理员！',
                duration: 3000
              });
            }
            break
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  ToTrend(){
    wx.navigateTo({
      url: '../equipment/index/index'
    })
  },

  //Toggles
  Toggle_B() {
    this.setData({
      ifShow_B: !this.data.ifShow_B
    })
  },
  Toggle_L() {
    this.setData({
      ifShow_L: !this.data.ifShow_L
    })
  },
  Toggle_D() {
    this.setData({
      ifShow_D: !this.data.ifShow_D
    })
  },
  // Adds
  Add_B() {
    wx.navigateTo({
      url: '../diet/list/index?type=0',
    })
  },
  Add_L() {
    wx.navigateTo({
      url: '../diet/list/index?type=1',
    })
  },
  Add_D() {
    wx.navigateTo({
      url: '../diet/list/index?type=2',
    })
  },
  //第一次从家开始添加
  FirstAdd(){
    wx.navigateTo({
      url: '../my/home/add/index'
    })
  },
  //添加设备
  AddEquipment(){
    wx.navigateTo({
      url: '../equipment/add/index'
    })
  },
  //删除设备
  DeleteEQ(e){
    let ID = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除该设备?',
      success: (res) => {
        if (res.confirm) {
          if (app.globalData.CurHomeRole != 1) {
            wx.showModal({
              title: '提示',
              content: '权限不足！',
              showCancel: false
            })
            return false
          }

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
                  duration: 3000
                })
                this.GetCurEQList(app.globalData.CurHomeId)
                break
              case 0:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '删除失败',
                  duration: 3000,
                });
                break
              default:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '服务器繁忙！',
                  duration: 3000,
                });
            }
          }).catch((res) => {
            wx.showToast({
              image: '../../../images/icon/attention.png',
              title: '服务器繁忙！',
              duration: 3000,
            });
            console.log(res)
          })
        } else if (res.cancel) {
          return false
        }
      }
    })
  },
  //添加房间
  ToAddRoom(){
    wx.navigateTo({
      url: '../my/room/add/index?type=0'
    })
  },
  //添加自动化
  ToAddAutomatic() {
    wx.navigateTo({
      url: '../my/automation/add/index?type=0'  //0新增
    })
  },
  //添加场景
  ToAddScene() {
    wx.navigateTo({
      url: '../my/scene/setting/index?type=0'   //0新增
    })
  },
  //ChangeTab
  ChangeTab(e){
    let Idx = e.currentTarget.dataset.idx ? e.currentTarget.dataset.idx:'3'
    switch (Idx){
      case '0':
        this.GetCurEQList(app.globalData.CurHomeId)
      break
      case '1':
        this.GetCurRoomList()
        break
      case '2':
        this.GetCurAutomaticList()
        break
      case '3':
        this.GetCurSceneList()
        break
    }
    this.setData({
      Cur_tab: e.currentTarget.dataset.idx
    })
  },
  //去修改房间信息
  ToEditRoom(e){
    wx.navigateTo({
      url: '../my/room/add/index?type=1&roomname=' + e.currentTarget.dataset.name + '&roomicon=' + e.currentTarget.dataset.icon + '&roomid=' + e.currentTarget.dataset.roomid
    })
  },
  //删除房间
  DeleteRoom(e){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/deleteuserroom?roomid=' + e.currentTarget.dataset.roomid,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 3000
          })
          this.GetCurRoomList()
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '删除失败',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  //获取饮食信息
  GetDietInfo(CurDate){
    requestPromisified({
      url: h.main + '/selectweighttype1?ftelphone=' + app.globalData.User_Phone + '&faddtime=' + CurDate,
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          let temp = res.data.dietInfo[0]
          this.setData({
            dietInfo: temp,
            ifOver: temp.diet_standard < temp.diet_sum ? true : false,
            Surplus: Math.abs(temp.diet_standard - temp.diet_sum).toFixed(2)
          })
          break
        case 3:
          this.setData({
            DietInfo: '',
            ifOver: false,
            Surplus: '--'
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取失败',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
      }).catch((res)=>{
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      console.log(res)
    })
  },
  ToTemperature() {
    wx.navigateTo({
      url: '../temperature/index?weaid=' + this.data.airQuality.weaid
    })
  },
  ToWeight() {
    wx.navigateTo({
      url: '../weight/index'
    })
  },
  ToDiet() {
    wx.navigateTo({
      url: '../diet/index/index'
    })
  },
  //进入我的饮食
  MyDiet() {
    if (app.globalData.ifHasInfo) {
      wx.navigateTo({
        url: '../diet/index/index?type=1' //1身高
      })
    } else {
      wx.navigateTo({
        url: '../add/index'
      })
    }
  },
  //是否填写过身高体重
  IfHasInfo() {
    requestPromisified({
      url: h.main + '/selectweighttype?ftelphone=' + app.globalData.User_Phone,
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
          app.globalData.ifHasInfo = true
          break
        case 3:
          app.globalData.ifHasInfo = false
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '消息获取失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })
  },
  //时钟
  StartClock(){
    let _this = this
    let CurDate = new Date()
    let Week
    switch (CurDate.getDay()){
      case 0:
        Week = '日'
        break
      case 1:
        Week = '一'
        break
      case 2:
        Week = '二'
        break
      case 3:
        Week = '三'
        break
      case 4:
        Week = '四'
        break
      case 5:
        Week = '五'
        break
      case 6:
        Week = '六'
        break
    }
    let DateInfo = {
      Month: (CurDate.getMonth() + 1) < 10 ? '0' + (CurDate.getMonth() + 1) : CurDate.getMonth() + 1,
      Day: (CurDate.getDate()) < 10 ? '0' + CurDate.getDate() : CurDate.getDate(),
      Week: Week,
      Hour: CurDate.getHours() < 10 ? '0' + CurDate.getHours() : CurDate.getHours(),
      Minute: CurDate.getMinutes() < 10 ? '0' + CurDate.getMinutes() : CurDate.getMinutes(),
      Second: CurDate.getSeconds() < 10 ? '0' + CurDate.getSeconds() : CurDate.getSeconds(),
    }
    this.setData({
      DateInfo: DateInfo
    })
    setTimeout(()=>{
      this.StartClock()
    },1000)
  },
  //当前空气质量
  GetAirQuality(){
    if (app.globalData.latitude == '' || app.globalData.longitude ==''){
      app.GetLocation()
      this.GetAirQuality()
    }else{
      requestPromisified({
        url: h.main + '/selecttemperature',
        data: {
          latitude: app.globalData.latitude,
          longitude: app.globalData.longitude
        },
        method: 'POST',
      }).then((res) => {
        switch (res.data.result) {
          case 1:
            this.setData({
              airQuality: res.data.temperaturelist
            })
            break
          case 0:
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '获取空气信息失败',
              duration: 3000,
            });
            break
          default:
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '服务器繁忙！',
              duration: 3000,
            });
        }
        this.setData({
          loadingHidden: true
        })
      }).catch((res) => {
        wx.showToast({
          image: '../../images/icon/attention.png',
          title: '服务器繁忙！',
          duration: 3000,
        });
        this.setData({
          loadingHidden: true
        })
        console.log(res)
      })
    }
  },
  //获取室内空气质量
  GetAirQuality_inside(HomeId) {
    requestPromisified({
       //url: h.main + '/selectindoorair',
       url: h.main + '/selectindoorair?id=' + HomeId,
      data: {
        // id: HomeId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          this.Judge(res.data.indoorairlist[0].aqi)
          this.setData({
            airQuality_inside: res.data.indoorairlist[0],
            AQI: res.data.indoorairlist[0].aqi,
          })
          // setTimeout(() => {
          //   this.GetAirQuality_inside(app.globalData.CurHomeId)
          // }, 2000)
          break
        case 2:
          this.setData({
            airQuality_inside: [],
            tipText:'请先绑定设备'
          })
          break
        case 3:
          this.setData({
            airQuality_inside: [],
            tipText: '设备处于离线状态'
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取室内空气信息失败',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
      this.setData({
        loadingHidden: true
      })
      console.log(res)
    })
  },
  //获取消息
  GetMessage() {
    requestPromisified({
      url: h.main + '/selectnewinfo?ftelphone=' + app.globalData.User_Phone,
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
            MessageCount: res.data.count
          })
          app.globalData.MessageCount = res.data.count
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '消息获取失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })
  },
  //获取当前家下设备列表
  GetCurEQList(HomeID) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/selectregisteruser?homeid=' + HomeID,
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
            EQList: res.data.registermachine
          })
          wx.hideLoading()
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '设备获取失败!',
            duration: 3000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })
  },
  //获取当前家下房间列表
  GetCurRoomList() {
    requestPromisified({
      url: h.main + '/selectuserroom?familyid=' + app.globalData.CurHomeId,
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
            Roomlist: res.data.roomlist
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '设备房间失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })
  },
  //跳转具体房间
  ToRoom(e){
    wx.navigateTo({
      url: '../my/room/list/index?roomid=' + e.currentTarget.dataset.roomid + '&roomname=' + e.currentTarget.dataset.roomname,
    })
  },
  //跳转到我的消息页面
  ToMyMessage(){
    wx.navigateTo({
      url: '../Interaction/message/index',
    })
  },
  //判断室内空气
  Judge(AQI){
    let Width = this.data.Distance_width
    let i = (AQI * (Width / 50)) > 660 ? 660 : (AQI * (Width / 50))

    this.setData({
      distance: i
      
    })
    if (AQI >= 0 && AQI <= 50) {
      this.setData({
        air_level: 1,
        air_level_text:'优'
      })
    }
    else if (AQI > 50 && AQI <= 100) {
      this.setData({
        air_level: 2,
        air_level_text: '良'
      })
    }
    else if (AQI > 100 && AQI <= 150) {
      this.setData({
        air_level: 3,
        air_level_text: '轻度污染'
      })
    }
    else if (AQI > 150 && AQI <= 200) {
      this.setData({
        air_level: 4,
        air_level_text: '中度污染'
      })
    }
    else if (AQI > 200 && AQI <= 300) {
      this.setData({
        air_level: 5,
        air_level_text: '重度污染'
      })
    }
    else if (AQI > 300) {
      this.setData({
        air_level: 6,
        air_level_text: '严重污染'
      })
    }
  },
  GetHomeList(){
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
          if (res.data.homelist.length > 0) {
            app.globalData.HomeList = res.data.homelist
            app.globalData.CurHomeRole = res.data.homelist1[0].memberstype
            app.globalData.CurHomeRole = res.data.homelist1[0].memberstype
            app.globalData.CurHomeName = res.data.homelist1[0].fname
            if (res.data.homelist1[0].copyid == '') {
              app.globalData.CurHomeId = res.data.homelist1[0].id
              this.GetCurEQList(res.data.homelist1[0].id)
              this.GetAirQuality_inside(res.data.homelist1[0].id)
            } else {
              app.globalData.CurHomeId = res.data.homelist1[0].copyid
              this.GetCurEQList(res.data.homelist1[0].copyid)
              this.GetAirQuality_inside(res.data.homelist1[0].copyid)
            }
            this.setData({
              CurHomeName: res.data.homelist1[0].fname,
              HomeList: res.data.homelist
            })
          }
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取家失败！',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '获取家服务器繁忙！'
      });
    })
  },
  //开关设备
  ToggleOpenClose_EQ(e){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'https://jingshangs.com/upload/ON.mp3'
    innerAudioContext.onPlay(() => {
      console.log('播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res)
    })
    

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
            image: '../../images/icon/attention.png',
            title: '修改失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })

  },
  // 查看传感器趋势数据
  LookData_EQ(e) {
    wx.navigateTo({
      url: '../equipment/analysis/index?id=' + e.currentTarget.dataset.eqid + '&name=' + e.currentTarget.dataset.eqname
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
        case 2:
          wx.showModal({
            title: '提示',
            content: '该场景中有设备不在线！',
            showCancel: false
          })
          return false
        break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '修改失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
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
            title: '修改失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })

  },
  //获取当前家下自动化
  GetCurAutomaticList(e) {
    requestPromisified({
      url: h.main + '/selectallautomation?id=' + app.globalData.CurHomeId,
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
            image: '../../images/icon/attention.png',
            title: '获取自动化失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })

  },
  //获取当前家下场景
  GetCurSceneList() {
    requestPromisified({
      url: h.main + '/selectallscenario?id=' + app.globalData.CurHomeId,
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
            image: '../../images/icon/attention.png',
            title: '获取场景失败!',
            duration: 3000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 3000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 3000,
      });
    })

  },
  //控制面板
  ToControl(e){
    let EQtype = e.currentTarget.dataset.eqtype
    let EQid = e.currentTarget.dataset.eqid
    if (EQtype == 1){
      return false
    }
    wx.navigateTo({
      url: '../control/index?eqid=' + EQid + '&eqtype=' + EQtype ,
    })
  },
  //编辑自动化
  ToEdit_automatic(e){
    wx.navigateTo({
      url: '../my/automation/add/index?automaticid=' + e.currentTarget.dataset.automaticid + '&type=1',
    })
  },
  //编辑场景
  ToEdit_scene(e) {
    wx.navigateTo({
      url: '../my/scene/setting/index?sceneid=' + e.currentTarget.dataset.sceneid + '&type=1',
    })
  }
})
