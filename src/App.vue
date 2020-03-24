<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'SPC-map'
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
  }

  #app{
    position:fixed;
    width:100vw;
    height:100vh;
  }
  div{
    box-sizing: border-box;
  }
</style>
