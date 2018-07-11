import h from '../../utils/url.js'
var util = require('../../utils/util.js')
var MD5 = require('../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    questionList:[],
    QuestionnaireId:'',
    Curchecked:'2人',
    submitForm:[],
    ifShowList:[],
    CurStep:0,
    StepList:[]
  },
  onLoad: function (options) {
    this.setData({
      QuestionnaireId: options.id
    })
    this.GetQuestionnaireList(options.id)
    
  },
  
  //单选
  ChangeRadio: function(e){
    let submitFormTemp = this.data.submitForm
    let ifShowListTemp = this.data.ifShowList
    let IDX = e.currentTarget.dataset.idx
    submitFormTemp[IDX].value = e.detail.value
    if (this.data.questionList[IDX].control) {
      console.log('has control---')
      if (e.detail.value == this.data.questionList[IDX].control.value) {
        this.data.questionList[IDX].control.list.map((item, idx) => {
          ifShowListTemp[item - 1] = false
          submitFormTemp[item - 1].value = null
        })
      } else {
        this.data.questionList[IDX].control.list.map((item, idx) => {
          ifShowListTemp[item - 1] = true
        })
      }
    }
    this.setData({
      submitForm: submitFormTemp,
      ifShowList: ifShowListTemp
    })
    console.log('单选---')
    console.log(this.data.submitForm)
    console.log(this.data.ifShowList)
    
  },

  //多选
  ChangeCheckbox: function (e) {
    let temp = this.data.submitForm
    temp[e.currentTarget.dataset.idx].value = e.detail.value
    this.setData({
      submitForm: temp
    })
    console.log('多选---')
    console.log(this.data.submitForm)
    console.log(this.data.ifShowList)
  },
  // NextStep: function () {
  //   let Cur = this.data.CurStep
  //   if (this.data.CurStep < this.data.StepList.length -1){
  //     Cur++
  //   }
  //   this.setData({
  //     CurStep: Cur
  //   })
  // },
  // PreStep: function () {
  //   let Cur = this.data.CurStep
  //   if (this.data.CurStep >0) {
  //     Cur--
  //   }
  //   this.setData({
  //     CurStep: Cur
  //   })
  // },
  //SkipQuestionnaire
  SkipQuestionnaire(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 跳过问卷调查
  SkipQuestionnaire2(){
    requestPromisified({
      url: h.main + '/updateregisterstatus?ftelphone=' + app.globalData.User_Phone,
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
          wx.switchTab({
            url: '../index/index'
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '跳过失败',
            duration: 2000,
          });
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 2000,
      });
      console.log(res)
    })
  },
  //获取问卷
  GetQuestionnaireList(ID){
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/collectiontitle',
      data: {
        collectionid: ID
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          // 分步骤
          let Questionnaire = res.data.questionnaire
          let obj
          let temp = Questionnaire.slice(0)
          let len = Questionnaire.length / 2
          let submitFormTemp = []
          let ifShowListTemp = []
          // let StepListTemp = []
          // //每5条一个步骤
          // for (let i = 0; i < len; i++) {
          //   let eachArray = temp.splice(0, 2)
          //   StepListTemp.push(eachArray)
          // }
          // console.log('StepListTemp---')
          // console.log(StepListTemp)
          //submitForm ifShowList
          Questionnaire.map((item, idx) => {
            if (item.type == 'Single') {
              obj = {
                id: item.titleid,
                value:''
              }
              //obj = ''
            } else {
              obj = {
                id: item.titleid,
                value: []
              }
              //obj = []
            }
            submitFormTemp.push(obj)
            ifShowListTemp.push(true)
          })
          console.log('初始submitFormTemp---')
          console.log(submitFormTemp)
          console.log('初始ifShowList---')
          console.log(ifShowListTemp)
          this.setData({
            questionList: Questionnaire,
            submitForm: submitFormTemp,
            ifShowList: ifShowListTemp,
            // StepList: StepListTemp
          })
          wx.hideLoading()
          // 
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '问卷获取失败',
            duration: 2000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！',
        duration: 2000,
      });
      console.log(res)
    })
  },
  //提交问卷
  Submit: function(){
    console.log(this.data.ifShowList)
    console.log(this.data.submitForm)
    let temp = this.data.ifShowList
    let DATA = {
      collections:this.data.submitForm,
      id: this.data.QuestionnaireId,
      ftelphone: app.globalData.User_Phone
    }
    for (let i = 0; i < temp.length;i++){
      if (temp[i] && !this.data.submitForm[i].value){
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '请将问卷填写完整！',
            duration: 2000,
          });
          return false
        }
    }
    wx.showLoading({
      title: '加载中',
    })
    requestPromisified({
      url: h.main + '/collection',
      data: {
        collections: DATA
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
            title: '+' + res.data.integral +'积分！',
            icon: 'success',
            duration: 3000
          })
          app.globalData.IfHasWirteQuestionnaire = 1
          setTimeout(this.SkipQuestionnaire(),3000)
          
          break
        case 0:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '提交失败',
            duration: 2000,
          });
          break
        default:
          wx.hideLoading()
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！',
            duration: 2000,
          });
      }
    }).catch((res)=>{
      wx.hideLoading()
      wx.showToast({
        title: '服务器繁忙',
        image: '../../images/icon/attention.png',
        duration: 2000,
      })
      console.log(res)
    })
    console.log(this.data.ifShowList)
    console.log(this.data.submitForm)
  }
})
