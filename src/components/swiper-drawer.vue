<template>
  <el-drawer v-bind="$attrs" :visible="visible" @close="handleClose">
    <div class="swiper-container" ref="swc">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
        <div class="swiper-slide a2" :style="{paddingTop:barHeight+'px'}">
          <slot></slot>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
// ElementUi
// Swiper
export default {
  name: 'swiper-drawer',
  data () {
    return {
      barHeight: 0
    }
  },
  beforeDestroy () {
    if (this.swiper) {
      this.swiper.destroy()
    }
  },
  mounted () {
    var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
    if (ms && ms.length >= 3) {
      this.barHeight = parseFloat(ms[2])
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    }
  },
  watch: {
    visible: (() => {
      let i = true
      return function (v) {
        if (v && i) {
          i = false
          requestAnimationFrame(() => {
            const _ = this
            this.swiper = this.$swiper(this.$refs.swc, {
              // allowSlideNext: false,
              resistanceRatio: 0,
              initialSlide: 1,
              on: {
                slideChangeTransitionStart: function (e) {
                  if (this.activeIndex === 0) {
                    _.handleClose()
                    this.slideNext()
                  }
                }
              }
            })
          })
        }
      }
    })()
  },
  props: ['visible']
}

</script>

<style>
  .el-drawer {
    background: transparent;
    box-shadow: none;
    overflow: visible;
    outline: none;
  }

  .el-drawer__body>* {
    width: 100%;
    height: 100%;
  }

  .el-drawer__body .swiper-slide.a2 {
    background: #fff;
    box-shadow:1px 1px 1px 1px #fff;
    /* box-shadow: 0 8px 10px -5px rgba(0, 0, 0, .2), 0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12); */
  }
  /* .swiper-slide{

  } */
</style>
