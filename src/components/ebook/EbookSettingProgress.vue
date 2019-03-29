<template>
    <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
        <div class="setting-progress">
            <div class="read-time-wrapper">
              <span class="read-time-text">{{getReadTimeText()}}</span>
              <span class="icon-forward"></span>
            </div>
            <div class="progress-wrapper">
                <div class="progress-icon-wrapper" @click="prevSection()">
                    <span class="icon-back"></span>
                </div>
                <input class="progress" type="range"
                        max="100"
                        min="0"
                        step="1"
                        @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)"
                        :value="progress"
                        :disabled="!bookAvailable"
                        ref="progress">
                <div class="progress-icon-wrapper" @click="nextSection()">
                    <span class="icon-forward"></span>
                </div>
            </div><!--progress-wrapper end-->
            <div class="text-wrapper">
                <span class="progress-section-text">{{getSectionName}}</span>
                <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
            </div>
        </div><!--setting-wrapper end-->
    </div>
    </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { getReadTime } from '../../utils/localStorage';
export default {
    mixins: [ebookMixin],
    computed: {
      getSectionName() {
        if (this.section) {
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href) {
            return this.currentBook.navigation.get(sectionInfo.href).label // 获取对应章节的目录的label
          }
        }
        return ''
      }
    },
    methods: {
        onProgressChange(progress) {
          this.setProgress(progress).then(() => {
            this.displayProgress()
            this.updateProgressBg()
          })
        },
        onProgressInput(progress) {
          // 将this.displayProgress()放入此处内容也可以随时变化，渲染太费时
          this.setProgress(progress).then(() => {
            this.updateProgressBg()
          }) 
        },
        // 显示当前进度（拖动完进度触发） 第2个需要缓存阅读进度的地方
        displayProgress() {
          // cfi:locations对象方法->通过百分比来获取cfi，传递个小数
          const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
          this.display(cfi)
        },
        // 拖动进度条时颜色发生变化
        updateProgressBg() {
          // ref用于给元素或子组件注册引用信息，引用信息将会注册在父组件的$ref对象上
          // 如果在普通的DOM元素上使用，引用指向的就是DOM元素；如果用在子组件上，引用就指向组件实例
          this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
        },
        prevSection() {
          // 章节数大于0且book解析完毕
          if (this.section > 0 && this.bookAvailable) {
            this.setSection(this.section - 1).then(() => {
              this.displaySection()
            })
          }
        },
        nextSection() {
          // 最大章节数?
          if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) { 
            this.setSection(this.section + 1).then(() => {
              this.displaySection()
            })
          }
        },
        // 切换章节 第1个需要缓存阅读进度的地方
        displaySection() {
          const sectionInfo = this.currentBook.section(this.section) // sectionAPI 返回一个对象
          if (sectionInfo && sectionInfo.href) {
            this.display(sectionInfo.href)
          }
        },
        getReadTimeText() {
          return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute())
        },
        getReadTimeByMinute() {
          const readTime = getReadTime(this.fileName)
          if (!readTime) {
            return 0
          } else {
            return Math.ceil(readTime / 60) // 向上取整
          }
        }
    },
    // 设置进度条初始背景 这是vue的钩子函数 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。  
    updated() {
        this.updateProgressBg()
    }
}
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
        position: relative;
        width: 100%;
        height: 100%;
        .read-time-wrapper {
          position: absolute; // 定义position为absolute时，left和top相对于谁？
          left: 0;
          top: 0;
          width: 100%;
          height: px2rem(40);
          font-size: px2rem(12);
          @include center; // flex布局也可作用于内联元素？
        }
        .progress-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          @include center;
          padding: 0 px2rem(15);
          box-sizing: border-box;
          .progress-icon-wrapper {
              font-size: px2rem(20);
          }
          // 主题样式文件对progress背景进行设置 位置：静态资源服务器下的theme目录
          .progress {
            width: 100%;
            -webkit-appearance: none;
            height: px2rem(2);
            margin: 0 px2rem(10);
            &:focus {
              outline: none;
            }
            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: px2rem(20);
              width: px2rem(20);
              border-radius: 50%;
              background: white;
              box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
              border: px2rem(1) solid #ddd;
            }
          }
        }
        .text-wrapper {
          position: absolute;
          left: 0;
          bottom: px2rem(10);
          width: 100%;
          color: #333;
          font-size: px2rem(12);
          text-align: center;
          padding: 0 px2rem(15);
          box-sizing: border-box;
          @include center;
          .progress-section-text {
            @include ellipsis;
          }
        }
      }
  }
</style>
