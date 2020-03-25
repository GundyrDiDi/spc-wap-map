<template>
  <div id="login" ref="login">
    <div id="getlogin"
      :class="{expand:isCollapse}"
      @click="isCollapse=!isCollapse">
      登录
    </div>
    <transition enter-active-class="slideUp" leave-active-class="slideDown">
      <el-container id="form" v-show="isCollapse">
        <el-main>
          <el-form :model="login" :rules="rules" ref="ruleForm">
            <el-form-item prop="username">
              <el-input
                clearable
                placeholder="用户名"
                :value="username"
                @input="_commit({chain:'login.username',value:$event})"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                clearable
                type="password"
                placeholder="密码"
                :value="password"
                @input="_commit({chain:'login.password',value:$event})"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <div></div>
          </el-form>
        </el-main>
        <el-footer>
          <span @click="submit">进入地图</span>
          <i class="el-icon-d-arrow-right"></i>
        </el-footer>
      </el-container>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      isCollapse: true,
      rules: {
        username: {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      }
    }
  },
  mounted () {
    // 防止软键盘破坏布局，必须写死高度
    // console.log(this.$refs.login.style.height=window.innerHeight+'px');
    console.log(this.isCollapse)
    // const h = document.body.scrollHeight  // 用onresize事件监控窗口或框架被调整大小，先把一开始的高度记录下来
    // window.onresize = function () { // 如果当前窗口小于一开始记录的窗口高度，那就让当前窗口等于一开始窗口的高度
    //   if (document.body.scrollHeight < h) {
    //     console.log(h);
    //     document.body.style.height = h+'px'
    //   }
    // }
  },
  methods: {
    async submit () {
      const vail = await this.login_submit()
      if (vail) {
        this.router.go('home')
      }
    }
  }
}

</script>

<style lang="less">
  #login {
    bottom:0;
    left:0;
    top:0;
    right:0;
    position: fixed;
    width: 100%;
    height: 100%;
    background: url('../assets/bg2.jpg');
    background-size: cover;
    background-position: center;
  }
  #form {
    width:inherit;
    height:12rem;
    background:#fff;
    position:absolute;
    bottom:0;
    box-shadow:0 0 2px 1px rgba(0,0,0,.2)
  }
  #getlogin{
    width:60%;
    margin-left:20%;
    font-size:1rem;
    position:absolute;
    bottom:4rem;
    border-radius: 20px;
    padding: 12px 23px;
    color: #FFF;
    display: inline-block;
    background-color: #409EFF;
    border-color: #409EFF;
    text-align: center;
    box-shadow:0 2px 2px 0px rgba(0,0,0,.2);
    transition:all .17s linear;
    z-index:1;
  }
  #getlogin.expand{
    transition:all .21s linear .09s;
    margin:0;
    width:100%;
    border-radius: 0;
    bottom:12rem;
    background:rgb(4, 153, 212);
    box-shadow:0 0 2px 1px rgba(0,0,0,.2);
  }

  .slideUp{
    animation: slidelogin .3s linear;
  }
  .slideDown{
    animation: slidelogin .3s ease-in reverse;
  }
  @keyframes slidelogin {
    0%{
      transform:translate(0,100%);
    }
    100%{
      transform: translate(0,0);
    }
  }
  .el-footer {
    background-color: rgb(4, 153, 212);
    color: #fff;
    text-align: center;
    line-height: 3rem;
    height:3rem !important;
    box-shadow:0 1px 2px 0px inset rgba(0,0,0,.2);
  }
  .el-icon-d-arrow-right{
    line-height: 3rem;
    position: absolute;
    right: 1rem;
  }
  .el-input__inner {
    height: 2.6rem;
    line-height: 2.6rem;
    font-size:1rem;
    border: 1px solid transparent;
    border-bottom: 1px solid #DCDFE6;
  }
  .el-input--prefix .el-input__inner{
    padding-left: 2rem;
  }
  .el-input--suffix .el-input__inner{
    padding-right: 2rem;
  }
  .el-input__icon{
    line-height: 2.6rem;
    font-size:1.2rem;
    color:rgb(15, 3, 121);
  }
  .el-input .el-input__clear{
    line-height: 2.6rem;
    font-size:1.2rem;
  }
</style>
