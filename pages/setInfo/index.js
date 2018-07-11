import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    CurSwitch:0,
    CurSwitch_sex:0,
    Cur_date: util.formatTime(new Date()),
    BodyCircumference:'',
    BodyCircumference2:{
      sex: 0,
      age: '',
      height: '',
      weight_now: '',
      weight_target: '',
      fat: '',
      waist: '',
      bust: '',
      hipline: '',
      arm: '',
      thigh: '',
      leg: '',
    }
  },
  onShow(){
    this.GetData()
  },
  // Switch
  Switch() {
    this.setData({
      CurSwitch: this.data.CurSwitch == 0 ? 1 : 0
    })
  },
  Switch_sex() {
    this.setData({
      CurSwitch_sex: this.data.CurSwitch_sex == 0 ? 1 : 0
    })
  },
  // ChangeCur_date
  ChangeCur_date(e){
    this.setData({
      Cur_date: e.detail.value
    })
    this.GetData()
  },
  // input changes
  ChangeBodyCircumference(e){
    let temp = this.data.BodyCircumference
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData({
      BodyCircumference: temp
    })
  },
  SubmitWeightCircumference(){
    //校验
    if (this.data.BodyCircumference.age == ''){
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写年龄！'
      });
      return false
    }
    if (this.data.BodyCircumference.weight_now == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写目前体重！'
      });
      return false
    }
    if (this.data.BodyCircumference.weight_target == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写目标体重！'
      });
      return false
    }
    if (this.data.BodyCircumference.height == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写身高！'
      });
      return false
    }
    let DataBody = {
      age: this.data.BodyCircumference.age,
      weight: this.data.BodyCircumference.weight_now,
      target_weight: this.data.BodyCircumference.weight_target,
      height: this.data.BodyCircumference.height,
      sex: this.data.CurSwitch_sex,
      Bodyfatrate: this.data.BodyCircumference.fat,
      ftelphone: app.globalData.User_Phone,
      date: this.data.Cur_date
    }
    this.UpdateWeight(DataBody)
  },
  SubmitBodyCircumference() {
    //校验
    if (this.data.BodyCircumference.waist.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写腰围！'
      });
      return false
    }
    if (this.data.BodyCircumference.bust.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写胸围！'
      });
      return false
    }
    if (this.data.BodyCircumference.hipline.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写臀围！'
      });
      return false
    }
    if (this.data.BodyCircumference.arm.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写手臂围！'
      });
      return false
    }
    if (this.data.BodyCircumference.thigh.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写大腿围！'
      });
      return false
    }
    if (this.data.BodyCircumference.leg.trim() == '') {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '请写小腿围！'
      });
      return false
    }
    let UpdateWeight={
      //Bodyfatrate: this.data.BodyCircumference.waist,
      waistcircumference: this.data.BodyCircumference.waist,
      chest: this.data.BodyCircumference.bust,
      hipcircumference: this.data.BodyCircumference.hipline,
      armcircumference: this.data.BodyCircumference.arm,
      thighcircumference: this.data.BodyCircumference.thigh,
      crussurrounds: this.data.BodyCircumference.leg,
      ftelphone: app.globalData.User_Phone,
      date: this.data.Cur_date
    }
    this.UpdateBody(UpdateWeight)
  },
  // UpdateBody
  UpdateBody(DataBody){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/updatesize',
      data: {
        sizes: DataBody
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1500
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '修改失败！'
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
  // UpdateWeight
  UpdateWeight(DataWeight) {
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/updateweight1',
      data: {
        weights: DataWeight
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.hideLoading()
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1500
          })
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '修改失败！'
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
  //获取信息
  GetData(){
      wx.showLoading({
        title: '加载中',
      })
      requestPromisified({
        url: h.main + '/selectsize?ftelphone=' + app.globalData.User_Phone + '&date=' + this.data.Cur_date,
        data: {
        },
        method: 'Get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'Accept': 'application/json'
        // }, // 设置请求的 header
      }).then((res) => {
        switch (res.data.result) {
          case 1:
            let Temp = {
              sex: res.data.weightlist[0].sex,
              age: res.data.weightlist[0].age,
              height: res.data.weightlist[0].height,
              weight_now: res.data.weightlist[0].weight,
              weight_target: res.data.weightlist[0].target_weight,
              fat: res.data.weightlist[0].Bodyfatrate,
              waist: res.data.sizelist[0]?res.data.sizelist[0].waistcircumference:'',
              bust: res.data.sizelist[0] ?res.data.sizelist[0].chest:'',
              hipline: res.data.sizelist[0] ?res.data.sizelist[0].hipcircumference:'',
              arm: res.data.sizelist[0] ?res.data.sizelist[0].armcircumference:'',
              thigh: res.data.sizelist[0] ?res.data.sizelist[0].thighcircumference:'',
              leg: res.data.sizelist[0] ?res.data.sizelist[0].crussurrounds:'',
            }
            wx.hideLoading()
            this.setData({
              BodyCircumference: Temp,
              CurSwitch_sex: res.data.weightlist[0].sex,
            })
            console.log(Temp)
            break
          case 0:
            wx.hideLoading()
            wx.showToast({
              image: '../../images/icon/attention.png',
              title: '获取失败！'
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
})