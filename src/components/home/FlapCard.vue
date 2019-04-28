<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}"> <!--不能写- 驼峰-->
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left"
               :style="semiCircleStyle(item, 'left')"
               ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right"
               :style="semiCircleStyle(item, 'right')"
               ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper"> <!--烟花DOM-->
        <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item">
        </div>
      </div>
    </div><!--flap-card-bg end-->
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div> <!--阻止事件冒泡，即不希望执行其他的点击事件-->
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import { flapCardList, categoryText } from '../../utils/store'
  import { setInterval, clearInterval } from 'timers'
  export default {
    mixins: [storeHomeMixin],
    props: {
      data: Object // 上级组件(StoreHome)传来的图书信息
    },
    data() {
      return {
        flapCardList,    // 简写flapCardList: flapCardList
        front: 0,
        back: 1,
        intervalTime: 25,
        runFlapCardAnimation: false,
        pointList: null,
        runPointAnimation: false,
        runBookCardAnimation: false
      }
    },
    watch: {
      flapCardVisible(v) {
        if (v) { // true
          this.runAnimation()
        }
      }
    },
    methods: {
      semiCircleStyle(item, dir) {
        return {
          backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
        }
      },
      close() {
        this.stopAnimation()
        this.setFlapCardVisible(false)
      },
      // index:第几张卡片 type: front back
      rotate(index, type) {
        const item = this.flapCardList[index]
        let dom
        if (type === 'front') {
          dom = this.$refs.right[index]
        } else {
          dom = this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})` // ! _g
      },
      flapCardRotate() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree += 10
        frontFlapCard._g -= 5
        backFlapCard.rotateDegree -= 10
        if (backFlapCard.rotateDegree < 90) {
          backFlapCard._g += 5 // 背景色加深
        }
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.next()
        }
      },
      // 背面的卡片
      prepare() {
        const backFlapCard = this.flapCardList[this.back] // back = 0
        backFlapCard.rotateDegree = 180
        backFlapCard._g = backFlapCard.g - 5 * 9
        this.rotate(this.back, 'back')
      },
      next() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        frontFlapCard._g = frontFlapCard.g
        backFlapCard._g = backFlapCard.g
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        this.front++
        this.back++
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.back >= len) {
          this.back = 0
        }
        // 动态设置zIndex
        // 100 -> 96
        // 99 -> 100
        // 98 -> 99
        // 97 -> 98
        // 96 -> 97
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
        })
        this.prepare()
      },
      // 重置
      reset() {
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - index
          item._g = item.g
          item.rotateDegree = 0
          // 转回去
          this.rotate(index, 'front')
          this.rotate(index, 'back')
        })
        this.runFlapCardAnimation = false
        this.runPointAnimation = false
        this.runBookCardAnimation = false
      },
      startFlapCardAnimation() {
        this.prepare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.intervalTime)
      },
      // 烟花动画
      startPointAnimation() {
        this.runPointAnimation = true
        // 需要去掉小球绑定的class 但是去掉之后就没有小球动画了，所以小球只出现一次
        setTimeout(() => {
          this.runPointAnimation = false
        }, 750)
      },
      runAnimation() {
        this.runFlapCardAnimation = true
        // 第一个延时操作：开始动画和演烟花动画
        this.timeout = setTimeout(() => {
          this.startFlapCardAnimation()
          this.startPointAnimation()
        }, 300)
        // 第二个延时操作：重置所有的动画，在第一个动画结束后显示图书动画
        this.timeout2 = setTimeout(() => {
          this.stopAnimation()
          this.runBookCardAnimation = true // 前面的动画消失，显示图书动画显现
        }, 2500)
      },
      stopAnimation() {
        if (this.task) {
          clearInterval(this.task)
        }
        // 注意要把异步方法也关闭掉，否则中途点击关闭有问题
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        if (this.timeout2) {
          clearTimeout(this.timeout2)
        }
        this.reset()
      },
      categoryText() {
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      }
    },
    // 创建DOM时创建小球
    created() {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/styles/global.scss";
  @import "../../assets/styles/flapCard.scss";
  .flap-card-wrapper {
    width: 100%;
    height: 100%; // 100%???
    z-index: 1000;
    background: rgba(0, 0, 0, .6);
    @include center;
    @include absCenter;
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);     // X的wrapper
        height: px2rem(45);
        font-size: px2rem(25); // 指定内部的X的样式
        border-radius: 50%;
        background: #333;
        color: white;
        @include center;
      }
    }
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: white;
      // 设置一个初始的不显示的状态
      // transform: scale(0);
      // opacity: 0;
      &.animation {
        animation: flap-card-move .3s ease-in both; // both 演示完动画之后停留的状态
      }
      @keyframes flap-card-move {
        0% {
          transfrom: scale(0);
          opacity: 0;
        }
        50% {
          transfrom: scale(1.2);
          opacity: 1;
        }
        75% {
          transfrom: scale(0.9);
          opacity: 1;
        }
        100% {
          transfrom: scale(1.1);
          opacity: 1;
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absCenter; // 绝对定位居中
        .flap-card-circle{
          width: 100%;
          height: 100%;
          display: flex;
          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden;   // 转动到背面时隐藏
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24); // 左上 右上 右下 左下
            background-position: center right;
            transform-origin: right; // 设定转动轴 默认是center
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left; // 水平位置  垂直位置
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        z-index: 1500;
        @include absCenter; // 相对于flapcard-bg处于中间位置即可
        .point {
          border-radius: 50%;
          @include absCenter;
          // scss的for循环
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) { // 选到这个元素
                @include move($i); // 生成该元素样式
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
  } 
</style>
