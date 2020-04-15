<template>
  <div id="topic-menu" class="center-bottom" :style="slides[4]">
    <transition :enter-active-class="fsclass[1]">
      <div class="swiper-container" ref="parent" :style="slides[0]" v-show="!tofocus">
        <slot v-bind:position="slides[3]"></slot>
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide shadow-top" :style="slides[1]">
            <div :style="slides[6]" class="search-box flex-center" @click="slideUp">
              <i class="badge el-icon-arrow-up"></i>
              <el-input :disabled="true">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i @click.stop="1+1" slot="suffix" class="el-input__icon el-icon-camera"></i>
              </el-input>
            </div>
          </div>
          <div class="swiper-slide" :style="slides[2]">
            <div class="swiper-container" ref="child">
              <div class="swiper-wrapper">
                <div class="swiper-slide" style="height:1500px;">
  123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition :leave-active-class="fsclass[0]">
      <div class="focus-container swiper-container" :style="slides[7]" v-show="tofocus">
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide shadow-top" :style="slides[1]">
            <div :style="slides[6]" class="search-box">
              <el-input clearable
                :value="searchWord"
                @input="$store.commit('searchWord',$event)"
                ref="focusbox"
              >
                <i @click.self="back2step()" slot="prefix" class="el-input__icon el-icon-arrow-left"></i>
              </el-input>
            </div>
          </div>
          <div class="swiper-slide" :style="slides[2]">
            <!-- <div class="swiper-container" ref="child">
              <div class="swiper-wrapper">
                <div class="swiper-slide" style="height:1500px;">

                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </transition>
    <div class="center-bottom flex" id="bottom-buttons" :style="slides[5]">
      <div v-for="(v,i) in menus" :key="v.name" @click="_record({ type: 'menu/menuIndex', value:i })">
        <span :class="menuIndex==i&&'font-color'">
          {{v.name}}
          <dy-transition :ob="menuIndex" :i="i" :enter="['slideInLeft','slideInRight']"
            :leave="['slideOutRight','slideOutLeft']">
            <div v-show="menuIndex==i" class="activeMenu"></div>
          </dy-transition>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import dyTransition from './dy-transition.vue'
export default {
  name: 'topic-menu',
  data () {
    return {
      index: 0,
      fsclass: ['', '']
    }
  },
  components: {
    dyTransition
  },
  computed: {
    slides () {
      var height = 130
      var translateY = 55
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
      }, // 2 slide1
      {
        top: `${translateY - 140}px`, transform: 'transform:translateY(0px)', transition: 'none'
      }, // 3 right-top
      {
        height: `${height + this.bottomHeight}px`
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
      } // 7 focus-container
      ]
    }
  },
  methods: {
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
          this.swiper.slideTo(2, t)
          setTimeout(() => {
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
      }, 100)
    }
  },
  watch: {
    fullMap (fm) {
      if (fm) {
        this.index = this.swiper.activeIndex
        this.swiper.slideTo(0, 500)
      } else {
        setTimeout(() => {
          this.swiper.slideTo(this.index, 800)
        }, 100)
      }
    },
    totop (t) {
      if (!t) {
        this.swiper.progress === 1 && this.swiper.slideTo(1, 400)
      }
    },
    tofocus (f) {
      if (f) {
        if (!this.swiper3) {
          setTimeout(() => {
            this.swiper3 = this.$swiper('.focus-container', {
              direction: 'vertical',
              resistanceRatio: 0.8,
              slidesPerView: 'auto',
              allowSlideNext: false,
              on: {
                setTransition: () => {
                  this.$refs.focusbox.blur()
                },
                touchEnd: () => {
                  if (this.swiper3.translate > this.deviceHeight / 15) {
                    console.log(this.swiper3.translate)
                    this._goback()
                    this.swiper.slideTo(0, 0)
                    this.fsclass = ['animated faster slideOutDown', 'animated fast delay-300ms slideInUp']
                    setTimeout(() => {
                      this.swiper.slideTo(1)
                      this.fsclass = ['', '']
                    }, 300)
                  }
                }
              }
            })
          }, 0)
        }
      } else {
        setTimeout(() => {
          this._goback()
        }, 50)
      }
    }
  },
  async mounted () {
    const _ = this
    this.swiper = this.$swiper(this.$refs.parent, {
      direction: 'vertical',
      resistanceRatio: 0,
      slidesPerView: 'auto',
      on: {
        transitionStart () {
          _.slides[3].transition = 'all 500ms'
          _.slides[3].transform = `translateY(${this.activeIndex === 1 ? -130 : 0}px)`
          _.$forceUpdate()
          setTimeout(() => {
            _.slides[3].transition = 'none'
          }, 500)
        },
        // 方法调用移动不会触发
        transitionEnd () {
          const p = this.progress
          _.swiper2.allowTouchMove = p === 1
          if (p !== 1) {
            if (_.totop) {
              _._goback()
            }
          }
        },
        progress (p) {
          _.$store.commit('btnopacity', (0.3 - p + 0.24) * 5)
          if (p === 1) {
            _._record({
              type: 'menu/totop',
              value: true
            })
          }
        },
        sliderMove () {
          _.slides[3].transform = `translateY(${Math.max(-130, this.translate)}px)`
        }
      }
    })
    this.swiper2 = this.$swiper(this.$refs.child, {
      direction: 'vertical',
      nested: true,
      resistanceRatio: 0,
      slidesPerView: 'auto',
      freeMode: true
    })
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
    pointer-events: none
  }
  .right-top{
    pointer-events: auto
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
    z-index:2;
    font-weight: 600;
    background: #fff;
    width: 100%;
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
  .badge{
    position:absolute;
    top:0;
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
    font-size: 1rem;
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

</style>
