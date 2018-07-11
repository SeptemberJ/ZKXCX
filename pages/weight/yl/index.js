
//获取应用实例
const app = getApp()

Page({
  data: {
    percent:80,
    history:[
      { 'date': '2018-04-01','time':'12:00', 'weight': '44','fat':'12.2'},
      { 'date': '2018-04-02', 'time': '13:00', 'weight': '54', 'fat': '18.2' },
      { 'date': '2018-04-03', 'time': '17:00', 'weight': '70', 'fat': '22.2' }
    ]
  },
  onLoad: function () {
  },
})
