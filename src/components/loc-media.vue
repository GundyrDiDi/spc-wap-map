<template>
    <div class="media" :class="loaded&&'loaded'">
      <video ref="video"></video>
    </div>
</template>

<script>
export default {
  name: 'loc-media',
  data () {
    return {
      loaded: false
    }
  },
  methods: {

  },
  mounted () {
    const video = this.$refs.video
    // video.src = require('../assets/spc1.mp4')
    video.addEventListener('loadedmetadata', data => {
      video.play()
    })
    video.addEventListener('play', e => {
      this.loaded = true
    })
  },
  props: ['lct']
}

</script>

<style scoped>
  .media {
    width: 100%;
    height: 100%;
    transform:translateY(-100%);
    transition:all 300ms linear;
  }
  .media.loaded{
    transform: translateY(0);
  }
  video {
    width: inherit;
    height: inherit;
    /* object-fit: fill; */
  }

</style>
