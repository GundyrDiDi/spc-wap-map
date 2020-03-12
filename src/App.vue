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
    font-family: 'Microsoft Yahei';
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  :root {
    font-size: 18px;
  }

</style>
