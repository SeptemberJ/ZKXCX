import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    MessageList:[],
    CurOperationIdx: '',
    RelpyContentSingle: '',
    ifReadyReply: false,
    RecordTopDistance:0,
    CurReleaseInfo:'',
    TipText: '加载中...',
    isLoading: false,
    Page: 1
  },
  onLoad(options) {
  },
  onShow(){
    this.setData({
      MessageList: []
    })
    this.GetAllMessage(1)
  },
  ChangeReply(e){
    this.setData({
      ReplyContent:e.detail.value
    })
  },
  //上拉刷新
  onPullDownRefresh() {
    this.setData({
      Page: 1,
      MessageList: []
    })
    this.GetAllMessage(1)
  },
  //加载更多
  onReachBottom() {
    console.log('到底了-----')
    console.log(this.data.Page)
    this.setData({
      isLoading: true,
    })
    this.GetAllMessage(this.data.Page)
  },
  //跳转动态详情页
  ToDetail(e){
    console.log('跳转动态详情页')
    wx.navigateTo({
      url: '../detail/index?fabuId=' + e.currentTarget.dataset.fabuId + '&ratinginfoid=' + e.currentTarget.dataset.id + '&name_t=' + e.currentTarget.dataset.nameT + '&ftelphone=' + e.currentTarget.dataset.ftelphone
    })
  },
  //回复input框
  ChangeRelpyContent(e) {
    this.setData({
      RelpyContentSingle: e.detail.value
    })
  },
  //调起回复框
  ShowReplyModal(e) {
    let Data = {
      name_F: e.currentTarget.dataset.targetName,
      ratingid: e.currentTarget.dataset.fabuId, //动态id
      ratinginfoid: e.currentTarget.dataset.idx,
      ftelphone: e.currentTarget.dataset.fabuPhone
    }
    this.setData({
      ifReadyReply: true,
      RecordTopDistance: e.target.offsetTop,
      ReplyContentSingle: '',  //清空之前输入
      CurReleaseInfo: Data
    })
  },
  //关闭回复框
  CloseReplyModal() {
    // this.setData({
    //   ifReadyReply: false
    // })
    //this.GetAllMessage()
    wx.pageScrollTo({
      scrollTop: this.data.RecordTopDistance - 30,
      duration: 300
    })
  },
  //回复评论
  SubmitReply() {
    console.log('this.data.CurReleaseInfo---')
    console.log(this.data.CurReleaseInfo)
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.RelpyContentSingle, this.data.CurReleaseInfo.ratingid, this.data.CurReleaseInfo.ratinginfoid, this.data.CurReleaseInfo.ftelphone)
  },
  //发布
  SendRelease(Name_F, Remark, Ratingid, Ratinginfoid, Ftelphone) {
    console.log('SendRelease内部---')
    // let Idx = e.currentTarget.dataset.idx
    requestPromisified({
      url: h.main + '/insertrating1',
      data: {
        name_Z: app.globalData.User_name,
        name_F: Name_F,
        remark: Remark,
        ratingid: Ratingid, //动态id
        ratinginfoid: Ratinginfoid,
        ftelphone: app.globalData.User_Phone,
        ftelphone1: Ftelphone
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // }, // 设置请求的 header
    }).then((res) => {
      switch (res.data.result) {
        case 1:
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          this.GetAllMessage()
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '评论失败!'
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
      // this.setData({
      //   loadingHidden: true
      // })
      console.log(res)
    })

  },
  //获取所有消息
  GetAllMessage(Page) {
    wx.showLoading({
      title: '加载中',
    })
    let ID
    let ListTemp = this.data.MessageList
    if (ListTemp.length > 0 && this.data.Page != 1) {
      ID = ListTemp[ListTemp.length - 1].interaction.f_id
    } else {
      ID = ''
    }
    // console.log([ListTemp.length - 1])
    // console.log(ListTemp)
    requestPromisified({
      url: h.main + '/selectratinginfonew1?ftelphone=' + app.globalData.User_Phone + '&page_num=' + Page + '&lastid=' + ID,
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
          let CurPage = this.data.Page
          let temp = res.data.MessageList
          if (temp.length > 0) {
            this.setData({
              MessageList: this.data.MessageList.concat(temp),
              Page: CurPage + 1,
              isLoading: false
            })
          } else {
            this.setData({
              TipText: '到底了'
            })
          }
          wx.hideLoading()
          // this.setData({
          //   MessageList: res.data.MessageList
          // })
          // wx.hideLoading()
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '获取消息失败!'
          });
          wx.hideLoading()
          break
        default:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '服务器繁忙！'
          });
          wx.hideLoading()
      }
    }).catch((res) => {
      wx.hideLoading()
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙！'
      });
      console.log(res)
    })
  },
  //删除消息
  DeleteMessage(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该消息吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          requestPromisified({
            url: h.main + '/',
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
                setTimeout(() => {
                  this.GetAllMessage()
                }, 1500)
                break
              case 0:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '删除失败'
                });
                wx.hideLoading()
                break
              default:
                wx.showToast({
                  image: '../../../images/icon/attention.png',
                  title: '服务器繁忙！'
                });
                wx.hideLoading()
            }
          }).catch((res) => {
            wx.hideLoading()
            wx.showToast({
              image: '../../../images/icon/attention.png',
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
