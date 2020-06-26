<template>
  <div class="list-wrapper" :style="style">
    <transition enter-active-class="animated faster slideInUp"
    leave-active-class="animated fast slideOutDown">
      <div v-show="!actLocation" class="points-list shadow-top">
        <div v-for="v in list" :key="v.id" @click="setloc(v)"
        class="points-item hordivider">
          <loc-brief :lct="v"></loc-brief>
        </div>
        <el-divider>没有更多搜索结果</el-divider>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name:'points-list',
  data(){
    // return {
    //   height:
    // }
    return {
      list:[{"id":"3f8cac8f22854412b19960b61a7b7d28","name":"储运部二车间东","key":"","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13503641.511332268,3594176.0654932456],"center":[13503641.511332268,3594176.0654932456]},{"id":"43df4b24cd044ca08f03477c6620f7b3","name":"烯烃14号门","key":"20","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13502710.195041317,3594049.3441633084],"center":[13502710.195041317,3594049.3441633084]},{"id":"5daa9c1f80c042e4850ca81496449413","name":"火炬区","key":"59","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13503821.242939528,3594267.578251711],"center":[13503821.242939528,3594267.578251711]},{"id":"89abc01bbfae4d9bbb0abc7aec23c198","name":"2号碳五装置门禁","key":"39","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13504457.173378367,3594013.183919205],"center":[13504457.173378367,3594013.183919205]},{"id":"8bd166ab2df54fdca8d17e6a3575308d","name":"1PE装置门禁","key":"43","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13505804.477328133,3594803.0414634557],"center":[13505804.477328133,3594803.0414634557]},{"id":"9027903a642d4779ad759629b12dbfef","name":"储运一车间西","key":"","type":"摄像机","layer":"sxj","disable":false,"state":null,"showType":"PointShow","geoType":"point","maxzoom":40,"minzoom":10,"zoom":16,"coords":[13503057.488504352,3594777.5239870264],"center":[13503057.488504352,3594777.5239870264]}]
    }
  },
  components:{
    locBrief: () => import('./loc-brief.vue')
  },
  computed:{
    style(){
      return {height:this.deviceHeight - this.topHeight - this.stateBar-this.bottomHeight+'px'}
    },
  },
  methods:{
    setloc(v){
      let {...copy}=v
      copy.layer=copy.layer.appid
      this.$store.dispatch('map/setActLocation', copy)
      setTimeout(()=>{
        this.$store.commit('menu/toexpend',true)
      },300)
    }
  },
  watch:{
    actLocation(loc){
      if(loc){

      }else{
        setTimeout(()=>{
          this.$store.commit('menu/toexpend',false)
        },300)
        const s = (this.deviceHeight - this.topHeight) / 2 -this.stateBar-this.bottomHeight
        this.map.el.style.transform = `translateY(${-s}px)`
        if(this.savecenter){
          this.map_movetoPoint({
            coord:this.savecenter,
            zoom:this.savezoom,
            duration:500
          })
        }
      }
    }
  },
  mounted(){
    const s = (this.deviceHeight - this.topHeight) / 2 -this.stateBar-this.bottomHeight
    this.map.el.style.transform = `translateY(${-s}px)`
    this.list.forEach(v=>{
      v.layer=this.ellayers[v.layer]
    })
    this.savecenter=this.view.getCenter()
    this.savezoom=this.view.getZoom()
  },
  beforeDestroy(){
    this.map.el.style.transform = ``
  }
}
</script>

<style scoped>
  .points-list{
    position: absolute;
    bottom:0;
    background:#fff;
    width:inherit;
    height:inherit;
    z-index:3;
    overflow:auto;
    transition:all .5s;
  }
  .points-item{
    height:80px;
    overflow:hidden;
    padding:5px 1rem;
  }
  .list-wrapper{
    position:absolute;
    left:0;
    bottom:0;
    width:100vw;
  }
</style>
<style>
  div.points-item>div.brief>div.name{
    font-size:var(--normalsize);
  }
</style>
