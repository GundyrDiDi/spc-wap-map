<template>
<div style="width:200px;position:relative">
  <div class="swiper-container" style="height:600px">
    <div class="swiper-wrapper vertical">
      <div class="swiper-slide" style="height:100px">1</div>
      <div class="swiper-slide" style="height:200px">2</div>
      <div class="swiper-slide" style="height:300px">3</div>
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
    this.s = this.$swiper('.swiper-container', {
      init: false,
      direction: 'vertical',
      slidesPerView: 'auto'
    })
    setTimeout(() => {
      this.s.init()
    }, 111)
  }
}
</script>

<style scoped>

</style>
