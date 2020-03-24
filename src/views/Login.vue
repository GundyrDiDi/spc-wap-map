<template>
  <div id="login">
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
                placeholder="UserName"
                :value="username"
                @input="_commit({chain:'login.username',value:$event})"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                show-password
                placeholder="Password"
                :value="password"
                @input="_commit({chain:'login.password',value:$event})"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <div></div>
          </el-form>
          <!-- <div class="el-grid">
            <div>
              <i class="el-icon-user"></i>
            </div>
            <div>
              <input type="text" v-commit="login.username" class="el-input__inner">
            </div>
          </div> -->
        </el-main>
        <el-footer height="3.2rem">
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
    console.log(this.isCollapse)
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
    width: inherit;
    height: inherit;
    background: url('../assets/bg1.jpg');
    background-size: cover;
    background-position: center;
  }
  #form {
    width:inherit;
    height:20rem;
    background:#fff;
    position:absolute;
    bottom:0;
    box-shadow:0 0 2px 1px rgba(0,0,0,.2)
  }
  #getlogin{
    width:80%;
    margin-left:10%;
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
    transition:all .3s linear;
    z-index:1;
  }
  #getlogin.expand{
    transition:all .28s linear .12s;
    margin:0;
    width:100%;
    border-radius: 0;
    bottom:20rem;
    background:rgb(98, 208, 252);
    box-shadow:0 0 2px 1px rgba(0,0,0,.2);
  }

  .slideUp{
    animation: slidelogin .4s linear;
  }
  .slideDown{
    animation: slidelogin .4s linear reverse;
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
    line-height: 3.2rem;
    box-shadow:0 1px 2px 0px inset rgba(0,0,0,.2);
  }
  .el-icon-d-arrow-right{
    line-height: 3.2rem;
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
    padding-left: 3rem;
  }
  .el-input--suffix .el-input__inner{
    padding-right: 3rem;
  }
  .el-input__icon{
    line-height: 2.6rem;
    font-size:2rem;
    color:rgb(15, 3, 121);
  }
  .el-input .el-input__clear{
    line-height: 2.6rem;
    font-size:1.2rem;
  }
</style>
