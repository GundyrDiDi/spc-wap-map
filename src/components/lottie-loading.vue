<template>
<div id="overlay">
  <lottie :options="defaultOptions"></lottie>
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
      animationSpeed: 100
    }
  }
}
</script>

<style scoped>

</style>
