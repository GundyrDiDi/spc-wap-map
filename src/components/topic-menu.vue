<template>
  <div id="topic-menu" class="center-bottom" :style="slides[4]">
    <div class="swiper-container" ref="parent" :style="slides[0]" v-show="!tofocus">
      <div class="swiper-wrapper vertical" ref="wrapper">
        <slot v-bind:position="slides[3]"></slot>
        <div class="swiper-slide shadow-top" :style="slides[1]">
          <div :style="slides[6]" class="search-box" @click="slideUp">
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="focus-container" :style="slides[7]" v-show="tofocus">
      <div class="swiper-slide shadow-top" :style="slides[1]">
        <div :style="slides[6]" class="search-box">
          <el-input clearable
            :value="searchWord"
            @input="$store.commit('searchWord',$event)"
            ref="focusbox"
          >
            <i @click.self="_goback()" slot="prefix" class="el-input__icon el-icon-arrow-left"></i>
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
      index: 0
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
      }, // swiper-contianer
      {
        height: `${height}px`,
        transform: `translateY(${translateY}px)`,
        borderRadius: '12px 12px 0 0'
      },
      {
        height: this.vpHeight - (height - translateY) - this.bottomHeight + 'px',
        zIndex: 1
      },
      {
        top: `${translateY - 10}px`
      }, // right-top
      {
        height: `${height + this.bottomHeight}px`
      }, // topic-menu
      {
        height: `${this.bottomHeight}px`
      }, // bottom-buttons
      {
        height: `${height - translateY}px`,
        padding: '15px 10px'
      }, // search-box
      {
        top: `-${this.vpHeight - (height + this.bottomHeight) + translateY}px`
      } // focus-box
      ]
    }
  },
  methods: {
    test () {
      this._goback()
      console.log('slide')
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
          this.swiper.slideTo(this.index, 1000)
        }, 300)
      }
    },
    totop (s) {
      if (!s) {
        this.swiper.progress >= 1 && this.swiper.slideTo(1, 400)
      }
    },
    tofocus () {

    }
  },
  async mounted () {
    const _ = this
    this.swiper = this.$swiper(this.$refs.parent, {
      direction: 'vertical',
      resistanceRatio: 0,
      slidesPerView: 'auto',
      on: {
        transitionEnd: () => {
          this.swiper2.allowTouchMove = this.swiper.progress === 1
        },
        progress (p) {
          // console.log(p);
          _.$store.commit('btnopacity', (0.4 - p + 0.25) * 3)
          if (p !== 1) {

          } else {
            _._record({
              type: 'menu/totop',
              value: true
            })
          }
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
    pointer-events: none
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

  .focus-container {
    position: absolute;
    left: 0;
    width: 100%;
  }
  .focus-container .swiper-slide{
    position: relative;
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
