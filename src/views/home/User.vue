<template>
  <div id="user" :style="ctastyle">
    <div class="bar" :style="[barstyle,{opacity:baropacity}]">
      <div>
        <div>
          <img src="../../assets/head1.jpeg" alt="">
          {{username}}
        </div>
        <div class="right-top">
          <i class="el-icon-chat-dot-round" @click="_record({type:'msgDrawer',value:true})"></i>
          <i class="el-icon-postcard"></i>
          <i class="el-icon-setting"></i>
        </div>
      </div>
    </div>
    <div class="bg" :style="{opacity:1-baropacity}">
      <img src="../../assets/userbg.png" alt="">
    </div>
    <div class="sub">
      <div class="right-top">
        <i class="el-icon-chat-dot-round"></i>
        <i class="el-icon-postcard"></i>
        <i class="el-icon-setting"></i>
      </div>
      <div class="wrapper" ref="wrapper">
        <div class="head flex">
          <img src="../../assets/head1.jpeg" alt="">
          <div>{{username}}</div>
        </div>
        <div class="info flex-between">
          <div class="panel">
            <div>工号</div>
            <div class="des">A0210420</div>
            <div>岗位</div>
            <div class="des">研发工程师</div>
          </div>
          <div class="panel">
            <div>所属公司</div>
            <div class="des">众达信息</div>
            <div>部门</div>
            <div class="des">研发中心</div>
          </div>
        </div>
        <div class="panel">
          <div>我的主题</div>
          <div style="height:100px">

          </div>
        </div>
        <div class="panel">
          <el-collapse class="panel-item">
            <el-collapse-item v-for="(v,i) in ellayers" :key="i" :name="i" :title="v.name"></el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      baropacity: 0
    }
  },
  computed: {
    ctastyle () {
      return {
        paddingTop: this.truestateBar + 'px',
        height: this.deviceHeight - this.bottomHeight + 'px',
        width: this.deviceWidth + 'px'
      }
    },
    barstyle () {
      return {
        paddingTop: this.truestateBar + 'px'
      }
    }
  },
  mounted () {
    this.$refs.wrapper.addEventListener('scroll', e => {
      this.baropacity = (this.$refs.wrapper.scrollTop - 30) / 100
    })
  }
}
</script>

<style scoped>
  #user{
    position: absolute;
    background:#f6f6fc;
    z-index:1;
    pointer-events: auto;
    overflow: hidden;
  }
  .bg{
    position: absolute;
    width:100%;
    top:-30px;
  }
  .bg:after{
    content: '';
    width: 200%;
    height: 20%;
    position: absolute;
    bottom: 0;
    left: -50%;
    box-shadow:0 -25px 25px #f6f6fc inset;
  }
  .bg>img{
    width: 100%;
    height:100%;
  }
  .sub{
    margin:0 .5rem;
    height:100%;
    position: relative;
  }
  .right-top{
    font-size:var(--bigsize);
    color:#fff;
    height:2rem;
  }
  .right-top>i{
    margin:0 .5rem
  }
  .sub>.right-top{
    margin-top:.5rem;
  }
  .bar{
    position:fixed;
    top:0;
    background:#fff;
    z-index:1;
    width:100%;
    padding-right:.5rem;
    padding-left:.5rem;
    box-shadow:0 1px 2px 1px rgba(0,0,0,.16)
  }
  .bar>div{
    position:relative;
    height:3rem;
    line-height:3rem;
  }
  .bar i{
    color:#666;
  }
  .bar img{
    border-radius:50%;
    height:1.7rem;
    width:1.7rem;
    margin-bottom:.4rem;
    border: 3px solid #fff;
  }
  .wrapper{
    overflow: auto;
    padding:0 2px;
  }
  .wrapper>div{
    margin:1rem 0;
  }
  .wrapper>.head{
    margin-top:3rem;
    margin-bottom:1.5rem;
    padding:0 .5rem;
    color:#fff;
    line-height:3.5rem;
    font-size:var(--hugesize)
  }
  .head>img{
    border-radius:50%;
    height:3.5rem;
    width:3.5rem;
    box-shadow: 0 2px 3px 1px rgba(0, 0, 0, .4);
    border: 3px solid #fff;
  }
  .head>div{
    padding-left:1rem;
    font-size:var(--bigsize);
  }
  .info>div{
    width:48%;
    padding:6px 12px
  }
  .info .des{
    color:#999;
    margin-left:5px;
    font-size:var(--smallsize)
  }
  .panel{
    background:#fff;
    border-radius:8px;
    font-size:var(--normalsize);
    padding:10px 12px;
    box-shadow:0 0 2px 1px rgba(0,0,0,.06);
  }
</style>
<style>
  .el-collapse-item__header {
    padding-left:10px;
  }
</style>
