<template>
  <div id="app" :style="{height:deviceHeight+'px',width:deviceWidth+'px'}">
    <transition
      :leave-active-class="leaveclass"
      :enter-active-class="enterclass"
    >
        <router-view></router-view>
    </transition>
        <el-button :style="{position:'absolute',bottom:0,right:0,zIndex:111}" @click="_goback()">返回</el-button>
  </div>
</template>

<script>

export default {
  name: 'SPC-map',
  mounted () {
    // console.log(document.documentElement);
    this.$store.commit('deviceHeight', window.innerHeight)
    this.$store.commit('deviceWidth', window.innerWidth)
    // 控制body固定高度，其他元素根据body适应
    // 防止软键盘破坏布局，必须写死高度
    const docEl = document.documentElement.style
    document.body.style.height = this.deviceHeight + 'px'
    window.addEventListener('resize', () => { // 用onresize事件监控窗口或框架被调整大小，先把一开始的高度记录下来
      if (document.body.scrollHeight < this.deviceHeight) { // 如果当前窗口小于一开始记录的窗口高度，那就让当前窗口等于一开始窗口的高度
        document.body.style.height = this.deviceHeight + 'px'
      }
    })
    // 自适应手机尺寸
    const recalc = () => {
      docEl.fontSize = 18 * (this.deviceWidth / 375) + 'px'
    }
    window.addEventListener('orientationchange', recalc, false)
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
    /* overflow: hidden 会影响 window.innerHeight */
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  :root {
    font-family: 'Microsoft Yahei';
    /* 设计稿width:375px */
    font-size: 18px;
    letter-spacing: .1rem;
    color:#555;
    font-weight:600;
  }

  #app{
    position: relative;
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #app .slow{
    animation-duration: 3.3s;
  }
</style>
