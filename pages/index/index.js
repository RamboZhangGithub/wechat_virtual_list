// pages/index/zx/search.js
const { floatObj } = require('../../utils/util')
const listData = require('../../static/data.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    size: 10,
    content: '',
    newsLs: [],//文章列表
    isLoading: false,//加载中
    isEmpty: false,//空
    noMore: false,//没有更多

    headerHeight: 0,
    bottomHeight: 0,
    pageList: [// 每一页数据
      // {
      //   data: [],//数据
      //   visible: false,// 当前是否显示
      // }
    ],
    pageHeight: [// 每一页高度
      // {
      //   top: 0, // 顶部在scroll里的高度
      //   height: 0, // 高度
      //   bottom:0, // 底部在scroll里的高度
      // }
    ],
    scrollH: 0,// 滚动框高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getSearch();
    const query = wx.createSelectorQuery();
    query.select('#screenSee').boundingClientRect().exec((res) => {
      this.setData({
        scrollH: res[0].height
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  // 滚动触底
  bindscrolltolower() {
    if (!this.data.noMore) {
      this.getSearch()
    }
  },

  // 滚动
  bindscroll(e) {
    // 实现虚拟列表
    let pageList = this.data.pageList, headerHeight = this.data.headerHeight, bottomHeight = this.data.bottomHeight;
    this.data.pageHeight.forEach((item, index) => {
      // 手指上滑
      if (e.detail.deltaY < 0 && item.bottom < floatObj.subtract(e.detail.scrollTop, 10) && pageList[index].visible && pageList[index + 2]) {
        // 隐藏头部
        pageList[index].visible = false;
        headerHeight += item.height;
        // 显示底部
        if (!pageList[index + 2].visible) {
          pageList[index + 2].visible = true;
          bottomHeight -= this.data.pageHeight[index + 2].height
        }
        this.setData({
          pageList: pageList,
          headerHeight: headerHeight,
          bottomHeight: bottomHeight
        })
      }

      // 手指下滑
      if (e.detail.deltaY > 0 && item.top > floatObj.add(e.detail.scrollTop, floatObj.add(this.data.scrollH, 10)) && pageList[index].visible == true && pageList[index - 2]) {

        // 隐藏头部
        pageList[index].visible = false;
        bottomHeight += item.height;

        if (!pageList[index - 2].visible) {
          // 显示底部
          pageList[index - 2].visible = true;
          headerHeight -= this.data.pageHeight[index - 2].height
        }

        this.setData({
          pageList: pageList,
          headerHeight: headerHeight,
          bottomHeight: bottomHeight
        })
      }
    })
  },

  // 搜索输入
  searchInput(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  // 搜索
  search() {
    this.reset(this.data.content)
    this.getSearch();
  },

  // 清除
  clearSearch() {
    this.reset();
    this.getSearch()
  },

  // 重置数据
  reset(e) {
    this.setData({
      current: 1,
      content: e || '',
      isEmpty: false,
      noMore: false,
      newsLs: [],
      headerHeight: 0,
      bottomHeight: 0,
      pageList: [],
      pageHeight: [],
    })
  },

  // 搜索
  getSearch() {
    if (this.data.isLoading) return
    wx.showLoading({
      title: 'LOADING',
      mask: true
    })
    this.setData({
      isLoading: true
    })
    // 这里可以换成接口请求得到的数据
    setTimeout(() => {
      this.setData({
        isLoading: false
      })
      wx.hideLoading();
      let tampParam = {}
      if (listData.length < this.data.size) {
        tampParam = {
          current: this.data.current + 1,
          isEmpty: this.data.current == 1 && listData.length == 0 ? true : false,
          noMore: true,
          newsLs: this.data.newsLs.concat(listData)
        }
      } else {
        tampParam = {
          current: this.data.current + 1,
          newsLs: this.data.newsLs.concat(listData)
        }
      }

      if (listData.length > 0) {
        let pageList = this.data.pageList, pageHeight = this.data.pageHeight;

        pageList.push({
          data: listData,//数据
          visible: true,// 当前是否显示
        })

        pageHeight.push({
          top: 0, // 顶部在scroll里的高度
          height: this.data.virtualHeight, // 高度
          bottom: this.data.virtualHeight, // 底部在scroll里的高度
        })
        tampParam.pageList = pageList
        tampParam.pageHeight = pageHeight
      }
      this.setData(tampParam)
      if (listData.length > 0) {
        setTimeout(() => {
          this.initPageHeight(this.data.current - 2)
        }, 0);
      }
    }, 500)
  },
  // 初始化首页高度
  initPageHeight(index) {
    const query = wx.createSelectorQuery();
    query.select(`#listPageId${index}`).boundingClientRect().exec((res) => {
      let pageHeight = this.data.pageHeight;
      pageHeight[index] = {
        top: index > 0 ? pageHeight[index - 1].bottom + 1 : 0, // 顶部在scroll里的高度
        height: res[0].height,
        bottom: index > 0 ?
          floatObj.add(pageHeight[index - 1].bottom + 1, res[0].height)
          : res[0].height, // 底部在scroll里的高度
      }
      this.setData({
        pageHeight: pageHeight
      })
    })
  },
  // 跳转详情
  faqsItemClick(e) {
    wx.navigateTo({
      url: `/pages/faqs/detail/detail?questionId=${e.detail.id}&answersId=${e.detail.answersId}`,
    })
  },
})