// components/faqs_iten/faqs_iten.js
Component({
  options: {
    addGlobalClass: true,//启动外部样式
  },
  /**
   * 组件的属性列表
   */
  properties: {
    canCtl: {
      type: Boolean,
      value: true
    },
    phone: {
      type: String,
      value: ""
    },
    accessToken: {
      type: String,
      value: ""
    },
    itemData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick() {
      this.triggerEvent('itemClick', this.data.itemData)
    },
    // 点击控制点
    ctlClick() {
      this.triggerEvent('ctlClick', this.data.itemData)
    },
    // 获取手机号码
    getPhoneNumber(e) {
      this.triggerEvent('getPhoneNumber', e)
    }
  }
})
