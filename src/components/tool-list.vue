<template>
  <div id="tool-list" class="relative">
    <div class="layer-container flex-wrap">
      <div v-for="(v,i) in Object.values(ellayers)"
      class="flex-center flex-column"
      :key="v.name"
      :style="i>=5&&opacity"
      @click="pickEl(v)"
      >
      <div :class="[v.bgcolor,v.selected&&'selected']" class="img-box">
        <img :src="v.icon" alt="">
      </div>
        <aside>{{v.name}}</aside>
      </div>
    </div>
    <div class="title">
      常用功能
    </div>
    <div class="offen" :style="position">
      <div class="all hordivider flex-center">
        <div @click="tomeasure">
          <i class="el-icon-video-camera"></i>
          多视频
        </div>
        <div  @click="tomark" class="verdivider">
          <i class="el-icon-location-outline"></i>
          标记
        </div>
      </div>
      <div class="hordivider flex-center">
        <div @click="tomeasure">
          <i class="el-icon-coordinate"></i>
          测距
        </div>
        <div @click="tosurround" class="verdivider">
          <i class="el-icon-office-building"></i>
          附近
        </div>
      </div>
      <div class="title">
        收藏点
      </div>
      <div class="favorate flex-column">
        <!-- <div class="flex-center">
          <img src="../assets/funimg/applayer/game3.png" alt="">
          <aside>友谊楼</aside>
          <i class="el-icon-arrow-right"></i>
        </div> -->
        <div @click="setloc(v)" v-for="v in favoList" :key="v.id" class="flex-center">
          <img :src="v.icon" alt="">
          <aside>{{v.name}}</aside>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tool-list',
  data () {
    return {

    }
  },
  methods: {
    setloc (loc) {
      const { ...copy } = loc
      this.$store.dispatch('map/setActLocation', copy)
    },
    pickEl (layer) {
      this.map_addEllayer(layer)
      this.$forceUpdate()
    },
    tomeasure () {
      this._goback()
      this._record({ type: 'map/mapstatus', value: 'measure' })
    },
    tomark () {
      this._goback()
      this._record({ type: 'map/mapstatus', value: 'mark' })
    },
    tosurround () {
      this._goback()
      this._record({ type: 'map/mapstatus', value: 'surround' })
    }
  },
  computed: {
    opacity () {
      const radio = (this.progress - this.breakPoint) / (1 - this.breakPoint)
      return {
        opacity: radio / 1,
        transition: this.transition
      }
    },
    position () {
      const radio = (this.progress - this.breakPoint) / (1 - this.breakPoint)
      const translate = Math.max(-130, -130 * (1 - radio))
      return {
        transform: `translateY(${translate}px)`,
        transition: this.transition
      }
    }
  },
  async mounted () {

  },
  props: ['progress', 'transition', 'breakPoint']
}
</script>

<style scoped>
  #tool-list{
    padding:5px 15px;
  }
  .layer-container>div{
    flex-basis: 20%;
    font-size:var(--smallsize);
    height:75px;
  }
  .layer-container aside{
    line-height:35px;
  }
  .img-box{
    border:2px solid #fff;
    background:#328ad5;
    border-radius:50%
  }
  .img-box.green{
    background:#2ad3ac;
  }
  .img-box.yellow{
    background:#ffc94e;
  }
  .layer-container img{
    height:36px;
    width:36px;
    border-radius:50%;
  }
  .selected{
    box-shadow:0 0 0 2px var(--color)
  }
  .offen{
    width: 100%;
    background: #fff;
  }
  .hordivider{
    height: 55px;
    font-size:var(--normalsize);
    position:relative;
  }
  .hordivider>div{
    flex:1;
    line-height:20px;
    padding-left:25px;
  }
  .title{
    margin-top:20px;
    margin-bottom:5px;
  }
  .favorate{
    padding:0 20px;
  }
  .favorate>div{
    margin:.8rem 0;
  }
  .favorate img{
    width:1.2rem;
    height:1.2rem;
  }
  .favorate aside{
    font-size:.75rem;
    flex:1;
    padding-left:10px;
  }
</style>
