// use vue-create-api
// 通过API的形式调用组件
// 会在body()最外层添加组件，一般弹窗之类的才会使用(全屏)
// 使用vue-create-api的组件必须增加一个name属性
import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast' // 需要使用的公共组件
import Popup from '../components/common/Popup'
import GroupDialog from '../components/shelf/ShelfGroupDialog.vue'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
// 全局mixin 组件中
// mixin后使用this.toast()即可调用
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        // 组件要传入的数据
        $props: settings
      })
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 更简洁的toast
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text) // 做一个更新的操作, 解决传入的text未正确显示的问题
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
