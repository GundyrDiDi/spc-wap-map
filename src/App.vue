<template>
  <div id="app">
    <transition
      :leave-active-class="leaveclass"
      :enter-active-class="enterclass"
    >
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SPC-map',
  mounted () {
    // 防止软键盘破坏布局，必须写死高度
    // 控制body固定高度，其他元素根据body适应
    const h = window.innerHeight
    this.$store.commit('deviceHeight', h)
    this.$store.commit('deviceWidth', window.innerWidth)
    document.body.style.height = h + 'px'
    window.addEventListener('resize', () => { // 用onresize事件监控窗口或框架被调整大小，先把一开始的高度记录下来
      if (document.body.scrollHeight < h) { // 如果当前窗口小于一开始记录的窗口高度，那就让当前窗口等于一开始窗口的高度
        document.body.style.height = h + 'px'
      }
    })
    // 自适应手机尺寸
    const docEl = document.documentElement
    const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    const recalc = function () {
      const clientWidth = docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 18 * (clientWidth / 375) + 'px'
    }
    window.addEventListener(resizeEvt, recalc, false)
    window.addEventListener('pageshow', recalc, false)
    document.addEventListener('DOMContentLoaded', recalc, false)
  }
}
</script>

<style>
  html {
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    user-select: none;
    -webkit-user-select: none;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  :root {
    font-family: 'Microsoft Yahei';
    /* 设计稿width:375px */
    font-size: 18px;
    letter-spacing: .1rem;
  }

  #app{
    position: relative;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div{
    box-sizing: border-box;
  }
  #app .slow{
    animation-duration: 3.3s;
  }
</style>
