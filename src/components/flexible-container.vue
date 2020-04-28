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
  data () {
    return {}
  },
  watch: {
    allow (a) {
      this.swiper.allowTouchMove = a
    },
    data () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.swiper.destroy()
  },
  methods: {
    init () {
      this.swiper && this.swiper.destroy()
      setTimeout(() => {
        this.$refs.t.style.height = getComputedStyle(this.$slots.default[0].elm).height
        this.$refs.flexible.style.overflow = this.visible ? 'visible' : 'hidden'
      }, 300)
      setTimeout(() => {
        this.swiper = this.$swiper(this.$refs.flexible, {
          direction: 'vertical',
          nested: true,
          resistanceRatio: this.radio === undefined ? 0.8 : this.radio,
          slidesPerView: 'auto',
          freeMode: true,
          allowTouchMove: this.allow === undefined ? true : this.allow,
          on: {
            setTransition: () => {
              this.$emit('slide')
            }
          }
        })
        if (!this.allowPrev) {
          this.swiper.on('touchMove', function () {
            if (this.isBeginning) {
              this.allowSlidePrev = false
            } else {
              this.allowSlidePrev = true
            }
          })
        }
      }, 400)
    }
  },
  props: ['direct', 'radio', 'allow', 'allowPrev', 'data', 'visible']
}
</script>

<style>
  .flexible{
    width:100%;
    height:100%;
  }
</style>
