<template>
  <div class="book-speaking">
    <detail-title @back="back" ref="title"></detail-title><!--最上方-->
    <scroll class="content-wrapper"
            :top="42"
            :bottom="scrollBottom"
            :ifNoScroll="disableScroll"
            @onScroll="onScroll"
            ref="scroll">
      <book-info :cover="cover"
                 :title="title"
                 :author="author"
                 :desc="desc"></book-info>
      <div class="book-speak-title-wrapper">
        <div class="icon-speak-wrapper">
          <span class="icon-speak"></span>
        </div>
        <div class="speak-title-wrapper">
          <span class="speak-title">{{$t('speak.voice')}}</span>
        </div>
        <div class="icon-down-wrapper" @click="toggleContent">
          <span :class="{'icon-down2': !ifShowContent, 'icon-up': ifShowContent}"></span>
        </div>
      </div><!--图标-->
      <div class="book-detail-content-wrapper" v-show="ifShowContent">
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div class="book-detail-content-item" v-for="(item, index) in flatNavigation" :key="index"
                 @click="speak(item, index)">
              <speak-playing v-if="playingIndex === index"
                             :number="5"
                             ref="speakPlaying"></speak-playing> <!--左侧线条图标, 点击时的显示-->
              <div class="book-detail-content-navigation-text" :class="{'is-playing': playingIndex === index}"
                   v-if="item.label">{{item.label}}
              </div>
            </div>
          </div>
        </div>
      </div><!--电子书内容详情 目录信息-->
      <audio @canplay="onCanPlay"
             @timeupdate="onTimeUpdate"
             @ended="onAudioEnded"
             ref="audio"></audio> <!--加controls="controls"才会有实体 注意audio的几个重要事件 timeupdate会一直触发事件-->
    </scroll><!--电子书基本信息滚动展示-->
    <bottom :chapter="chapter"
            :currentSectionIndex="currentSectionIndex"
            :currentSectionTotal="currentSectionTotal"
            :showPlay="showPlay"
            :isPlaying.sync="isPlaying"
            :playInfo="playInfo"
            @onPlayingCardClick="onPlayingCardClick"></bottom> <!--bottom组件初始化audio  .sync?-->
    <div class="book-wrapper">
      <div id="read"></div> <!--电子书需要挂载在该div, 渲染电子书之后才能获取其信息, 这个div让其不可见-->
    </div>
    <speak-window :title="this.chapter ? this.chapter.label : ''"
                  :book="book"
                  :section="section"
                  :currentSectionIndex.sync="currentSectionIndex"
                  :currentSectionTotal="currentSectionTotal"
                  :isPlaying.sync="isPlaying"
                  :playInfo="playInfo"
                  @updateText="updateText"
                  ref="speakWindow"></speak-window><!--播放面板-->
  </div>
</template>

