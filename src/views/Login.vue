<template>
  <div id="login" ref="login" class="flex-center swiper-container">
    <div class="swiper-wrapper flex-center">
      <transition appear enter-active-class="animated slideInDown">
        <div class="logo flex-center" :class="{expand:isCollapse}">
          <div>
            <img src="../assets/user.png" alt="">
          </div>
        </div>
      </transition>
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
          <el-footer ref="submit" :class="failTipClass" class="flex-center">
            <transition name="fade" mode="out-in">
              <div v-if="!loading" @click="submit" key="off">
                <transition name="fade" mode="out-in" :duration="300">
                  <span v-if="failTipClass">重新登录</span>
                  <span v-else>进入地图</span>
                </transition>
                <move-arrow class="right-arrows"></move-arrow>
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
    <move-arrow
        v-show="!isCollapse"
        class="up-arrows"
        :config="{num:2,direct:'up',duration:1600}"
    ></move-arrow>
  </div>
</template>

<script>
import lottieLoading from '../components/lottie-loading.vue'
import moveArrow from '../components/move-arrow.vue'

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
    lottieLoading,
    moveArrow
  },
  mounted () {
    this._nameclass(['', 'slow'])
    const Swiper = this.Swiper
    Swiper(this.$el, {
      direction: 'vertical'
    })
    this.swiper = this.$el.swiper
    console.log(this.swiper)
  },
  methods: {
    async submit (e) {
      const v = await this.$refs.ruleform.validate().catch(v => v)
      if (v) {
        const delay = await Promise.all([
          new Promise(resolve => {
            setTimeout(() => {
              resolve(true)
            }, this.loadingDuration + this.loadingDelay)
          }), await this.login_submit().then(t => {
            setTimeout(async () => {
              const oy = this.getOY()
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
      const { y, height } = this.$refs.submit.$el.getBoundingClientRect()
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
    background: url('../assets/bg.png');
    background-size: cover;
    background-position: center;
  }
  .logo{
    background:#409EFF;
    position:absolute;
    top:-2rem;
    height:12rem;
    width:120vw;
    border-radius:0 0 50% 50%;
    box-shadow:0 2px 2px 1px rgba(0,0,0,.2);
    transform: translate(0,0);
    transition:all .3s ease-out;
  }
  .logo.expand{
    transform: translate(0,-14rem);
  }
  .logo>div{
    margin-top:1rem;
    height:5rem;
    width:5rem;
    border-radius:50%;
    background:#fff;
  }
  .logo img{
    margin-top:.6rem;
    height:100%;
    width:100%;
  }
  #getlogin{
    height:3rem;
    line-height:3rem;
    width:60%;
    position:absolute;
    bottom:27rem;
    border-radius: 20px;
    color: #FFF;
    display: inline-block;
    background-color: #409EFF;
    border-color: #409EFF;
    text-align: center;
    box-shadow:0 2px 3px 1px rgba(0,0,0,.2);
    transition:all .34s ease-in;
    z-index:1;
    transform:translateY(22rem);
  }
  #getlogin.expand{
    transform:translateY(0);
    transition:all .34s ease-out .06s;
    width:80%;
    border-radius: 0;
    background:#0499d4;
    border-radius:8px 8px 0 0;
    letter-spacing: 4px;
    box-shadow:0 1px 2px 1px rgba(0,0,0,.2);
  }
  #form {
    width:80%;
    height:14rem;
    position:absolute;
    bottom:16rem;
    border-radius:8px;
  }
  .slideUp{
    animation: slidelogin .4s ease-out;
  }
  .slideDown{
    //ease-out reverse 其实是ease-in
    animation: slidelogin .4s ease-out reverse;
  }
  @keyframes slidelogin {
    0%{
      transform:translateY(30rem);
      box-shadow:none
    }
    50%{
      box-shadow:none
    }
    100%{
      transform:translateY(0);
    }
  }
  .el-container{
    background: transparent;
  }
  .el-main{
    padding:10px 20px;
    background: #fff;
    box-shadow:0 1px 2px 1px rgba(0,0,0,.2);
  }
  .el-footer {
    background-color: #0499d4;
    color: #fff;
    text-align: center;
    line-height: 3rem;
    height:3rem !important;
    box-shadow:0 2px 2px 1px rgba(0,0,0,.2);
    border-radius:0 0 8px 8px;
    transition: all .5s linear;
  }
  .el-footer.failtip{
    transition:all .5s ease-out;
    background:rgb(250, 0, 0);
  }
  .el-footer>div{
    width:100%;
  }
  .right-arrows{
    position:absolute;
    height:3rem;
    width:.9rem;
    bottom:0;
    right:1.6rem;
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
    color:#0499d4;
  }
  .el-input .el-input__clear{
    line-height: 2.6rem;
    font-size:1.2rem;
  }
  .line{
    position:absolute;
    width:104%;
    margin-left:-2%;
    border-top:.5px solid #0499d4;
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
  .up-arrows{
    color:#fff;
    position:absolute;
    bottom:2rem;
    width:5rem;
    height:.8rem;
    opacity: .7;
  }
</style>
