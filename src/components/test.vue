<template>
<div>
  <el-button icon="el-icon-search" circle></el-button>
  <div class="swiper-container">
  <div class="swiper-wrapper vertical">
    <div class="swiper-slide">slider1</div>
    <div class="swiper-slide">slider2</div>
    <div class="swiper-slide">slider3</div>
  </div>
</div>
</div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {}
  },
  mounted () {
    this.swiper = this.$swiper('.swiper-container', {
      direction: 'vertical'
    })
  }
}
</script>

<style scoped>
  .swiper-container{
    width:80vw;
    height:50vh;
    border:1px solid #ddd;
    overflow:visible;
  }
</style>
