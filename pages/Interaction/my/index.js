import h from '../../../utils/url.js'
var util = require('../../../utils/util.js')
var MD5 = require('../../../utils/md5.js')
var requestPromisified = util.wxPromisify(wx.request)
//获取应用实例
const app = getApp()

Page({
  data: {
    DynamicList:[],
    CurOperationIdx: '',
    ReleaseContentSingle: '',
    RelpyContentSingle: '',
    ifReadyRelease: false,
    ifReadyReply: false,
    RecordTopDistance: 0,
    CurReleaseInfo: '',
    TipText: '加载中...',
    isLoading: false,
    Page: 1
  },
  onLoad() {
    this.setData({
      DynamicList: []
    })
    this.GetMyRelease(1)
  },
  onShow(){
    // this.setData({
    //   DynamicList: []
    // })
    // this.GetMyRelease(1)
  },
  ToRelease() {
    wx.navigateTo({
      url: '../release/index'
    })
  },
  //上拉刷新
  onPullDownRefresh() {
    this.setData({
      Page: 1,
      DynamicList: []
    })
    this.GetMyRelease(1)
  },
  //加载更多
  onReachBottom() {
    console.log('到底了-----')
    console.log(this.data.Page)
    this.setData({
      isLoading: true,
    })
    this.GetMyRelease(this.data.Page)
  },
  //点赞
  Zan(e) {
    let DATA = {
      fname: app.globalData.User_name,
      ratingid: e.currentTarget.dataset.dynamicId, //动态id
      ftelphone: app.globalData.User_Phone
    }
    requestPromisified({
      url: h.main + '/insertrating2',
      data: {
        ratings: DATA
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
            title: '点赞成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          let temp = this.data.DynamicList
          temp[e.currentTarget.dataset.idx].ifHasZan = true
          temp[e.currentTarget.dataset.idx].comment_zan.push({ 'phone': app.globalData.User_Phone, 'name': app.globalData.User_name })
          this.setData({
            DynamicList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '点赞失败!'
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

  },
  // 取消点赞
  CancelZan(e) {
    let DATA = {
      ratingid: e.currentTarget.dataset.dynamicId, //动态id
      ftelphone: app.globalData.User_Phone
    }
    requestPromisified({
      url: h.main + '/deletepraise',
      data: {
        ratings: DATA
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
            title: '取消成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          let temp = this.data.DynamicList
          temp[e.currentTarget.dataset.idx].ifHasZan = false
          this.setData({
            DynamicList: temp
          })
          break
        case 0:
          wx.showToast({
            image: '../../images/icon/attention.png',
            title: '取消失败!'
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
  },
  //调起评论框
  ShowReleaseModal(e) {
    let Data = {
      name_F: e.currentTarget.dataset.fabuName,
      ratingid: e.currentTarget.dataset.fabuId, //动态id
      ratinginfoid: '',
      ftelphone: e.currentTarget.dataset.fabuPhone  //动态发布者电话
    }
    this.setData({
      ifReadyRelease: true,
      RecordTopDistance: e.target.offsetTop,
      ReleaseContentSingle: '',  //清空之前输入
      CurReleaseInfo: Data,
      CurOperationIdx: e.currentTarget.dataset.dynamicIdx
    })
  },
  //调起回复框
  ShowReplyModal(e) {
    console.log(e.currentTarget.dataset.nameF + '---' + e.currentTarget.dataset.nameZ + '---' + app.globalData.User_name)
    if ( e.currentTarget.dataset.nameZ == app.globalData.User_name) {
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
        CurReleaseInfo: Data,
        CurOperationIdx: e.currentTarget.dataset.dynamicIdx
      })
    } else {
      return false
    }
  },
  //关闭评论框
  CloseReleaseModal() {
    this.setData({
      ifReadyRelease: false
    })
    // this.GetMyRelease()
    // wx.pageScrollTo({
    //   scrollTop: this.data.RecordTopDistance - 30,
    //   duration: 300
    // })
  },
  //关闭回复框
  CloseReplyModal() {
    this.setData({
      ifReadyReply: false
    })
    // this.GetMyRelease()
    // wx.pageScrollTo({
    //   scrollTop: this.data.RecordTopDistance - 30,
    //   duration: 300
    // })
  },
  // ChangeRelease
  ChangeRelease(e) {
    let ReleaseTemp = this.data.ReleaseContentList
    ReleaseTemp[e.currentTarget.dataset.idx] = e.detail.value
    this.setData({
      ReleaseContent: ReleaseTemp
    })
  },
  //发布input框
  ChangeReleaseContent(e) {
    this.setData({
      ReleaseContentSingle: e.detail.value
    })
  },
  //回复input框
  ChangeRelpyContent(e) {
    this.setData({
      RelpyContentSingle: e.detail.value
    })
  },
  //发布评论
  Submit() {
    console.log('Submit---')
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.ReleaseContentSingle, this.data.CurReleaseInfo.ratingid, '', this.data.CurReleaseInfo.ftelphone)
  },
  //回复评论
  SubmitReply() {
    this.SendRelease(this.data.CurReleaseInfo.name_F, this.data.RelpyContentSingle, this.data.CurReleaseInfo.ratingid, this.data.CurReleaseInfo.ratinginfoid, this.data.CurReleaseInfo.ftelphone)
  },
  //发布
  SendRelease(Name_F, Remark, Ratingid, Ratinginfoid, Ftelphone) {
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
      console.log(res.data)
      switch (res.data.result) {
        case 1:
          let temp = this.data.DynamicList  //CurOperationIdx
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            duration: 1500
          })
          //刷新
          //this.GetMyRelease()
          //不全局刷新，直接插入一条
          let NewObj = {
            'hf_content': Remark,
            'id': res.data.id,
            'name_F': Name_F,
            'name_Z': app.globalData.User_name,
            'ratinginfoid': Ratinginfoid,
          }
          temp[this.data.CurOperationIdx].comment_list.reply.push(NewObj)
          this.setData({
            DynamicList: temp
          })
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
            title: '服务器繁忙1！'
          });
      }
    }).catch((res) => {
      wx.showToast({
        image: '../../images/icon/attention.png',
        title: '服务器繁忙2！'
      });
      // this.setData({
      //   loadingHidden: true
      // })
      console.log(res)
    })

  },
  //图片预览
  PreviewImage(e) {
    let PictureList = e.currentTarget.dataset.pictures
    let PictureCur = PictureList[e.currentTarget.dataset.pictureIdx]
    wx.previewImage({
      current: PictureCur, // 当前显示图片的http链接
      urls: PictureList // 需要预览的图片http链接列表
    })
  },
  //获取我的发布
  GetMyRelease(Page) {
    wx.showLoading({
      title: '加载中',
    })
    let ID
    let ListTemp = this.data.DynamicList
    if (ListTemp.length > 0 && this.data.Page != 1) {
      ID = ListTemp[ListTemp.length - 1].id
    } else {
      ID = ''
    }
    requestPromisified({
      url: h.main + '/selectratingnonew?ftelphone=' + app.globalData.User_Phone +'&page_num='+ Page + '&lastid=' + ID, //  selectratingno
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
          let temp = res.data.ratinglist
          if (temp.length > 0) {
            let ReleaseContentList = []
            temp.map((Item, Idx) => {
              ReleaseContentList.push('')
              Item.ifHasZan = false
              Item.comment_zan.map((item_zan, item_IDX) => {
                if (item_zan.phone == app.globalData.User_Phone) {
                  Item.ifHasZan = true
                }
              })
            })
            this.setData({
              DynamicList: this.data.DynamicList.concat(temp),
              ReleaseContentList: ReleaseContentList,
              Page: CurPage + 1,
              isLoading: false
            })
          } else {
            this.setData({
              TipText: '到底了'
            })
          }
          wx.hideLoading()
          break
        case 0:
          wx.showToast({
            image: '../../../images/icon/attention.png',
            title: '获取动态失败'
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
  },
  //删除动态
  DeleteMyRelease(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该动态？',
      success: (res)=> {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          requestPromisified({
            url: h.main + '/deleterating?ratingid=' + e.currentTarget.dataset.fabuId,
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
                let tempDynamicList = this.data.DynamicList
                tempDynamicList.splice(e.currentTarget.dataset.idx,1)
                // setTimeout(()=>{
                //   this.GetMyRelease(1)
                // },1500)
                this.setData({
                  DynamicList: tempDynamicList
                })
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
  },
})

