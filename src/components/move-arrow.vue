<template>
  <div class="box" :data-arrow="id">
    <span v-for="v in num" :key="v"
      :style="position(v)"
    >
      <slot>
        <i :class="arrowicon"></i>
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'move-arrow',
  data () {
    return {
      id: ''
    }
  },
  mounted () {
    let { height, width } = getComputedStyle(this.$el)
    height = ~~(parseFloat(height) / (this.isrow ? 1 : this.num))
    width = ~~(parseFloat(width) / (this.isrow ? this.num : 1))
    const id = this.id = parseInt(10 ** 8 * Math.random()).toString(16)
    const gap = this.gap = this.isahead * (this.isrow ? width : height)

    const keyframe = `
      [data-arrow="${id}"] span{
        position: absolute;
        display: inline-block;
        text-align: center;
        height: ${height}px;
        line-height: ${height}px;
        width: ${width}px;
        animation: arrow${id} ${this.duration / 1000}s linear infinite
      }
      [data-arrow="${id}"] span:first-child>i{
        animation: fade${this.isahead > 0 ? 'In' : 'Out'}${id} ${this.duration / 1000}s linear infinite
      }
      [data-arrow="${id}"] span:last-child>i{
        animation: fade${this.isahead < 0 ? 'In' : 'Out'}${id} ${this.duration / 1000}s linear infinite
      }
      @keyframes arrow${id}{
        from{
          transform:translate${this.isrow ? 'X' : 'Y'}(0)
        }
        to{
          transform:translate${this.isrow ? 'X' : 'Y'}(${gap}px)
        }
      }
      @keyframes fadeIn${id}{
        from{
          opacity:0;
        }
        to{
          opacity:1;
        }
      }
      @keyframes fadeOut${id}{
        from{
          opacity:1;
        }
        to{
          opacity:0;
        }
      }
    `
    const style = this.style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = keyframe
    document.body.appendChild(this.style)
  },
  beforeDestroy () {
    setTimeout(() => {
      document.body.removeChild(this.style)
    }, 5000)
  },
  computed: {
    isahead () {
      return ['right', 'down'].includes(this.direct) ? 1 : -1
    },
    isrow () {
      return ['left', 'right'].includes(this.direct)
    },
    arrowicon () {
      // Element UI 图标
      return `el-icon-arrow-${this.direct}`
    }
  },
  methods: {
    position (num) {
      return {
        [this.isrow ? 'left' : 'top']: this.isahead * (num - 1) * this.gap + 'px'
      }
    }
  },
  watch: {
    config: {
      handler ({ direct = 'right', num = 3, className = '', duration = 600 }) {
        this.direct = direct
        this.num = num
        this.className = className
        this.duration = duration
      },
      immediate: true
    }
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
</style>
