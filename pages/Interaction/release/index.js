import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    foodName:'',
    startTime:'--',
    endTime:'--',
    cookWay:'',
    foodList: [],
    cookDetailList:[],
    releaseContent:'',
    tempFilePaths: [],
    copyTempFilePaths: [],
    Canwork: false,
    loadingHidden:true
  },
  onShow(){
  },
  // 时间
  StartTimeChange(e){
    this.setData({
      startTime: e.detail.value
    })
  },
 EndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 料理名字
 ChangefoodName(e){
   this.setData({
     foodName: e.detail.value
   })
 },
  // 烹饪方式
 ChangeCookWay(e){
   this.setData({
     cookWay: e.detail.value
   })
 },
  // 添加用料
 AddFoodList(){
   let emptyObj = {
     'food_name':'',
     'food_amount':''
   }
   let temp = this.data.foodList
   temp.push(emptyObj)
   this.setData({
     foodList: temp
   })
 },
 // 添加步骤
 AddDetailList() {
   let temp = this.data.cookDetailList
   temp.push("")
   this.setData({
     cookDetailList: temp
   })
 },
//  删除用料
  DeleteFood(e){
    let temp = this.data.foodList
    let Idx = e.currentTarget.dataset.idx
    temp.splice(Idx,1)
    this.setData({
      foodList: temp
    })
  },
  // 删除步骤
  DeleteDetail(e){
    let temp = this.data.cookDetailList
    let Idx = e.currentTarget.dataset.idx
    temp.splice(Idx, 1)
    this.setData({
      cookDetailList: temp
    })
  },
  // 输入食材名称
  ChangeFoodName(e) {
    let temp = this.data.foodList
    let Idx = e.currentTarget.dataset.idx
    temp[Idx]['food_name'] = e.detail.value
    this.setData({
      foodList: temp
    })
  },
  // 输入食材用量
  ChangeFoodAmount(e) {
    let temp = this.data.foodList
    let Idx = e.currentTarget.dataset.idx
    temp[Idx]['food_amount'] = e.detail.value
    this.setData({
      foodList: temp
    })
  },
  // 输入步骤
  ChangeDetail(e){
    let temp = this.data.cookDetailList
    let Idx = e.currentTarget.dataset.idx
    console.log(Idx)
    console.log(temp)
    temp[Idx] = e.detail.value
    this.setData({
      cookDetailList: temp
    })
  },
  ChangeContent(e){
    this.setData({
      releaseContent: e.detail.value
    })
  },
  ChooseUploadFiles(){
    let temp = this.data.tempFilePaths
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempFilePaths:  temp.concat(res.tempFilePaths),
          copyTempFilePaths: temp.concat(res.tempFilePaths)
        })
        console.log(res)
      }
    })
  },
  //删除图片
  DeleteFile(e) {
    let IDX = e.currentTarget.dataset.idx
    let AfterSource = this.data.tempFilePaths
    AfterSource.splice(IDX, 1)
    this.setData({
      tempFilePaths: AfterSource,
      copyTempFilePaths: AfterSource
    })
  },
  //提交
  SumitInfo: function () {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.tempFilePaths.length>0){
      this.UploadImg()
    }else{
      this.ReleaseNoImage()
    }
  },
  UploadImg: function (ID) {
    this.setData({
      loadingHidden: false,
      Canwork: true
    })
    let DATA = {
     
      ftelphone: app.globalData.User_Phone,
      fname: app.globalData.User_name,
      remark: this.data.releaseContent,
    }
    wx.uploadFile({
      url: h.main + '/insertrating.do',//仅为示例，非真实的接口地址
      filePath: this.data.tempFilePaths.splice(0, 1)[0],
      name: 'file',
      formData: {
        id: ID ? ID : '',
        ftelphone: app.globalData.User_Phone,
        fname: app.globalData.User_name,
        remark: this.data.releaseContent,
      },
      header: {
        'content-type': 'multipart/form-data',
      },
      success: (res) => {
        console.log('图片上传成功backInfo-----')
        console.log(res.data)
        switch (res.data){
          case '0':
            this.setData({
              loadingHidden: true,
              Canwork: false,
              tempFilePaths: this.data.copyTempFilePaths
            })
            wx.showToast({
              image: '/images/attention.png',
              title: '图片上传失败！'
            });
            break
          default:
            if (this.data.tempFilePaths.length > 0) {
              this.UploadImg(res.data)
            } else {
              this.setData({
                loadingHidden: true,
                //Canwork: true
              })
              console.log(res.data)
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1500
              })
              setTimeout(() => {
                var pages = getCurrentPages();
                if (pages.length > 1) {
                  var prePage = pages[pages.length - 2];
                  prePage.onPullDownRefresh()
                  // prePage.GetAllRelease(1)
                }
                wx.navigateBack()
              }, 1500)
            }
        }
      },
      fail: (res) => {
        console.log('图片上传失败backInfo-----')
        console.log(res)
        this.setData({
          loadingHidden: true,
          Canwork: false
        })
        return false
      },
      complete: (res) => {
      }
    })
  },
  //没有图片
  ReleaseNoImage(){
    let DateStrimg = util.formatTime(new Date())
    let DATA = {
      ftelphone: app.globalData.User_Phone,
      fname: app.globalData.User_name,
      remark: this.data.releaseContent,
    }
    requestPromisified({
      url: h.main + '/insertratingno',
      data: {
        ratings: DATA
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'multipart/form-data',
      // },
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '发布成功!',
            icon: 'success',
            duration: 1500
          })
          this.setData({
            loadingHidden: true
          })
          setTimeout(() => {
            var pages = getCurrentPages();
            if (pages.length > 1) {
              var prePage = pages[pages.length - 2];
              prePage.onPullDownRefresh()
            }
            wx.navigateBack()
          }, 1500)
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '发布失败!'
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
      this.setData({
        loadingHidden: true
      })
      console.log(res)
    })
  }
})
