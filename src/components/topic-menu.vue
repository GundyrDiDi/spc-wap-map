<template>
  <div id="topic-menu">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <el-container>
          <el-main>
            <input type="text">
          </el-main>
          <el-footer>
            <div>
              <div>首页</div>
              <div>应用</div>
              <div>我的</div>
            </div>
          </el-footer>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topic-menu',
  data () {
    return {}
  },
  mounted () {

  }
}
</script>

<style scoped>
  #topic-menu{
    width:100%;
  }
  .el-container{
    background:#fff;
  }
</style>
