<template>
  <div id="topic-menu" class="swiper-container center-bottom">
    <div class="swiper-wrapper vertical">
        <slot></slot>
        <div class="swiper-slide">
          slide1
        </div>
        <div class="swiper-slide">
          slide2
        </div>
        <div class="swiper-slide">
          slide3
        </div>
    </div>
    <div>
      <div>首页</div>
      <div>应用</div>
      <div>我的</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topic-menu',
  data () {
    return {}
  },
  async mounted () {
    this.swiper = this.$swiper('.swiper-container', {
      direction: 'vertical'
    })
  }
}
</script>

<style scoped>
  #topic-menu{
    width:100%;
    height:200px;
    overflow: hidden;
    background:#fff;
  }
  /* .swiper-wrapper{
  } */
  .swiper-slide{
    height:100px;
    background:#fff;
  }
</style>
