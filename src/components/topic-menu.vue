<template>
  <div id="topic-menu" class="center-bottom" :style="slides[4]">
    <transition :enter-active-class="fsclass[1]">
      <div class="swiper-container" ref="parent" :style="slides[0]" v-show="!tofocus">
        <slot v-bind:position="slides[3]"></slot>
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide shadow-top" :style="slides[1]">
            <div :style="slides[6]" class="search-box flex-center">
              <div class="badge" @click="controlSlide">
                <img :src="arrowIcon" alt="" :class="totop?'':'rotate-reverse'">
              </div>
              <div class="wrapper" @click="slideUp">
                <el-input :disabled="true" value="查找地点">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  <i @click.stop="1+1" slot="suffix" class="el-input__icon el-icon-microphone"></i>
                </el-input>
              </div>
            </div>
          </div>
          <div class="swiper-slide" :class="hidden&&'hidden'" :style="slides[2]">
            <flexible-container :allow="allowchild">
              <tool-list v-bind="slides[8]"></tool-list>
            </flexible-container>
          </div>
        </div>
      </div>
    </transition>
    <transition :leave-active-class="fsclass[0]">
      <div class="focus-container swiper-container" :style="slides[7]" v-show="tofocus">
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide shadow-top" :style="slides[1]">
            <div :style="slides[6]" class="search-box flex-center">
              <div class="badge" @click="back2step()">
                <img :src="arrowIcon" alt="" :class="totop?'':'rotate-reverse'">
              </div>
              <el-input :class="isloading&&'loading'"
                clearable
                :value="searchWord"
                @input="$store.commit('searchWord',$event.trim())"
                ref="focusbox"
                placeholder="搜索"
              >
                <i v-show="isloading" slot="suffix" class="el-input__icon el-icon-loading font-color"></i>
                <i @click.self="back2step()" slot="prefix" class="el-input__icon el-icon-arrow-left"></i>
              </el-input>
            </div>
          </div>
          <div class="swiper-slide" :style="slides[2]">
            <transition leave-active-class="delay-500ms animated slideOutDown">
              <div v-if="tofocus" class="search-result">
                <flexible-container v-if="!searchWord" v-on:slide="$refs.focusbox.blur()">
                  <history-list v-on:update="updateItem"></history-list>
                </flexible-container>
                <flexible-container v-if="searchWord" v-on:slide="$refs.focusbox.blur()" :data="resultList">
                  <result-list v-on:update="updateItem"></result-list>
                </flexible-container>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
    <div class="center-bottom flex" id="bottom-buttons" :style="slides[5]">
      <div v-for="(v,i) in menus" :key="v.name" @click="handleMenu(i)">
        <span :class="menuIndex==i&&'font-color'">
          {{v.name}}
          <dy-transition :ob="menuIndex" :i="i" :enter="['slideInLeft','slideInRight']"
            :leave="['slideOutRight','slideOutLeft']">
            <div v-show="menuIndex==i" class="activeMenu"></div>
          </dy-transition>
        </span>
      </div>
    </div>
    <div :style="modalStyle" class="menu-modal"></div>
  </div>
</template>

<script>
import dyTransition from './dy-transition.vue'
import toolList from './tool-list.vue'
import flexibleContainer from './flexible-container.vue'
import historyList from './history-list.vue'
import resultList from './result-list.vue'

