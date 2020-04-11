<template>
  <div id="topic-menu" class="center-bottom"
  :style="slides[4]">
    <div class="swiper-container" ref="parent"
    :style="slides[0]"
    >
      <div class="swiper-wrapper vertical">
          <slot v-bind:slides="slides"></slot>
          <div class="swiper-slide search-box shadow-top"
          :style="slides[1]">
            <div :style="slides[6]">

            </div>
          </div>
          <div class="swiper-slide"
          :style="slides[2]">
            <div class="swiper-container"
            ref="child"
            >
              <div class="swiper-wrapper">
                <div class="swiper-slide" style="height:1500px;">
                  <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis laudantium iusto tempore possimus numquam vero temporibus quasi nihil dolorum et quis, blanditiis sunt, sit, mollitia cupiditate expedita? Culpa, laboriosam rem?</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="center-bottom flex" id="bottom-buttons"
    :style="slides[5]"
    >
      <div>首页</div>
      <div>应用</div>
      <div>我的</div>
    </div>
  </div>
</template>

<script>
// import searchBox from './search-box.vue'
export default {
  name: 'topic-menu',
  data () {
    return {

    }
  },
  components: {
    // searchBox
  },
  computed: {
    slides () {
      var height = 120; var translateY = 50
      return [
        { height: `${height}px` }, // swiper-contianer
        { height: `${height}px`, transform: `translateY(${translateY}px)` },
        { height: this.vpHeight - (height - translateY) - this.bottomHeight + 'px', zIndex: 1 },
        { top: `${translateY - 10}px` }, // right-top
        { height: `${height + this.bottomHeight}px` }, // topic-menu
        { height: `${this.bottomHeight}px` }, // bottom-buttons
        { height: `${height - translateY}px` }// search-box
      ]
    }
  },
  methods: {
    test () {
      console.log('slide')
    }
  },
  async mounted () {
    this.swiper = this.$swiper(this.$refs.parent, {
      direction: 'vertical',
      resistanceRatio: 0,
      slidesPerView: 'auto',
      on: {
        transitionEnd: () => {
          this.swiper2.allowTouchMove = this.swiper.progress === 1
          var _ = this.swiper
          if (_.activeIndex === 1) {
            console.log(_.translate)
          }
        }
      }
    })
    this.swiper2 = this.$swiper(this.$refs.child, {
      direction: 'vertical',
      nested: true,
      resistanceRatio: 0,
      slidesPerView: 'auto',
      freeMode: true
    })
  }
}
</script>

<style scoped>
  #topic-menu{
    width:100%;
    pointer-events: none !important;
  }
  #topic-menu>*{
    pointer-events: auto;
  }
  #topic-menu>.swiper-container{
    overflow: visible;
    pointer-events: none
  }
  .swiper-container .swiper-container{
    height:100%;
  }
  .swiper-wrapper{
    pointer-events: none !important
  }
  .swiper-wrapper>*{
    pointer-events: auto
  }
  .swiper-slide{
    background:#fff;
  }
  #bottom-buttons{
    background:#fff;
    width:100%;
    justify-content: space-between;
    align-items: center;
  }
  #bottom-buttons>div{
    flex:1;
    text-align: center;
  }
  .search-box{
    border-radius:12px 12px 0 0;
  }
</style>
