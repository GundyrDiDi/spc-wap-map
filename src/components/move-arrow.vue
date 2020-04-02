<template>
  <div :style="boxstyle" class="box">
    <span v-for="v in num" :key="v" :style="iconstyle">
      <i :class="arrowicon"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'move-arrow',
  data () {
    return {
      iconstyle: {}
    }
  },
  mounted () {
    let { height, width } = this.$el.getBoundingClientRect()
    console.log(height, width)
    const gap = (this.isahead ? 1 : -1) * (this.isrow ? width : height) / this.num
    const id = 'arrow' + parseInt(10 ** 8 * Math.random()).toString(16)
    height = ~~(height / (this.isrow ? 1 : this.num))
    width = ~~(width / (this.isrow ? this.num : 1))
    const keyframe = `@keyframes ${id}{
      from{
        transform:translate${this.isrow ? 'X' : 'Y'}(0)
      }
      to{
        transform:translate${this.isrow ? 'X' : 'Y'}(${gap}px)
      }
    }`
    this.iconstyle = {
      height: height + 'px',
      lineHeight: height + 'px',
      width: width + 'px',
      animation: `${id} ${this.duration / 1000}s linear infinite`
    }
    const style = this.style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = keyframe
    document.body.appendChild(this.style)
  },
  beforeDestroy () {
    console.log()
    document.body.removeChild(this.style)
  },
  computed: {
    isahead () {
      return ['right', 'down'].includes(this.direct)
    },
    isrow () {
      return ['left', 'right'].includes(this.direct)
    },
    arrowicon () {
      // Element UI 图标
      return `el-icon-arrow-${this.direct}`
    },
    boxstyle () {
      return {
        flexDirection: this.isrow ? 'row' : 'column'
      }
    }
  },
  watch: {
    config: {
      handler ({ direct = 'right', num = 3, bgcolor = '#fff', className = '', duration = 600 }) {
        this.direct = direct
        this.num = num
        this.className = className
        this.duration = duration
        this.bgcolor = bgcolor
      },
      immediate: true
    }
  },
  props: {
    config: Object
  }
}
</script>

<style lang="less" scoped>
  .box{
    display: flex;
    flex-wrap:nowrap;
  }
  span{
    display: inline-block;
    text-align: center;
  }
</style>
