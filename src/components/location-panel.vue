<template>
  <div id="location-panel" class="center-bottom" :style="styles[0]">
    <transition
    enter-active-class="animated faster slideInUp"
    leave-active-class="animated fastest slideOutDown">
      <div v-show="!switching" class="swiper-container" ref="parent" :style="styles[1]">
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide flex"
          :class="{
            'shadow-top':!todetail,
            'search-box':!toexpend
          }"
          @click="controlSlide"
          :style="styles[2]">
            <div v-show="!toexpend" class="badge" @click="swiper.slideTo(1)">
              <img :src="dyIcons.arrow[0]" class="rotate-reverse">
            </div>
            <div class="brief">
              <div class="name">
                {{lct.name}}
              </div>
              <div>

              </div>
            </div>
          </div>
          <div class="swiper-slide" :style="styles[3]">
            <loc-detail v-if="toexpend"></loc-detail>
          </div>
        </div>
      </div>
    </transition>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div
        :style="modalStyle"
        class="location-modal"
        v-show="toexpend"
        @click.self="_goback"
      >
      <transition enter-active-class="animated faster slideInDown" leave-active-class="animated faster slideOutUp">
        <div
        class="location-banner"
        :style="styles[4]"
        v-show="todetail"
        ></div>
      </transition>
      </div>
    </transition>
    <div class="center-bottom flex bottom-buttons" :style="styles[5]">
      <template v-if="!toexpend">
        <div >
          <i class="el-icon-edit-outline"></i>
          <span>上报</span>
        </div>
        <div >
          <i class="el-icon-star-off"></i>
          <span>收藏</span>
        </div>
        <div >
          <i class="el-icon-message"></i>
          <span>发送</span>
        </div>
      </template>
      <div v-else>
        <span>显示地图</span>
      </div>
    </div>
  </div>
</template>

<script>
// import flexibleContainer from './flexible-container.vue'
import locDetail from './loc-detail.vue'
export default {
  name: 'location-panel',
  data () {
    return {
      modalStyle: {
        transition: 'none',
        height: 0
      },
      index: 0,
      todetail: false,
      savezoom: 0,
      switching: false,
      lct: {}
    }
  },
  components: {
    locDetail
  },
  computed: {
    styles () {
      const height = 130; const restHeight = this.deviceHeight - this.topHeight - this.bottomHeight
      return [
        {
          height: `${height + this.bottomHeight}px`
        }, // location-panel
        {
          height: `${height}px`
        }, // contianer
        {
          height: `${restHeight - height}px`
        }, // slide1
        {
          height: `${height + this.topHeight - this.truestateBar - this.bannerHeight}px`
        }, // slide2
        {
          height: `${this.bannerHeight}px`,
          top: `${this.truestateBar}px`
        }, // location-banner
        {
          height: `${this.bottomHeight}px`
        }// bottom-buttons
      ]
    }
  },
  methods: {
    controlSlide () {
      this.swiper.slideTo(1)
    }
  },
  watch: {
    actLocation: {
      handler (loc, old) {
        if (old) {
          this.switching = true
          this._leastTime({ time: 400 }).then(v => {
            this.switching = false
            this.lct = loc
          })
        } else {
          this.lct = loc
          console.log(this.lct)
        }
      },
      immediate: true
    },
    index (i) {
      if (i < 1) {
        this.toexpend && this._goback()
      } else {
        this._record({ type: 'menu/toexpend', value: true })
      }
    },
    toexpend (ex) {
      if (!ex) {
        this.swiper.slideTo(0)
        this.map.el.style.transform = ''
        this.map_movetoPoint({
          zoom: this.savezoom,
          duration: 500
        })
      } else {
        this.savezoom = this.map.zoom
        const s = (this.deviceHeight - this.topHeight) / 2
        this.map.el.style.transform = `translateY(${-s}px)`
        this.map_fitActloc({
          duration: 500
        })
      }
    },
    todetail (dl) {

    }
  },
  mounted () {
    const _ = this
    this.modalStyle.height = this.topHeight + 'px'
    this.swiper = this.$swiper(this.$refs.parent, {
      direction: 'vertical',
      resistanceRatio: 0,
      slidesPerView: 'auto',
      on: {
        sliderMove () {},
        transitionStart () {
          _.index = this.activeIndex
          _.todetail = this.isEnd
        },
        transitionEnd () {

        },
        progress () {}
      }
    })
  }
}
</script>

<style scoped>
  #location-panel {
    width: 100%;
    pointer-events: none !important;
  }
  #location-panel>* {
    pointer-events: auto;
  }

  #location-panel>.swiper-container {
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
    transition:all .4s;
    padding:0 1rem;
    position:relative;
  }
  .flex{
    justify-content: center;
  }
  .search-box {
    border-radius: 12px 12px 0 0;
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
  .brief{
    margin-top:15px;
    width:100%;
    height:115px;
    padding:5px 0;
  }
  .brief>.name{
    font-size:var(--hugesize)
  }
  .location-modal{
    position:fixed;
    top:0;
    width:100%;
    background:linear-gradient(0deg,transparent 70% ,rgba(0,0,0,.4) 100%);
  }
  .location-banner{
    width:100%;
    background:#fff;
    position: relative;
  }
  .bottom-buttons {
    z-index:2;
    background: #fff;
    width: 100%;
    color:#666;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, .08)
  }
  .bottom-buttons>div {
    flex: 1;
    text-align: center;
  }
  .bottom-buttons i{
    font-size: 25px;
    margin: 0 5px;
  }
  .bottom-buttons span{
    font-size:var(--smallsize);
    display: inline-block;
    transform:translateY(-5px)
  }
</style>
