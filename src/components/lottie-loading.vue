<template>
<div id="overlay">
  <transition name="el-fade-in">
    <lottie :options="defaultOptions" :height="200" :width="200"></lottie>
  </transition>
</div>
</template>

<script>
import lottie from 'vue-lottie'
import maploading from '../assets/1.json'
export default {
  name: 'lottie-loading',
  components: {
    lottie
  },
  data () {
    return {
      defaultOptions: { animationData: maploading },
      animationSpeed: 1
    }
  }
}
</script>

<style scoped>

</style>
