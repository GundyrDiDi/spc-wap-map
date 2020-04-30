<template>
  <div id="home" :class="appear" class="flex-center">
    <ol-map ref="map"></ol-map>
    <div v-if="enter" id="viewport">
      <router-view></router-view>
      <div id="subport" :style="subportStyle">
        <div class="right-top" :style="[{opacity:btnopacity}]">
          <transition appear enter-active-class="animated fast  zoomIn" leave-active-class="animated fast fadeOutUp">
            <el-button circle class="shadow" v-show="(!fullMap)&&(!toexpend)">
              <img src="../assets/funimg/m1.png" alt="" style="transform:scale(1.2)">
            </el-button>
          </transition>
          <transition appear enter-active-class="animated fast zoomIn" leave-active-class="animated fast fadeOutUp">
            <el-button circle class="shadow" v-show="(!fullMap)&&(!toexpend)"
              @click="_rtlDrawer=true">
              <img src="../assets/funimg/l2.png" alt="">
            </el-button>
          </transition>
        </div>
        <transition enter-active-class="aaa">
          <div class="right-bottom" v-show="fullMap">
            <el-button circle class="shadow">
              <img src="../assets/funimg/d1.png" alt="" @click="map_movetoPoint({lonlat:deviceCoord})">
            </el-button>
          </div>
        </transition>
        <transition appear
        enter-active-class="animated fast slideInUpCustom"
        leave-active-class="animated fast slideOutDownCustom">
          <topic-menu
            v-show="!fullMap"
            v-if="!proxyLocation"
            @search="searchLoad=$event"
          >
            <template #default="{position}">
              <div class="right-top swiper-no-swiping" :style="[position,{opacity:btnopacity}]">
                <transition appear enter-active-class="animated fast fadeIn" leave-active-class="animated fast rotateOut">
                  <el-button circle class="shadow" v-show="!fullMap">
                    <img src="../assets/funimg/r2.png" alt="">
                  </el-button>
                </transition>
                <transition appear enter-active-class="animated fast  rotateIn">
                  <el-button circle class="shadow" @click="map_movetoPoint({lonlat:deviceCoord})">
                    <img src="../assets/funimg/d1.png" alt="">
                  </el-button>
                </transition>
              </div>
            </template>
          </topic-menu>
        </transition>
        <transition
        enter-active-class="animated fast delay-300ms slideInUpLocation"
        leave-active-class="animated fast slideOutDownLocation"
        >
          <location-panel v-if="proxyLocation">
          </location-panel>
        </transition>
      </div>
    </div>
    <transition leave-active-class="animated fastest fadeOut">
      <div v-if="searchLoad" class="overlay flex-center">
        <lottie-loading
          type="search"
          class="lottie"
        ></lottie-loading>
      </div>
    </transition>
    <swiper-drawer
      :visible.sync="_rtlDrawer"
      :show-close="false"
      :with-header="false"
      direction="rtl"
      size="70%"
    >
      <theme-panel></theme-panel>
    </swiper-drawer>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'
import topicMenu from '../components/topic-menu.vue'
import swiperDrawer from '../components/swiper-drawer.vue'
import themePanel from '../components/theme-panel.vue'
import locationPanel from '../components/location-panel.vue'
import lottieLoading from '../components/lottie-loading.vue'

export default {
  name: 'Home',
  data () {
    return {
      enter: false,
      appear: '',
      searchLoad: false
    }
  },
  computed: {
    _rtlDrawer: {
      get () {
        return this.rtlDrawer
      },
      set (value) {
        if (value) {
          this._record({ type: 'rtlDrawer', value })
        } else {
          this._goback()
        }
      }
    },
    subportStyle () {
      return {
        height: this.vpHeight + 'px',
        marginTop: this.stateBar + 'px'
      }
    }
  },
  components: {
    olMap,
    topicMenu,
    swiperDrawer,
    themePanel,
    locationPanel,
    lottieLoading
  },
  async mounted () {
    const {
      delay,
      oy
    } = this.$route.params
    if (oy && delay) {
      await new Promise(resolve => {
        this.$el.style.marginTop = `${-oy}px`
        this.$refs.map.$el.style.marginTop = `${oy}px`
        setTimeout(() => {
          this.appear = 'zoom'
          this.$el.style.animation = `enterAnim ${this.enterAnimateTime / 1000}s ease-in-out`
          setTimeout(() => {
            this.$refs.map.$el.style.marginTop = 0
            this.$el.style.marginTop = 0
            this.$el.style.animation = ''
            resolve(true)
          }, this.enterAnimateTime)
        }, this.$route.params.delay)
      })
    }
    this.appear = 'static'
    this.enter = true
  },
  watch: {
    activeMenu (route) {
      // this.$router.push(route);
    },
    actLocation (loc) {
      if (loc) {
        this._record({ type: 'proxyLocation', value: loc, replace: true })
      } else {
        this._goback()
      }
    },
    proxyLocation (loc) {
      if (!loc && this.actLocation) {
        this.$store.dispatch('map/setActLocation', null)
      }
    }
  }
}

</script>

<style>
  @keyframes enterAnim {
    from {
      height: .5rem;
      width: .5rem;
    }

    to {
      height: 120vh;
      width: 120vh;
    }
  }

</style>
<style scoped>
  #home {
    position: absolute;
    width: 120vh;
    height: 120vh;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0px 2px 1px rgba(0, 0, 0, .2);
  }

  #home.zoom {
    border-radius: 50%;
    opacity: 1;
    z-index: 2;
  }

  #home.static {
    opacity: 1;
    height:inherit;
    width:inherit;
  }

  #viewport {
    z-index: 1;
    position: absolute;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }

  #subport{
    position:absolute;
    width:100%;
    overflow: hidden;
  }
  #subport>* {
    pointer-events: auto;
  }

  [class^="right"]>button {
    display: block;
    margin: 0.7rem .5rem 0 0;
    border: none;
  }

  .right-top img {
    width: 1.1rem;
    height: 1.1rem;
  }

  .center-bottom {
    width: 100%;
    z-index:1;
  }

  .center-bottom:after {
    content: '';
    clear: both;
  }
  .center-bottom .right-top{
    /* transform: translateY(-100%); */
    pointer-events: auto;
  }
  .center-bottom .right-top img, .right-bottom img{
    width: 1.5rem;
    height: 1.5rem;
  }
  .right-bottom>button{
    transform: translateY(-13px);
  }
  .aaa{
    opacity: 0;
    animation-delay: .75s;
  }
  .overlay{
    width:inherit;
    height:inherit;
    background:rgba(255,255,255,.4);
    z-index:1000;
  }
  .lottie{
    width: 8rem;
    height: 8rem;
    transform:translateY(-50%)
  }
  @keyframes slideInUpCustom {
    from {
      transform: translate3d(0, 130px, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInUpCustom {
    -webkit-animation-name: slideInUpCustom;
    animation-name: slideInUpCustom;
  }
  .slideOutDownCustom {
    -webkit-animation-name: slideOutDownCustom;
    animation-name: slideOutDownCustom;
  }
  @keyframes slideOutDownCustom {
    from {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    to {
      visibility: hidden;
      transform: translate3d(0, 130px, 0);
    }
  }
  /* */
  .slideInUpLocation {
    animation-name: slideInUpLocation;
  }
  @keyframes slideInUpLocation {
    from {
      transform: translate3d(0, 180px, 0);
      visibility: visible;
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  .slideOutDownLocation {
    animation-name: slideOutDownLocation;
  }
  @keyframes slideOutDownLocation {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      visibility: hidden;
      transform: translate3d(0, 180px, 0);
    }
  }
</style>
