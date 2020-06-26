<template>
  <div id="location-panel" class="center-bottom" :style="styles[0]">
    <transition
    enter-active-class="animated faster slideInUp"
    leave-active-class="animated fastest slideOutDown">
      <div v-show="!switching" class="swiper-container"
      ref="parent"
      :style="styles[1]">
        <div class="swiper-wrapper vertical">
          <div class="swiper-slide flex-cen"
          :class="{
            'shadow-top':!todetail,
            'search-box':!toexpend
          }"
          :style="styles[2]">
            <div v-show="!toexpend" class="badge" @click="swiper.slideTo(1)">
              <img :src="dyIcons.arrow[0]" class="rotate-reverse">
            </div>
            <i class="right-top el-icon-close" @click="_goback"></i>
            <loc-brief :lct="lct"></loc-brief>
          </div>
          <div class="swiper-slide" :style="styles[3]">
            <div class="swiper-container" ref="child" :style="styles[8]">
              <div class="swiper-wrapper vertical">
                <div class="swiper-slide" :style="styles[7]">
                  <div class="flex-column sub-slide"
                    :class="{
                      'shadow-top':!todetail,
                      'search-box':!toexpend
                    }"
                    ref="sub"
                    >
                      <loc-brief :lct="lct"></loc-brief>
                      <div>
                        <div class="hordivider"></div>
                      </div>
                      <div class="flex bottom-buttons sub-buttons">
                        <div @click="tosend">
                          <i class="el-icon-edit-outline"></i>
                          <span>上报</span>
                        </div>
                        <div @click="addfavo(lct)">
                          <transition
                            enter-active-class="animated fastest zoomIn"
                            leave-active-class="animated fastest zoomOut"
                          >
                            <i v-show="isfavo(lct)" class="fa-star el-icon-star-on"></i>
                          </transition>
                          <i class="el-icon-star-off"></i>
                          <span>收藏</span>
                        </div>
                        <div @click="tosend">
                          <i class="el-icon-message"></i>
                          <span>发送</span>
                        </div>
                      </div>
                      <loc-detail
                      v-if="!switching"
                      :style="styles[9]"
                      :loaded.sync="dlLoaded"
                      :lct="lct"
                      :start="isSlided"
                      @slide="s2.slideTo(2,500)"
                      ></loc-detail>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div
        :style="styles[4]"
        class="location-modal"
        v-show="toexpend"
        @click.self="_goback"
      >
      <transition leave-active-class="animated fastest slideOutUp">
      <loc-media
        v-if="media&&toexpend"
        :lct="lct"
      ></loc-media>
      </transition>
      </div>
    </transition>
    <transition enter-active-class="animated fastest slideInDown" leave-active-class="animated faster slideOutUp">
      <div
        class="location-banner flex-between"
        :style="styles[5]"
        v-show="todetail"
      >
        <div @click="_goback">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div>
          {{lct.name}}
        </div>
        <div>
          反馈
        </div>
      </div>
    </transition>
    <div class="center-bottom flex bottom-buttons" :style="styles[6]">
      <template v-if="!isSlided">
        <div @click="tosend">
          <i class="el-icon-edit-outline"></i>
          <span>上报</span>
        </div>
        <div @click="addfavo(lct)">
          <transition
            enter-active-class="animated fastest zoomIn"
            leave-active-class="animated fastest zoomOut"
          >
            <i v-show="isfavo(lct)" class="fa-star el-icon-star-on"></i>
          </transition>
          <i class="el-icon-star-off"></i>
          <span>收藏</span>
        </div>
        <div @click="tosend">
          <i class="el-icon-message"></i>
          <span>发送</span>
        </div>
      </template>
      <div v-else>
        <span @click="_goback">显示地图</span>
      </div>
    </div>
    <transition>
      <div v-show="sending"
      :style="sendstyle"
      class="send-container shadow-top" ref="send">
        <loc-brief :lct="lct"></loc-brief>
        <div class="hordivider"></div>
        <div class="textarea">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 3}"
            v-model="sendtext"
          >
          </el-input>
        </div>
        <div class="hordivider"></div>
        <div style="margin:.5rem 0 0 0">
          <el-input v-model.trim="employer" suffix-icon="el-icon-search" placeholder="搜索各部门人员"></el-input>
          <el-collapse class="users" :value="_userList" :style="userheight">
            <el-collapse-item class="depart" v-for="v in _userList"
            :key="v.DepartmentId"
            :title="v.DepartmentName"
            >
              <div
              v-for="user in v.UserList"
              class="username"
              :class="[user.UserOnLine&&'online',user.selected&&'selected']"
              :key="user.UserId"
              @click="checkem(user)"
              >
                {{user.RealName}}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="grid">
          <div v-for="v in checklist" :key="v.UserId">{{v.RealName}}</div>
        </div>
        <div class="flex-cen">
          <el-button @click="_goback" class="sendbtn" type="default">
            返回
          </el-button>
          <el-button @click="updatesend" class="sendbtn" type="primary">
            发送
          </el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'location-panel',
  data () {
    return {
      index: 0,
      todetail: false,
      savezoom: 0,
      switching: false,
      lct: {},
      styles: [],
      isSlided: false,
      dlLoaded: false,
      media: false,
      sendclass: '',
      sendstyle: {},
      sendtext: '',
      userheight: {},
      employer: '',
      checklist: []
    }
  },
  components: {
    locBrief: () => import('./loc-brief.vue'),
    locDetail: () => import('./loc-detail.vue'),
    locMedia: () => import('./loc-media.vue')
  },
  computed: {
    _userList () {
      const kw = this.employer
      if (kw) {
        return this.userList.map(v => {
          const temp = {
            ...v,
            UserList: v.UserList.filter(p => p.DepartmentName.includes(kw) || p.RealName.includes(kw))
          }
          return temp
        }).filter(v => v.UserList.length)
      } else {
        return this.userList
      }
    }
  },
  methods: {
    addfavo (lct) {
      const { layer, ...rest } = lct
      rest.layer = layer.appid
      rest.icon = layer.seticon
      this._addFavorite(rest)
      // lct.favo=!lct.favo
      // this.$forceUpdate()
    },
    isfavo (lct) {
      // console.log(lct);
      return this.favoList.some(v => v.id === lct.id)
      // if(lct){
      // }
    },
    updatesend () {
      this.$store.commit('searchLoad', true)
      this._leastTime().then(v => {
        this.$store.commit('searchLoad', false)
        this.$message({ type: 'success', message: '发送成功', duration: 3000 })
        this.checklist.forEach(v => {
          v.selected = false
        })
        this.checklist = []
        setTimeout(() => {
          this._goback()
        }, 500)
      })
    },
    checkem (user) {
      const i = this.checklist.indexOf(user)
      if (i < 0) {
        user.selected = true
        this.checklist.push(user)
      } else {
        user.selected = false
        this.checklist.splice(i, 1)
      }
    },
    async tosend () {
      this._record({ type: 'menu/sending', value: true })
      setTimeout(() => {
        this.sendstyle.transform = this.sendstyle.y
      }, 30)
      if (!this.userList.length) {
        await this._getuserlist()
      }
    },
    initSwiper () {
      const _ = this
      this.swiper = this.$swiper(this.$refs.parent, {
        speed: 300,
        nested: true,
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
            _.isSlided = !this.isBeginning
          },
          progress (p) {
            (!_.isSlided) && (_.isSlided = !this.isBeginning)
            _.todetail = this.isEnd
          }
        }
      })
      this.s2 = this.$swiper(this.$refs.child, {
        speed: 300,
        nested: true,
        direction: 'vertical',
        resistanceRatio: 0,
        slidesPerView: 'auto',
        freeMode: true,
        on: {
          progress (p) {
            if (p === 0) {
              _.swiper.allowTouchMove = true
            }
          }
        }
      })
    },
    initStyle () {
      const height = 130
      const restHeight = this.deviceHeight - this.topHeight - this.bottomHeight
      const banner = this.bannerHeight + this.truestateBar
      this.styles = [
        {
          height: `${height + this.bottomHeight}px`
        }, // location-panel 0
        {
          height: `${height}px`
        }, // contianer 1
        {
          height: `${restHeight - height}px`,
          opacity: 1,
          pointerEvents: 'auto',
          background: 'transparent'
        }, // slide1 2
        {
          height: `${height + this.topHeight - banner}px`
        }, // slide2 3
        {
          height: `${this.topHeight}px`
        }, // location-modal 4
        {
          height: `${banner}px`,
          lineHeight: `${this.bannerHeight}px`,
          paddingTop: `${this.truestateBar}px`
        }, // location-banner 5
        {
          height: `${this.bottomHeight}px`
        }, // bottom-buttons 6
        {
          position: 'absolute',
          top: `${-restHeight + height}px`,
          height: `${restHeight + this.topHeight - banner}px`,
          width: '100%',
          background: 'transparent'
        }, // sub-slide 7
        {
          height: `${restHeight + this.topHeight - banner}px`,
          overflow: 'visible'
        }, // child-swiper 8
        {
          minHeight: `${height + this.topHeight - banner}px`
        } // loc-detail
      ]
      this.sendstyle = {
        height: this.deviceHeight - this.stateBar + 'px',
        transform: '',
        y: `translateY(${this.stateBar + height + this.bottomHeight - this.deviceHeight + 10}px)`,
        exy: `translateY(${height - restHeight}px)`
      }
      this.userheight = { height: this.deviceHeight - this.stateBar - 115 - 250 + 'px' }
    }
  },
  watch: {
    sending (is) {
      if (!is) {
        this.sendstyle.transform = this.toexpend ? this.sendstyle.exy : ''
      }
    },
    actLocation: {
      handler (loc, old) {
        this.dlLoaded = false
        if (old) {
          this.switching = true
          this._leastTime({ time: 300 }).then(v => {
            this.switching = false
            this.lct = loc
          })
        } else {
          this.lct = loc
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
        this.swiper.slideTo(0, 300)
        // this.map_movetoPoint({
        //   zoom: this.savezoom,
        //   duration: 300
        // })
        this.map.el.style.transform = ''
        this.sendstyle.transform = ''
      } else {
        this.swiper.slideTo(1, 300)
        this.savezoom = this.map.zoom
        // this.map_fitActloc({
        //   duration: 300
        // })
        const s = (this.deviceHeight - this.topHeight) / 2
        this.map.el.style.transform = `translateY(${-s}px)`
        this.sendstyle.transform = this.sendstyle.exy
      }
    },
    todetail (dl) {
      if (dl) {
        this.swiper.allowTouchMove = false
      } else {
        this.s2.slideTo(0, 0)
      }
    },
    isSlided (is) {
      requestAnimationFrame(() => {
        this.styles[2].opacity = is ? 0 : 1
        this.styles[2].pointerEvents = is ? 'none' : 'auto'
      })
    },
    dlLoaded (has) {
      if (has) {
        requestAnimationFrame(() => {
          this.styles[7].height = this.$refs.sub.getBoundingClientRect().height + 'px'
          requestAnimationFrame(() => {
            this.s2.updateSlides()
          })
        })
      }
    }
  },
  mounted () {
    this.initStyle()
    requestAnimationFrame(() => {
      this.initSwiper()
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
    /* transition:all .4s;
    padding:0 1rem; */
    position:relative;
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
  /**/
  .location-modal{
    position:fixed;
    top:0;
    width:100%;
    /* filter:blur(6px); */
    background:linear-gradient(0deg,transparent 60% ,rgba(0,0,0,.6) 100%);
  }
  .location-banner{
    position:fixed;
    top:0;
    z-index:2;
    width:100%;
    background:#fff;
    border-bottom:1px solid #ddd;
    padding:0 .5rem;
    font-weight:normal;
  }
  .location-banner>div:first-child,.location-banner>div:last-child{
    flex-basis:36px;
  }
  .location-banner>div:last-child{
    color:var(--color);
    font-size:var(--normalsize);
  }
  .right-top{
    font-size: var(--hugesize);
    background: #fafafa;
    border-radius: 50%;
    color: #aaa;
    border: 3px solid #fafafa;
    margin: 20px 1rem
  }
  .brief{
    margin-top:15px;
    width:100%;
    height:115px;
    padding:5px 0;
    letter-spacing: 0rem;
  }
  .flex-cen{
    padding:0 1rem;
    z-index:2;
  }
  .sub-slide{
    background:#fff;
    width:100%;
    transition:border-radius .4s;/*圆角和阴影*/
  }
  .sub-slide>div{
    padding-left:1rem;
    padding-right:1rem;
  }
  .detail .bottom-buttons{
    box-shadow:none
  }
  .sub-buttons{
    padding-top:.5rem;
    padding-bottom:.5rem;
    box-shadow:none;
  }
  .send-container{
    position: absolute;
    top:0;
    left: 0;
    width: inherit;
    background: #fff;
    z-index: 5;
    transition:all .4s ease-in-out;
    border-radius:12px 12px 0 0;
  }
  .send-container>div{
    padding-left:1rem;
    padding-right:1rem;
  }
  .textarea{
    padding:.5rem 0;
  }
  .users{
    overflow:auto;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    margin-top: 10px;
    padding-bottom:10px;
  }
  .depart{
    padding: 0 1rem;
    position: relative;
  }
  .username{
    font-size:var(--smallsize);
    font-weight:normal;
    text-align: center;
    color:#aaa;
    opacity: .7;
    position:relative;
  }
  .username.online{
    color:#666;
    opacity: 1;
    font-weight: 600;
  }
  .username.selected{
    color:var(--bdcolor);
    font-weight: 600;
  }
  .sendbtn{
    margin:.5rem 1rem;
    width: 7rem;
  }
  .grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-row-gap: 5px;
    min-height:1rem;
  }
  .grid>div{
    color:var(--bdcolor);
    font-size:var(--smallsize);
    text-align: center;
  }
  .fa-star{
    position: absolute;
    color: gold;
  }
</style>
<style>
  .depart .el-collapse-item__arrow{
    position:absolute;
    right:1rem;
    top:50%;
    transform:translateY(-50%);
  }
  .depart .el-collapse-item__header{
    flex-wrap: wrap;
    letter-spacing: normal;
    white-space: nowrap;
    font-size:var(--smallsize)
  }
  .depart .el-collapse-item__content{
    padding:3px;
    padding-bottom:8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap: 10px;
    grid-column-gap: 5px;
  }
  .send-container .el-icon-search{
    line-height:40px;
  }
</style>
