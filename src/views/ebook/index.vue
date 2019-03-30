<template>
  <div class="ebook">
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'  
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMenu from '../../components/ebook/EbookMenu'
import { ebookMixin } from '../../utils/mixin' 
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { setInterval, clearInterval } from 'timers';

export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu
    },
    methods: {
        // 记录阅读时间 注意位置 思考：这里用到了vuex中的属性，如果vuex还没加载完成呢？
        startLoopReadTime() {
            console.log(this.fileName)
            let readTime = getReadTime(this.fileName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if (readTime % 30 === 0) { // 每半分钟记录一次
                    saveReadTime(this.fileName, readTime)
                }
            },1000)
        }
    },
    mounted() {
        this.startLoopReadTime()
    },
    // 销毁前终止计时功能
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }
}

</script>
<style lang='scss' scoped>

</style>