export default {
  name: 'topic-menu',
  data () {
    return {
      index: 0,
      aIndex: 0,
      allowchild: false,
      hidden: false,
      fsclass: ['', ''],
      modalStyle: {
        transition: 'none',
        opacity: 0,
        height: 0
      },
      menuOpacity: 1
    }
  },
  components: {
    dyTransition,
    toolList,
    flexibleContainer,
    historyList,
    resultList
  },
  computed: {
    arrowIcon () {
      return this.dyIcons.arrow[this.index]
    },
    slides () {
      const height = 135
      const translateY = 55
      return [{
        height: `${height}px`
      }, // 0 swiper-contianer
      {
        height: `${height}px`,
        transform: `translateY(${translateY}px)`,
        borderRadius: '12px 12px 0 0'
      }, // 1 slide1
      {
        height: this.vpHeight - (height - translateY) - this.bottomHeight + 'px',
        zIndex: 1
      }, // 2 slide2
      {
        top: `${translateY - 140}px`, transform: 'transform:translateY(0px)', transition: 'none'
      }, // 3 right-top
      {
        height: `${height + this.bottomHeight}px`, opacity: this.menuOpacity
      }, // 4 topic-menu
      {
        height: `${this.bottomHeight}px`
      }, // 5 bottom-buttons
      {
        height: `${height - translateY}px`,
        padding: '15px 10px'
      }, // 6 search-box
      {
        top: `-${this.vpHeight - (height + this.bottomHeight) + translateY}px`
      }, // 7 focus-container
      {
        progress: 0, transition: 'none', breakPoint: height / (this.vpHeight - height + translateY - this.bottomHeight)
      } // 8 tool-list
      ]
    }
  },
  methods: {
    handleMenu (i) {
      if (this.menuIndex !== i) {
        this.$store.commit('menu/menuIndex', i)
      }
    },
    controlSlide () {
      if (this.swiper.isEnd) {
        this.swiper.slidePrev()
      } else {
        this.swiper.slideNext()
      }
    },
    back2step () {
      this.$refs.focusbox.blur()
      setTimeout(() => {
        this._goback()
      }, 200)
    },
    async slideUp () {
      if (!this.swiper.isEnd) {
        await new Promise(resolve => {
          const t = 400
          this.hidden = true
          this.swiper.slideTo(2, t)
          setTimeout(() => {
            this.hidden = false
            resolve()
          }, t)
        })
      }
      this._record({
        type: 'menu/tofocus',
        value: true
      })
      setTimeout(() => {
        this.$refs.focusbox.focus()
      }, 200)
    },
    updateItem (item) {
      this.$store.commit('searchLoad', true)
      this._leastTime({ promise: this.map_loadLocation(item), time: 1500 }).then(v => {
        this.menuOpacity = 0
        this.fsclass = ['animated faster delay-100ms slideOutDown', '']
        this._goback()
        this.$store.commit('searchLoad', false)
        setTimeout(() => {
          this.$store.dispatch('map/setActLocation', v)
          setTimeout(() => {
            this.menuOpacity = 1
            this.fsclass = ['', '']
          }, 500)
        }, 50)
      })
    }
  },
  watch: {
    searchWord (sw) {
      setTimeout(() => {
        if (sw === this.searchWord) {
          if (sw) {
            this._search(sw)
          } else {
            this.$store.commit('resultList', [])
          }
        }
      }, 200)
    },
    fullMap (fm) {
      if (fm) {
        this.aindex = this.swiper.activeIndex
        this.swiper.slideTo(0, 500)
      } else {
        setTimeout(() => {
          this.swiper.slideTo(this.aindex, 500)
        }, 100)
      }
    },
    totop (t) {
      if (!t) {
        this.swiper.progress === 1 && this.swiper.slideTo(1, 400)
      }
    },
    tobottom (t) {
      if (t) {
        if (this.index) {
          this.swiper.slideTo(0, 600)
        }
      }
    },
    tofocus (f) {
      if (f) {
        setTimeout(() => {
          this.swiper3 = this.$swiper('.focus-container', {
            direction: 'vertical',
            resistanceRatio: 0.75,
            slidesPerView: 'auto',
            allowSlideNext: false,
            threshold: 3,
            on: {
              setTransition: () => {
                this.$refs.focusbox.blur()
              },
              touchEnd: () => {
                if (this.swiper3.translate > this.deviceHeight / 18) {
                  this._goback()
                  this.swiper.slideTo(0, 0)
                  this.fsclass = ['animated faster slideOutDown', 'animated fast delay-300ms slideInUp']
                  setTimeout(() => {
                    this.swiper.slideTo(1, 400)
                    this.fsclass = ['', '']
                  }, 300)
                }
              }
            }
          })
        }, 0)
      } else {
        this.$store.commit('searchWord', '')
        requestAnimationFrame(() => {
          if (this.totop) {
            this._goback()
          }
        })
      }
    }
  },
  async mounted () {
    const _ = this
    this.modalStyle.height = this.deviceHeight + 'px'
    this.swiper = this.$swiper(this.$refs.parent, {
      direction: 'vertical',
      resistanceRatio: 0,
      slidesPerView: 'auto',
      on: {
        sliderMove () {
          _.modalStyle.opacity = (this.progress - 0.5) * 1
          _.slides[3].transform = `translateY(${Math.max(-135, this.translate)}px)`
          _.slides[8].progress = this.progress
        },
        transitionStart () {
          _.slides[3].transition = 'all 500ms'
          _.slides[8].transition = 'all 500ms'
          _.modalStyle.transition = 'all 500ms'
          _.slides[3].transform = `translateY(${this.activeIndex === 1 ? -135 : 0}px)`
          _.slides[8].progress = this.progress
          _.modalStyle.opacity = (this.progress - 0.5) * 1
          _.$forceUpdate()
          setTimeout(() => {
            _.slides[3].transition = 'none'
            _.slides[8].transition = 'none'
            _.modalStyle.transition = 'none'
          }, 500)

          _.index = this.progress === 1 ? 0 : this.activeIndex
        },
        // 方法调用移动不会触发
        transitionEnd () {
          const p = this.progress
          _.allowchild = p === 1
          if (p !== 1) {
            if (_.totop) {
              _._goback()
            }
          }
        },
        progress (p) {
          _.$store.commit('btnopacity', (0.25 - p + 0.24) * 5)
          if (p === 1) {
            _._record({
              type: 'menu/totop',
              value: true
            })
          }
        }
      }
    })
  },
  beforeDestroy () {
    this.swiper.destroy()
  }
}

