<template>
  <div id="home" :class="appear" class="flex-center">
    <ol-map ref="map"></ol-map>
    <div v-if="enter" id="viewport">
      <div id="subport" :style="subportStyle">
        <div class="right-top" :style="[{opacity:btnopacity}]">
          <transition appear enter-active-class="animated fast  zoomIn" leave-active-class="animated fast fadeOutUp">
            <el-button circle class="shadow" v-show="(!fullMap)&&(!toexpend)"
            @click="_record({type:'msgDrawer',value:true})">
              <img src="../assets/funimg/m1.png" alt="" style="transform:scale(1.2)">
              <div v-show="newmsg" class="badge"></div>
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
        :leave-active-class="menuLeave">
          <topic-menu
            v-show="(!fullMap)&&(!proxyLocation)"
          >
            <!-- v-show="!fullMap"
            v-if="!proxyLocation" -->
            <template #default="{position}">
              <div class="right-top swiper-no-swiping" :style="[position,{opacity:btnopacity}]">
                <transition appear enter-active-class="animated fast fadeIn" leave-active-class="animated fast rotateOut">
                  <el-button circle class="shadow" v-show="!fullMap" @click="showRoad">
                    <img src="../assets/funimg/r2.png" alt="">
                  </el-button>
                </transition>
                <el-button circle class="shadow" @click="map_movetoPoint({lonlat:deviceCoord})">
                  <img src="../assets/funimg/d1.png" alt="">
                </el-button>
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
      <transition
        enter-active-class="animated faster fadeIn"
        leave-active-class="animated faster fadeOut"
      >
        <router-view></router-view>
      </transition>
    </div>
    <transition appear enter-active-class="animated faster slideInDown">
      <back-button v-if="mapstatus&&!actLocation">
        <template v-if="mapstatus==='measure'">
          <div class="title">{{mspoints.length?'继续点击地图':'点击地图开始测距'}}</div>
          <div style="border:1px solid #ddd;" @click="map_clearMeasure">清空</div>
        </template>
        <template v-if="mapstatus==='mark'">
          <div class="title">移动地图至标记点</div>
          <div></div>
        </template>
        <template v-if="mapstatus==='surround'">
          <div class="title">选取搜索的中心点</div>
          <div></div>
        </template>
        <template v-if="mapstatus==='road'||mapstatus==='pointslist'">
          <el-select v-model="selectedlayer">
            <el-option
              v-for="v in ellayers"
              :key="v.appid"
              :label="v.name"
              :value="v.appid">
            </el-option>
          </el-select>
          <div></div>
        </template>
      </back-button>
    </transition>
    <mark-tab v-if="mapstatus==='mark'||mapstatus==='surround'"></mark-tab>
    <transition enter-active-class="animated faster slideInUp"
    leave-active-class="animated fast slideOutDown">
      <points-list v-if="mapstatus==='pointslist'"></points-list>
    </transition>

    <transition leave-active-class="animated fastest fadeOut">
      <div v-if="searchLoad" class="overlay flex-center">
        <lottie-loading
          type="search"
          class="lottie"
        ></lottie-loading>
      </div>
    </transition>
    <transition
      enter-active-class="animated fastest slideInRight"
      leave-active-class="animated fastest slideOutRight"
    >
      <msg-panel v-if="msgDrawer"></msg-panel>
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
    <!-- <swiper-drawer
      :visible="msgDrawer"
      @update:visible="_goback"
      :show-close="false"
      :with-header="false"
      direction="rtl"
      size="70%"
    >
      <msg-panel></msg-panel>
    </swiper-drawer> -->
    <transition enter-active-class="animated fastest zoomIn"
    leave-active-class="animated fastest zoomOut">
      <div v-show="comfirmExit" class="exittip">
        再按一次退出地图
      </div>
    </transition>
  </div>
</template>

<script>
import olMap from '../components/ol-map.vue'
import topicMenu from '../components/topic-menu.vue'
import themePanel from '../components/theme-panel.vue'
import msgPanel from '../components/msg-panel.vue'
import locationPanel from '../components/location-panel.vue'
import markTab from '../components/mark-tab.vue'
import pointsList from '../components/points-list.vue'
import swiperDrawer from '../components/swiper-drawer.vue'
import lottieLoading from '../components/lottie-loading.vue'
import backButton from '../components/back-button.vue'
export default {
  name: 'Home',
  data () {
    return {
      enter: false,
      appear: '',
      selectedlayer: '',
      menuLeave: 'animated fast slideOutDownCustom'
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
    newmsg () {
      return this.msgList.filter(v => !v.hasRead).length
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
    msgPanel,
    locationPanel,
    lottieLoading,
    markTab,
    pointsList,
    backButton
  },
  methods: {
    showRoad () {
      this._record({ type: 'map/mapstatus', value: 'road' })
    },
    socketMsg () {
      const msg = {
        hasRead: false,
        time: Date.now(),
        from: 'Chole',
        head: require('../assets/user.png'),
        appid: 'voc',
        gisid: 'fc11144869184a90a674610939745604',
        type: 'error',
        text: '该监测站Voc数据异常',
        new: true
      }
      const _ = this
      this.msgList.push(msg)
      this.$notify({
        title: `${msg.from} 向你发送一条消息`,
        dangerouslyUseHTMLString: true,
        message: msg.text,
        duration: 4000,
        offset: this.truestateBar,
        customClass: 'notify',
        onClick () {
          this.close()
          _._record({ type: 'msgDrawer', value: true })
        }
      })
    }
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
          this.$el.style.animation = `enterAnim ${this.enterAnimateTime / 1000}s ease-in`
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

    setTimeout(() => {
      this.socketMsg()
    }, 10000)
  },
  watch: {
    activeMenu ({ route }) {
      if (route) {
        this.$router.push('/home/' + route)
      } else {
        this.$router.push('/home')
      }
    },
    actLocation (loc) {
      // console.log(loc);
      if (loc) {
        this._record({ type: 'proxyLocation', value: loc, replace: true })
      } else {
        if (this.proxyLocation) this._goback()
      }
    },
    proxyLocation (loc) {
      if (loc) {
        this.menuLeave = ''
      } else {
        this.menuLeave = 'animated fast slideOutDownCustom'
      }
      if (!loc && this.actLocation) {
        this.$store.dispatch('map/setActLocation', null)
      }
    },
    comfirmExit (is) {
      if (is) {
        setTimeout(() => {
          this.$store.commit('comfirmExit', false)
        }, 2000)
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
    position:relative;
  }
  .right-top img {
    width: 1.1rem;
    height: 1.1rem;
  }
  .right-top .badge{
    position: absolute;
    height: 10px;
    width: 10px;
    top: 3px;
    right: -1px;
    background: #f4393c;
    border-radius: 50%;
    box-shadow: 0 0 2px 0;
  }
  .center-bottom {
    width: 100%;
    /* z-index:1; */
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
    position: absolute;
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
  .exittip{
    position: absolute;
    background: rgba(0,0,0,.6);
    color: #fff;
    font-size: var(--normalsize);
    padding: .6rem 1.2rem;
    bottom: 10vh;
    border-radius: 5px;
    z-index: 10;
  }
</style>
