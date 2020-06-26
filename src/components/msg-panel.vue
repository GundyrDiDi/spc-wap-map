<template>
  <div class="msg-panel" @click.self="_goback">
    <div class="swiper-container out-sw" ref="wrapper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="msg-content" :style="{paddingTop:truestateBar+'px'}">
            <div class="pull">{{pulltext}}</div>
            <div class="swiper-container in-sw" ref="inner">
                <transition-group
                tag="div" class="swiper-wrapper">
                  <div class="swiper-slide" v-for="v in _msgList" :key="v.time">
                    <div class="msg-item" ref="item">
                      <div class="time">{{formatDate(v.time)}}</div>
                      <div class="info flex">
                        <div class="head flex-ter">
                          <header>
                            <img :src="v.head" alt="">
                          </header>
                          <div>{{v.from}}</div>
                        </div>
                        <div class="msg-box"
                          @click="v.hasRead=true"
                          :class="v.new&&'animated delay-100ms bounce'"
                        >
                          <div class="flex-ter point">
                            <img :src="v.geoprop.proxy.seticon" alt="">
                            <div>
                              <div>{{v.geoprop.name}}</div>
                              <div>所属 {{v.geoprop.name}}</div>
                            </div>
                          </div>
                          <div class="hordivider"></div>
                          <div class="text">
                            <el-alert class="text1" :title="v.text" :type="v.type" :closable="false">
                            </el-alert>
                          </div>
                          <div class="hordivider"></div>
                          <div class="flex-cen">
                            <el-button-group class="msg-btns">
                              <el-button class="msg-button" @click="goto(v.geoprop)">查看</el-button>
                              <el-button class="msg-button">回复</el-button>
                            </el-button-group>
                          </div>
                          <transition leave-active-class="animated zoomOut">
                            <div class="hasread" v-show="!v.hasRead"></div>
                          </transition>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition-group>
              <div class="swiper-scrollbar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'msg-panel',
    data() {
      return {
        pulltext:'下拉查看历史消息 ↓'
      }
    },
    computed: {
      _msgList() {
        return this.msgList.map(v => {
          v.geoprop = this.getgeo(v)
          if(v.new){
            setTimeout(()=>{
              v.new=false
            },3000)
          }
          return v
        })
      }
    },
    watch:{
      msgList(msg){
        requestAnimationFrame(()=>{
          this.$refs.item.forEach(v=>{
            v.parentNode.style.height=v.getBoundingClientRect().height+'px'
          })
          this.s2.updateSlides()
          this.s2.scrollbar.updateSize()
        })
      }
    },
    methods: {
      goto(v) {
        this._goback()
        if(this.menuIndex){
          this.$store.commit('menu/menuIndex',0)
        }
        setTimeout(() => {
          this.$store.dispatch('map/setActLocation', v)
        }, 200)
      },
      getgeo({appid,gisid}) {
        let layer = this.staticlayer[appid]
        let f
        layer.layer.getSource().getFeatures().some(v => {
          if (v.get('id') === gisid) {
            f = v.getProperties()
            f.proxy = layer
            return true
          }
        })
        return f
      },
      formatDate(date) {
        date = new Date(date)

        function add0(v) {
          if (v < 10) return '0' + v
          return v
        }
        let y = date.getFullYear()
        let m = add0(date.getMonth() + 1)
        let t = add0(date.getDate())
        let h = add0(date.getHours())
        let mm = add0(date.getMinutes())
        let s = add0(date.getSeconds())
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
          return `${h}:${mm}:${s}`
        } else {
          return `${m}月${t}日 ${h}:${mm}:${s}`
        }
      }
    },
    mounted() {
      let _=this
      this.swiper=new this.$swiper(this.$refs.wrapper,{
        nested: true,
        resistanceRatio: 1,
        allowSlideNext:false,
        on:{
          touchEnd(){
            if(this.translate>50){
              _._goback()
            }
          }
        }
      })
      this.$refs.item.forEach(v=>{
        v.parentNode.style.height=v.getBoundingClientRect().height+'px'
      })
      setTimeout(()=>{
        this.s2=new this.$swiper(this.$refs.inner,{
          direction: 'vertical',
          slidesPerView: 'auto',
          freeMode:true,
          scrollbar:{
            el:'.swiper-scrollbar'
          },
          on:{
            progress(){
              if(this.translate>45){
                _.pulltext='释放刷新'
              }else{
                _.pulltext='下拉查看历史消息 ↓'
              }
            },
            touchEnd(){
              if(this.translate>45&&this.allowTouchMove){
                this.setTransition(this.params.speed)
                this.setTranslate(46)
                this.touchEventsData.isTouched=false
                _.pulltext='刷新中...'
                this.allowTouchMove=false
                setTimeout(()=>{
                  this.allowTouchMove=true
                  if(_.msgList.length<5){
                    this.setTransition(0)
                    this.setTranslate(46-201)
                    requestAnimationFrame(()=>{
                      this.setTransition(800)
                      this.setTranslate(0)
                    })
                    _.msgList.unshift({
                      hasRead:true,
                      time:parseInt(Math.random()*(10**8)),
                      from:'Chole',
                      head:require('../assets/user.png'),
                      appid:'sxj',
                      gisid:'8bd166ab2df54fdca8d17e6a3575308d',
                      type:'warning',
                      text:'无视频信号，如有故障请及时前往现场维修。',
                    })
                  }else{
                    _.$message({message:'没有历史消息',duration:3000})
                    this.setTransition(this.params.speed)
                    this.setTranslate(0)
                  }
                },500)
              }
            }
          }
        })
      },100)
    },
  }

