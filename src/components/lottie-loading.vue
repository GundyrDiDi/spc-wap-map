<template>
<div id="overlay">
  <lottie :options="defaultOptions"></lottie>
</div>
</template>

<script>
import lottie from 'vue-lottie'
import maploading from '../assets/1.json'
import searchloading from '../assets/3.json'

export default {
  name: 'lottie-loading',
  components: {
    lottie
  },
  data () {
    const loading = this.type ? searchloading : maploading
    return {
      defaultOptions: {
        animationData: loading
        // animationSpeed: 100
      }
    }
  },
  props: ['type']
}
</script>

<style scoped>

</style>