<script type="text/ecmascript-6">
  import DetailTitle from '../../components/detail/DetailTitle'
  import BookInfo from '../../components/detail/BookInfo'
  import Scroll from '../../components/common/Scroll'
  import SpeakPlaying from '../../components/speak/SpeakPlaying'
  import Bottom from '../../components/speak/SpeakBottom'
  import SpeakWindow from '../../components/speak/SpeakMask'
  import { findBook, getCategoryName } from '../../utils/store'
  import { download, flatList } from '../../api/store'
  import { getLocalForage } from '../../utils/localForage'
  import { realPx } from '../../utils/utils'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    components: {
      DetailTitle,
      BookInfo,
      Scroll,
      SpeakPlaying,
      Bottom,
      SpeakWindow
    },
    computed: {
      // 从audio控件本身的属性中获取相关信息, 用于计算总时间和剩余时间，已播放时间等
      currentMinute() {
        const m = Math.floor(this.currentPlayingTime / 60)
        return m < 10 ? '0' + m : m
      },
      currentSecond() {
        const s = Math.floor(this.currentPlayingTime - parseInt(this.currentMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      totalMinute() {
        const m = Math.floor(this.totalPlayingTime / 60)
        return m < 10 ? '0' + m : m
      },
      totalSecond() {
        const s = Math.floor(this.totalPlayingTime - parseInt(this.totalMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      leftMinute() {
        const m = Math.floor((this.totalPlayingTime - this.currentPlayingTime) / 60)
        return m < 10 ? '0' + m : m
      },
      leftSecond() {
        const s = Math.floor((this.totalPlayingTime - this.currentPlayingTime) - parseInt(this.leftMinute) * 60)
        return s < 10 ? '0' + s : s
      },
      // 播放相关信息, 传递给SpeakBottom.vue组件
      playInfo() {
        if (this.audioCanPlay) {
          return {
            currentMinute: this.currentMinute,
            currentSecond: this.currentSecond,
            totalMinute: this.totalMinute,
            totalSecond: this.totalSecond,
            leftMinute: this.leftMinute,
            leftSecond: this.leftSecond
          }
        } else {
          return null
        }
      },
      lang() {
        return this.metadata ? this.metadata.language : ''
      },
      disableScroll() {
        if (this.$refs.speakWindow) {
          return this.$refs.speakWindow.visible
        } else {
          return false
        }
      },
      showPlay() {
        return this.playingIndex >= 0
      },
      scrollBottom() {
        return this.showPlay ? 116 : 52
      },
      chapter() {
        return this.flatNavigation[this.playingIndex]
      },
      desc() {
        if (this.description) {
          return this.description.substring(0, 100)
        } else {
          return ''
        }
      },
      flatNavigation() {
        if (this.navigation) {
          return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
        } else {
          return []
        }
      },
      category() {
        return this.bookItem ? getCategoryName(this.bookItem.category) : ''
      },
      title() {
        return this.metadata ? this.metadata.title : ''
      },
      author() {
        return this.metadata ? this.metadata.creator : ''
      }
    },
    data() {
      return {
        bookItem: null,
        book: null,
        rendition: null,
        metadata: null,
        cover: null,
        navigation: null,
        description: null,
        ifShowContent: true,
        playingIndex: -1,
        paragraph: null,
        currentSectionIndex: null,
        currentSectionTotal: null,
        section: null,
        isPlaying: false,
        audio: null,
        audioCanPlay: false,
        currentPlayingTime: 0,
        totalPlayingTime: 0,
        playStatus: 0, // 0 - 未播放，1 - 播放中，2 - 暂停中
        toastText: '',
        isOnline: false
      }
    },
    methods: {
      // 请求服务端, 传入文本, 拿到合成的语音(mp3文件)
      // 服务端将MP3文件保存在一个Path，前端拿到这个path进而请求这个MP3文件
      createVoice(text) {
        // 原生AJAX
        const xmlhttp = new XMLHttpRequest()
        // GET URL:指向服务端的API
        // 这里没有使用异步,为了兼容audio...某些情况下必须使用同步, audio在苹果手机/浏览器必须同步才能工作 lang语种
        xmlhttp.open('GET', `${process.env.VUE_APP_VOICE_URL}/voice?text=${text}&lang=${this.lang.toLowerCase()}`, false) // false:同步
        xmlhttp.send() // 发送请求
        const xmlDoc = xmlhttp.responseText // 获取响应数据
        if (xmlDoc) {
          const json = JSON.parse(xmlDoc) // 作为JSON来解析
          if (json.path) { // 返回的MP3下载地址
            this.$refs.audio.src = json.path // audio.src 文件路径，audio会自己去下载，缓存？播放
            this.continuePlay() // 需要手动调用audio的play方法来播放
          } else {
            this.showToast('播放失败，未生成链接')
          }
        } else {
          this.showToast('播放失败')
        }
        /*
        axios.create({
          baseURL: process.env.VUE_APP_VOICE_URL + '/voice'
        })({
          method: 'get',
          params: {
            text: text,
            lang: this.lang.toLowerCase()
          }
        }).then(response => {
          if (response.status === 200) {
            if (response.data.error === 0) {
              const downloadUrl = response.data.path
              console.log('开始下载...%s', downloadUrl)
              downloadMp3(downloadUrl, blob => {
                const url = window.URL.createObjectURL(blob)
                console.log(blob, url)
                this.$refs.audio.src = url
                this.continuePlay()
              })
            } else {
              this.showToast(response.data.msg)
            }
          } else {
            this.showToast('请求失败')
          }
        }).catch(err => {
          console.log(err)
          this.showToast('播放失败')
        })
        */
      },
      // 点击播放按钮后触发
      togglePlay() {
        if (!this.isPlaying) { // 判断是否处于播放状态
          if (this.playStatus === 0) {
            this.play() // 初次播放
          } else if (this.playStatus === 2) {
            this.continuePlay() // 继续播放
          }
        } else {
          this.pausePlay()
        }
      },
      // 点击任意目录条目时触发speak方法
      speak(item, index) {
        this.resetPlay()
        this.playingIndex = index // 目录索引
        this.$nextTick(() => {    // 刷新滚动条
          this.$refs.scroll.refresh()
        })
        if (this.chapter) {
          this.section = this.book.spine.get(this.chapter.href)
          this.rendition.display(this.section.href).then(section => { // 渲染之后才能获取信息
            const currentPage = this.rendition.currentLocation()
            // 拿到文本内容(本节)
            const cfibase = section.cfiBase
            const cfistart = currentPage.start.cfi.replace(/.*!/, '').replace(/\)/, '')
            const cfiend = currentPage.end.cfi.replace(/.*!/, '').replace(/\)/, '')
            this.currentSectionIndex = currentPage.start.displayed.page
            this.currentSectionTotal = currentPage.start.displayed.total
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`
            // console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            // 获取到对应的文本以及做字符替换, 这里what?
            this.book.getRange(cfi).then(range => {
              let text = range.toLocaleString()
              text = text.replace(/\s(2,)/g, '')
              text = text.replace(/\r/g, '')
              text = text.replace(/\n/g, '')
              text = text.replace(/\t/g, '')
              text = text.replace(/\f/g, '')
              this.updateText(text) // 拿到文本传到paragraph, 科大讯飞API必须传文本过去
            })
          })
        }
      },
      resetPlay() {
        if (this.playStatus === 1) {
          this.pausePlay()
        }
        this.isPlaying = false
        this.playStatus = 0
      },
      play() {
        this.createVoice(this.paragraph) // 合成语音
      },
      continuePlay() {
        // 调用audio控件的play方法
        this.$refs.audio.play().then(() => {
          this.$refs.speakPlaying[0].startAnimation()
          this.isPlaying = true
          this.playStatus = 1
        })
      },
      pausePlay() {
        this.$refs.audio.pause()                   // 使用audio的pause方法进行暂停
        this.$refs.speakPlaying[0].stopAnimation() // 停止动画
        this.isPlaying = false                     // 播放状态
        this.playStatus = 2                        // 三种状态
      },
      onAudioEnded() {
        this.resetPlay()
        this.currentPlayingTime = this.$refs.audio.currentTime
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        this.$refs.speakWindow.refreshProgress(percent)
      },
      // 播放时会不停地调用该事件, 这里主要是将当前播放时间传给播放面板组件
      onTimeUpdate() {
        this.currentPlayingTime = this.$refs.audio.currentTime
        const percent = Math.floor((this.currentPlayingTime / this.totalPlayingTime) * 100)
        this.$refs.speakWindow.refreshProgress(percent)
      },
      onCanPlay() {
        this.audioCanPlay = true
        this.currentPlayingTime = this.$refs.audio.currentTime
        this.totalPlayingTime = this.$refs.audio.duration
      },
      findBookFromList(fileName) {
        flatList().then(response => {
          if (response.status === 200) {
            const bookList = response.data.data.filter(item => item.fileName === fileName)
            if (bookList && bookList.length > 0) {
              this.bookItem = bookList[0]
              this.init()
            }
          }
        })
      },
      init() {
        const fileName = this.$route.query.fileName
        if (!this.bookItem) {
          this.bookItem = findBook(fileName)
        }
        if (this.bookItem) {
          getLocalForage(fileName, (err, blob) => {
            if (err || !blob) {
              // this.downloadBook(fileName)
              this.isOnline = true
              const opf = this.$route.query.opf
              if (opf) {
                this.parseBook(opf)
              }
            } else {
              this.isOnline = false
              this.parseBook(blob)
            }
          })
        } else {
          this.findBookFromList(fileName)
        }
      },
      downloadBook(fileName) {
        download(
          this.bookItem,
          () => {
            getLocalForage(fileName, (err, blob) => {
              if (err) {
                return
              }
              this.parseBook(blob)
            })
          })
      },
      parseBook(blob) {
        this.book = new Epub(blob)
        this.book.loaded.metadata.then(metadata => {
          this.metadata = metadata
        })
        if (this.isOnline) {
          this.book.coverUrl().then(url => {
            this.cover = url
          })
        } else {
          this.book.loaded.cover.then(cover => {
            this.book.archive.createUrl(cover).then(url => {
              this.cover = url
            })
          })
        }
        this.book.loaded.navigation.then(nav => {
          this.navigation = nav
        })
        this.display()
      },
      back() {
        this.$router.go(-1)
      },
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },
      toggleContent() {
        this.ifShowContent = !this.ifShowContent
      },
      display() {
        const height = window.innerHeight * 0.9 - realPx(40) - realPx(54) - realPx(46) - realPx(48) - realPx(60) - realPx(44)
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: height,
          method: 'default'
        })
        this.rendition.display()
      },
      doFlatNavigation(content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },
      showToast(text) {
        this.simpleToast(text)
      },
      onPlayingCardClick() {
        this.$refs.speakWindow.show()
      },
      updateText(text) {
        this.paragraph = text
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .book-speaking {
    font-size: px2rem(16);
    width: 100%;
    background: white;
    .content-wrapper {
      width: 100%;
      .book-speak-title-wrapper {
        display: flex;
        padding: px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        .icon-speak-wrapper {
          flex: 0 0 px2rem(40);
          @include left;
          .icon-speak {
            font-size: px2rem(24);
            color: #999;
          }
        }
        .speak-title-wrapper {
          flex: 1;
          @include left;
          .speak-title {
            font-size: px2rem(16);
            font-weight: bold;
            color: #666;
          }
        }
        .icon-down-wrapper {
          flex: 0 0 px2rem(40);
          @include right;
          .icon-up {
            font-size: px2rem(12);
            color: #999;
          }
          .icon-down2 {
            font-size: px2rem(12);
            color: #999;
          }
        }
      }
      .book-detail-content-wrapper {
        width: 100%;
        border-bottom: px2rem(1) solid #eee;
        box-sizing: border-box;
        .book-detail-content-list-wrapper {
          padding: px2rem(10) px2rem(15);
          .loading-text-wrapper {
            width: 100%;
            .loading-text {
              font-size: px2rem(14);
              color: #999;
            }
          }
          .book-detail-content-item-wrapper {
            .book-detail-content-item {
              display: flex;
              padding: px2rem(15) 0;
              font-size: px2rem(14);
              line-height: px2rem(16);
              color: #333;
              border-bottom: px2rem(1) solid #eee;
              &:last-child {
                border-bottom: none;
              }
              .book-detail-content-navigation-text {
                flex: 1;
                width: 100%;
                @include ellipsis;
                &.is-playing {
                  color: $color-blue;
                  font-weight: bold;
                  margin-left: px2rem(10);
                }
              }
            }
          }
        }
      }
    }
    .book-wrapper {
      position: absolute;
      bottom: -100%; // 不可见的
      z-index: 100;
    }
  }
</style>