</script>

<style scoped>
  #topic-menu {
    width: 100%;
    pointer-events: none !important;
  }

  #topic-menu>* {
    pointer-events: auto;
  }

  #topic-menu>.swiper-container {
    overflow: visible;
    position: absolute;
    width: 100%;
    pointer-events: none;
    z-index:1;
  }

  .swiper-container .swiper-container {
    height: 100%;
  }

  .swiper-wrapper {
    pointer-events: none !important
  }

  .swiper-wrapper>* {
    pointer-events: auto
  }

  .swiper-slide {
    background: #fff;
  }

  #bottom-buttons {
    z-index:3;
    font-weight: 600;
    background: #fff;
    width: 100%;
    color:#666;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, .08), 0 0 3px rgba(0, 0, 0, .04)
  }

  #bottom-buttons>div {
    flex: 1;
    text-align: center;
  }

  .search-box {
    border-radius: 12px 12px 0 0;
  }

  #bottom-buttons span {
    display: inline-block;
    position: relative;
    overflow: hidden;
    padding: 10px 0;
  }

  .activeMenu {
    left: 8%;
    height: 2px;
    background: var(--color);
    position: absolute;
    width: 80%;
    border-radius: 4px;
    bottom: 5px;
  }

  .grade {
    position: absolute;
    color: var(--color);
    top: 10px;
  }
  .focus-container .swiper-slide{
    position: relative;
  }
  .focus-container .search-result{
    background:#f2f2f2;
    height:100%;
    padding-top:.3rem;
    width: 100%;
    position: absolute;
    z-index:10;
  }
  .badge{
    position:absolute;
    top:0;
    height: 15px;
    width: 30px;
    transform: translateX(3px);
  }
  .badge>img{
    width:100%;
    height:100%;
    vertical-align: top;
  }
  .hidden>*{
    display: none;
  }
  .font-color{
    color:var(--color) !important;
  }
  .menu-modal{
    position:fixed;
    top:0;
    width:100%;
    background:rgba(0,0,0,1);
    pointer-events: none !important;
  }
</style>

<style>
  #topic-menu .el-input__inner {
    background: #eee !important;
    border-radius: 7px;
    border: .5px solid #DCDFE6 !important;
    padding: 0 40px;
    height: 45px;
    line-height: 45px;
    font-size: .9rem;
    color:#666;
  }

  #topic-menu .el-input__icon {
    line-height: 45px;
    color: #666;
  }

  #topic-menu .el-input__prefix {
    left: 10px;
  }

  #topic-menu .el-input__suffix {
    right: 10px;
  }
  .loading .el-icon-circle-close{
    display:none;
  }
  .message_loading{
    font-size:var(--largesize);
    color:#666;
  }
  .message_loading i{
    margin-right: 5px;
    font-size: 23px;
  }
</style>
