<template>
  <div id="login" ref="login">
    <transition appear name="el-zoom-in-center">
      <div id="getlogin"
        :class="[{expand:isCollapse},failClass]"
        @click="isCollapse=!isCollapse">
        登录
      </div>
    </transition>
    <transition enter-active-class="slideUp" leave-active-class="slideDown">
      <el-container id="form" v-show="isCollapse" :class="failClass">
        <el-header height="3rem"></el-header>
        <el-main>
          <el-form :model="login" :rules="rules" ref="ruleform">
            <el-form-item prop="username">
              <el-input
                clearable
                placeholder="员工账号"
                :disabled="loading"
                :value="username"
                @input="$store.commit('login/username',$event)"
              >
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                clearable
                type="password"
                placeholder="密码"
                :disabled="loading"
                :value="password"
                @input="_commit({type:'login/password',value:$event})"
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
              <!-- <span>
                忘记密码？
              </span> -->
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer :class="failTipClass">
          <transition name="fade" mode="out-in">
            <div ref="submit" v-if="!loading" @click="submit" key="off">
              <transition name="fade" mode="out-in" :duration="300">
                <span v-if="failTipClass">重新登录</span>
                <span v-else>进入地图</span>
              </transition>
              <i v-for="v in 3" :key="v" class="el-icon-arrow-right" ></i>
            </div>
            <lottie-loading v-else class="lottie" key="on"></lottie-loading>
          </transition>
        </el-footer>
        <div class="line">
          上海石化地理信息平台
        </div>
      </el-container>
    </transition>
  </div>
</template>

<script>
import lottieLoading from '../components/lottie-loading.vue'

export default {
  name: 'login',
  data () {
    return {
      loadingDuration: 2000,
      loadingDelay: 200,
      failClass: '',
      failTipClass: '',
      isCollapse: true,
      rules: {
        username: {
          required: true,
          message: '请输入员工账号',
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
  components: {
    lottieLoading
  },
  mounted () {
    this._nameclass(['', 'slow'])
  },
  methods: {
    async submit (e) {
      const v = await this.$refs.ruleform.validate().catch(v => v)
      if (v) {
        const oy = this.getOY()
        const delay = await Promise.all([
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, this.loadingDuration + this.loadingDelay)
          }), await this.login_submit().then(t => {
            setTimeout(() => {
              t && this.$router.push({
                name: 'Home',
                params: { oy, delay: this.loadingDuration }
              })
            }, this.loadingDelay)
            return t
          })])
        this.$store.commit('loading', false)
        if (!delay[1]) {
          this.fail()
        }
      }
    },
    fail () {
      this.failClass = 'animated shake'
      this.failTipClass = 'failtip'
      setTimeout(() => {
        this.failClass = ''
        setTimeout(() => {
          this.failTipClass = ''
        }, 500)
      }, 500)
    },
    getOY () {
      const { y, height } = this.$refs.submit.getBoundingClientRect()
      return window.innerHeight / 2 - (height / 2 + y)
    }
  }
}

</script>

<style lang="less">
  #login {
    position: relative;
    width: inherit;
    height: inherit;
    // background: url('../assets/bg2.jpg');
    background-size: cover;
    background-position: center;
  }
  #getlogin{
    height:3rem;
    line-height:3rem;
    left:20%;
    width:60%;
    font-size:.9rem;
    position:absolute;
    bottom:4rem;
    border-radius: 20px;
    color: #FFF;
    display: inline-block;
    background-color: #409EFF;
    border-color: #409EFF;
    text-align: center;
    box-shadow:0 2px 1px 0px rgba(0,0,0,.2);
    transition:all .24s ease-in;
    z-index:1;
  }
  #getlogin.expand{
    transition:all .24s ease-out .06s;
    left:10%;
    width:80%;
    border-radius: 0;
    bottom:29rem;
    background:rgb(4, 153, 212);
    border-radius:8px 8px 0 0;
    letter-spacing: 4px;
    box-shadow:0 1px 1px 1px rgba(0,0,0,.2);
  }
  #form {
    left:10%;
    width:80%;
    height:14rem;
    background:#fff;
    position:absolute;
    bottom:18rem;
    box-shadow:0 2px 2px 1px rgba(0,0,0,.2);
    border-radius:8px;
  }
  .slideUp{
    animation: slidelogin .3s ease-out;
  }
  .slideDown{
    //ease-out reverse 其实是ease-in
    animation: slidelogin .3s ease-out reverse;
  }
  @keyframes slidelogin {
    0%{
      bottom:-12rem;
      box-shadow:none
    }
    50%{
      box-shadow:none
    }
    100%{
      bottom:18rem;
    }
  }
  .el-main{
    padding:10px 20px;
  }
  .el-footer {
    font-size:.9rem;
    background-color: rgb(4, 153, 212);
    color: #fff;
    text-align: center;
    line-height: 3rem;
    height:3rem !important;
    box-shadow:0 1px 2px 0px inset rgba(0,0,0,.2);
    border-radius:0 0 8px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .5s linear;
  }
  .el-footer.failtip{
    transition:all .5s ease-out;
    background:rgb(250, 0, 0);
  }
  .el-footer>div{
    width:100%;
  }
  .el-icon-arrow-right{
    line-height: 3rem;
    position: absolute;
  }
  .el-icon-arrow-right:nth-child(2){
    right: 1rem;
    animation:flashlast .8s linear infinite;
  }
  .el-icon-arrow-right:nth-child(3){
    right: 1.3rem;
    animation:flash .8s linear infinite;
  }
  .el-icon-arrow-right:nth-child(4){
    right: 1.6rem;
    animation:flashfirst .8s linear infinite;
  }
  @keyframes flash{
    0%{
      transform: translate(0,0);
    }
    100%{
      transform: translate(.3rem,0);
    }
  }
  @keyframes flashfirst{
    0%{
      opacity: 0;
      transform: translate(0,0);
    }
    100%{
      opacity: 1;
      transform: translate(.3rem,0);
    }
  }
  @keyframes flashlast{
    0%{
      opacity: 1;
      transform: translate(0,0);
    }
    100%{
      opacity: 0;
      transform: translate(.3rem,0);
    }
  }
  .el-input__inner {
    height: 2.6rem;
    line-height: 2.6rem;
    font-size:1rem;
    border-top: 1px solid transparent !important;
    border-left: 1px solid transparent !important;
    border-right: 1px solid transparent !important;
    border-bottom: 1px solid #DCDFE6;
    border-radius:1px;
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
    color:rgb(4, 153, 212);
  }
  .el-input .el-input__clear{
    line-height: 2.6rem;
    font-size:1.2rem;
  }
  .line{
    position:absolute;
    width:104%;
    margin-left:-2%;
    border-top:.5px solid #ddd;
    bottom:-2.2rem;
    text-align: center;
    font-size:.6rem;
    padding-top:.2rem;
    color:#0499d4;
  }
  .lottie,.lottie>div{
    height:3rem;
    width:3rem;
  }
  .fade-enter-active{
    animation:fadeInOut .2s
  }
  .fade-leave-active{
    animation: fadeInOut .2s reverse;
  }
  @keyframes fadeInOut {
    from{
      opacity:0
    }
    to{
      opacity:1
    }
  }
</style>
