<template>
  <div class="swiper-container flexible" ref="flexible">
    <div class="swiper-wrapper">
      <div class="swiper-slide" ref="t">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flexible-container',
  watch: {
    allow (a) {
      this.swiper.allowTouchMove = a
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.t.style.height = getComputedStyle(this.$slots.default[0].elm).height
    }, 500)
    setTimeout(() => {
      this.swiper = this.$swiper(this.$refs.flexible, {
        direction: 'vertical',
        nested: true,
        resistanceRatio: this.radio || 0.8,
        slidesPerView: 'auto',
        freeMode: true,
        allowSlidePrev: this.allow === undefined ? true : this.allow,
        allowTouchMove: this.allow === undefined ? true : this.allow
      })
    }, 600)
  },
  props: ['direct', 'radio', 'allow']
}
</script>

<style>
  .flexible{
    width:100%;
    height:100%;
  }
</style>