</script>

<style scoped>
  .swiper-scrollbar{
    position: absolute;
    right: 3px;
    top: 1%;
    z-index: 50;
    width: 5px;
    height: 98%;
    border-radius: 10px;
    background: rgba(0,0,0,.1);
  }
  .in-sw{
    height:inherit;
    width:inherit;
    padding-bottom:160px;
  }
  .out-sw{
    width:80%;
    height:inherit;
    float:right;
    overflow:visible;
  }
  .swiper-wrapper{
    display:block;
  }
  .msg-panel {
    z-index: 100;
    height: inherit;
    width: inherit;
  }

  .msg-content {
    background:#fcfafe;
    height: inherit;
    width: inherit;
    box-shadow: -1px 0 4px 0px rgba(0, 0, 0, .2);
  }

  .msg-item {
    padding-bottom: 15px;
    background:#fcfafe;
  }
  .pull{
    font-size: var(--smallsize);
    position: absolute;
    text-align: center;
    width: 100%;
    padding: 15px;
    transform: translate(0,0) !important;
  }
  .swiper-slide{
    position:relative;
  }
  .time {
    text-align: center;
    font-size: var(--smallsize);
    color: #aaa;
    padding: 8px 0
  }

  .info {
    padding: 0 5px;
  }

  .head {
    flex-direction: column;
    width: 3rem;
  }

  .head>header {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    box-shadow: 0 1px 2px 1px rgba(0, 102, 255, .4), 0 -1px 2px rgba(0, 102, 255, .4);
    overflow: hidden;
  }

  header>img {
    width: 100%;
    height: 100%;
    transform: translateY(4px)
  }

  .head>div {
    font-size: var(--smallsize);
    margin-top: 5px
  }

  .msg-box {
    position: relative;
    min-height: 100px;
    flex: 1;
    background: #fff;
    box-shadow: 0 0 2px .5px #e2e2e2;
    margin-right: .5rem;
    border-radius: 5px;
  }

  .point {
    height: 3rem;
    line-height: 1rem;
    font-size: var(--normalsize);
  }

  .point>img {
    margin: 0 10px
  }

  .point>div>div:last-child {
    font-size: var(--smallsize);
    color: #aaa;
    font-weight: normal
  }

  .text {
    min-height: 10px;
    font-size: var(--normalsize);
    font-weight: normal;
    margin: 5px;
  }

  .text1 {
    padding: 5px .3rem;
  }

  .flex-cen {
    padding: 5px 0;
  }

  .msg-btns {
    width: calc(100% - 10px);
  }

  .msg-button {
    width: 50%;
    padding: 8px;
    font-size: var(--normalsize)
  }

  .hasread {
    position: absolute;
    height: 9px;
    width: 9px;
    top: -3px;
    right: -3px;
    background: #f4393c;
    border-radius: 50%;
    box-shadow: 0 0 2px 0;
  }

</style>
