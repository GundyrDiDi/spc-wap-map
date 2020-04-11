<template>
<div>
  <div class="swiper-container" id="swiper-container1">
    <div class="swiper-wrapper vertical">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide swiper-slide2" style="position:relative">
          <div class="swiper-container" id="swiper-container2">
            <div class="swiper-wrapper vertical">
              <div class="swiper-slide">
                <h4>一段很长的内容</h4>
                <p style="opacity:0.99;">一<br>段<br>很<br>长<br>的<br>内<br>容</p>
                <p style="opacity:0.98;">一<br>段<br>很<br>长<br>的<br>内<br>容</p>
                <p style="opacity:0.97;">一<br>段<br>很<br>长<br>的<br>内<br>容</p>
               </div>
            </div>
            <div class="swiper-scrollbar"></div>
          </div>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
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
  }
}
</script>

<style scoped>
</style>
