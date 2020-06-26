<template>
  <div class="mark-tab flex-center" @click.self="_goback" :style="{pointerEvents:editing?'auto':'none',zIndex:mapstatus==='mark'?10:0}">
    <transition
    enter-active-class="animated faster slideInDown"
    leave-active-class="animated faster slideOutUp"
    >
      <div ref="form" v-show="editing" class="mark-form" :style="markStyle">
        <div>
          <div class="flex-center header">
            创建标记
          </div>
          <div class="container">
            <div class="flex-ter">
              <img :src="mkicons[icid]">
              <el-input
              class="text-input" ref="text"
              placeholder="请添加描述"
              v-model="text"
              ></el-input>
            </div>
            <div class="footer flex-center">
              <img v-for="(v,i) in mkicons" @click="icid=i" :key="i" :src="v" alt="">
            </div>
            <div class="flex-center">
              <el-button class="mark-confirm2" @click="_goback">取消</el-button>
              <el-button class="mark-confirm2" @click="markupdate" type="primary">确认</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition appear enter-active-class="animated delay-300ms fast bounceIn">
      <div class="mark" :class="{moving}">
        <img class="markIcon" :src="mkicons[icid]" :style="{transform}">
      </div>
    </transition>
    <transition appear enter-active-class="animated zoomIn">
    <div class="surround" v-if="mapstatus==='surround'" :class="{moving}" :style="{transform:`scale(${radio})`}"></div>
    </transition>
    <transition appear enter-active-class="animated delay-300ms fast fadeIn">
      <el-button v-show="mapstatus==='mark'&&!editing" @click="setmark" :disabled="moving" type="primary" class="mark-confirm shadow-bottom">
        选取该点
      </el-button>
    </transition>
    <transition appear enter-active-class="animated delay-300ms fast fadeIn">
      <el-button-group v-show="mapstatus==='surround'" class="mark-confirm shadow-bottom">
        <el-button @click="extent=v" :disabled="moving" v-for="v in backextents" :key="v" :type="v===extent?'primary':'normal'">
          {{v}}m
        </el-button>
        <el-button type="primary" @click="searchextent">搜索</el-button>
      </el-button-group>
    </transition>
  </div>
</template>

<script>
export default {
  name:'mark-tab',
  data(){
    return {
      icid:0,
      text:'',
      transform:'translateY(0)',
      backextents:[100,200,500],
      extent:200,
      radio:0,
    }
  },
  computed:{
    markStyle(){
      return {
        paddingTop:this.truestateBar+'px'
      }
    },
    mkicons(){
      let icons=this.icons
      return [
        icons.markIcon,icons.mk1Icon,icons.mk2Icon,icons.mk3Icon,icons.mk4Icon,icons.mk5Icon,icons.mk6Icon
      ]
    },
  },
  watch:{
    editing(e){
      if(!e){
        this.map.el.style.transform = ''
        this.transform=''
      }
    },
    extent(){
      this.calculateradio()
    },
    zoom(z){
      this.calculateradio()
    }
  },
  methods:{
    calculateradio(){
      this.map_getDeviceDistance([this.deviceWidth/2,0]).then(v=>{
        this.radio=this.extent/v
      })
    },
    searchextent(){
      this.$store.commit('searchLoad', true)
      this._leastTime().then(v=>{
        this._record({type:'map/mapstatus',value:'pointslist'})
        setTimeout(()=>{
          this.$store.commit('searchLoad', false)
        },100)
      })
    },
    setmark(){
      this._record({type:'editing',value:true})
      setTimeout(()=>{
        this.$refs.text.focus()
        let h=this.$refs.form.getBoundingClientRect().height
        this.transform=`translateY(${-(this.deviceHeight/2-h-36)}px)`
        this.map.el.style.transform = `translateY(${-(this.deviceHeight/2-h-36)}px)`
      },200)
    },
    markupdate(){
      this._goback()
      this.$store.commit('searchLoad', true)
      setTimeout(()=>{
        setTimeout(()=>{
          this.$store.commit('searchLoad', false)
        },300)
        this.map_addtoCurlayer({text:this.text,url:this.mkicons[this.icid]})
        this._goback()
      },200)
    }
  },
  mounted(){
    this.extent=this.zoom>17?100:this.zoom>15.5?200:500
    this.calculateradio()
  }
}
</script>

<style scoped>
  .mark-tab{
    width:inherit;
    height:inherit;
    pointer-events: none;
  }
  .mark-tab>*{
    pointer-events: auto;
  }
  .mark{
    width:32px;
    height:32px;
    position:relative;
    top:-13.5px;
    left:1px;
    z-index:1;
    transition:top .1s ease-in;
  }
  .mark.moving{
    top:-16px;
  }
  .mark>img{
    width:inherit;
    height:inherit;
    transition:all .3s;
  }
  .mark-confirm{
    position: absolute;
    bottom: 3rem;
    border-radius:8px;
    padding:12px 3rem;
    font-size:var(--normalsize)
  }
  div.mark-confirm{
    padding:0;
    bottom: 4rem;
  }
  .mark-confirm2{
    margin:0 1rem;
    padding:10px 2rem;
    font-size:var(--normalsize)
  }
  .mark-form{
    position: absolute;
    top:0;
    width:inherit;
    min-height:100px;
    background:#fff;
    z-index:2;
  }
  .header{
    padding:14px;
  }
  .mark-form>div>div{
    box-shadow:0 1px 2px rgba(0,0,0,.2)
  }
  .container img{
    width:24px;
    height:24px;
    transform:translateX(-.4rem)
  }
  .mark-form .container{
    padding:12px 1rem;
  }
  .mark-form:after{
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    border: 15px solid transparent;
    border-top-color: #fff;
  }
  .footer{
    padding:10px;
  }
  .footer img{
    height:24px;
    width:24px;
    margin:0 .5rem;
  }
  .surround{
    position:absolute;
    height:100vw;
    width:100vw;
    background:rgba(37, 149, 214, 0.25);
    border-radius:50%;
    transition:all 1s;
    pointer-events: none;
    border:1px solid var(--color);
    transform: scale(0);
  }
  .surround.moving{
    transition:all .5s .6s linear;
    transform: scale(0) !important;
  }
</style>
