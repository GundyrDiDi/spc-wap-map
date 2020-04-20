<template>
<div style="width:100%;position:relative">
  <div class="swiper-container swiper-container1" style="height:500px;border:1px solid #ddd">
    <div class="swiper-wrapper vertical">
      <div class="swiper-slide" style="height:100px">1</div>
      <div class="swiper-slide" style="height:200px">
        <div class="swiper-container swiper-container2" style="height:100%">
          <div class="swiper-wrapper">
            <div class="swiper-slide" style="height:400px;background:#ddd">
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
              <p>1</p>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-slide" style="height:800px">3</div>
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
    this.s = this.$swiper('.swiper-container1', {
      direction: 'vertical',
      slidesPerView: 'auto'
    })
    setTimeout(() => {
      this.swiper = this.$swiper('.swiper-container2', {
        direction: 'vertical',
        nested: true,
        resistanceRatio: 0.8,
        slidesPerView: 'auto',
        freeMode: true
      })
    }, 111)
  }
}
</script>

<style scoped>
  .swiper-container{

  }
</style>
