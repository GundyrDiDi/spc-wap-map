<template>
  <flexible-container>
    <div id="theme-panel">
      <div class="heading">
        主题
      </div>
      <div class="body theme flex">
        <div v-for="v in tiles" :key="v.name" class="flex-center flex-column">
          <div @click="map_switchTile(v)" class="relative">
            <img :class="{active:v.selected}" :src="v.icon" alt="">
            <div v-show="v.selected" class="selected">
              <i class="el-icon-check"></i>
            </div>
          </div>
          <div :class="{active:v.selected}">
            {{v.name}}
          </div>
        </div>
      </div>
      <!-- <div class="heading">
        事件
      </div>
      <div class="body flex">
        <div class="flex-column flex-center">
          <div>公务车</div>
        </div>
        <div class="flex-column flex-center">
          <div>卡车</div>
        </div>
        <div class="flex-column flex-center">
          <div>消防车</div>
        </div>
      </div> -->
      <div class="heading">
        图层
      </div>
      <div class="body layers">
        <div v-for="v in applayers" :key="v.name" class="flex-center">
          <img :src="v.icon" alt="">
          <div class="name">{{v.name}}</div>
          <el-switch @change="map_switchApplayer(v)" :value="v.selected" class="swiper-no-swiping"></el-switch>
        </div>
      </div>
    </div>
  </flexible-container>
</template>

<script>
import flexibleContainer from './flexible-container.vue'
export default {
  name: 'theme-panel',
  mounted () {

  },
  components: {
    flexibleContainer
  },
  methods: {

  }
}
</script>

<style scoped>
  #theme-panel{
    overflow:auto;
    font-weight:600;
  }
  #theme-panel>*{
    padding-left:1rem;
    padding-right:1rem;
    font-size:.6rem;
  }
  .heading{
    background:#f2f2f2;
    height:1.5rem;
    line-height:1.5rem;
  }
  .body{
    padding:.7rem 0;
  }
  .body.flex{
    justify-content: space-between;
  }
  .theme img{
    border:1px solid #ddd;
    border-radius:2px;
    margin-bottom:.4rem;
    height:3.5rem;
  }
  .theme img.active{
    box-shadow:0 0 0 2px rgb(72, 136, 231);
  }
  .theme div.active{
    color:rgb(72, 136, 231);
  }
  .selected{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0.4rem;
    text-align: center;
    background: rgb(72, 136, 231);
    color: #fff;
  }
  .layers>div{
    padding:.8rem 0;
    font-size:.7rem;
    align-items: center;
  }
  .layers img{
    width:1.2rem;
    height:1.2rem;
    transform:translateY(-1px)
  }
  .layers .name{
    flex:1;
    padding-left:.6rem;
    transform: translateY(-.5px);
  }
  .el-button{
    height: 3rem;
    width: 3rem;
  }
</style>
