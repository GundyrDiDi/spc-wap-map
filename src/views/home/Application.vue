<template>
  <div id="application">
    <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
      <el-button v-show="show">
        按钮
      </el-button>
    </transition>
    <div @click="notify(v)" v-for="v in ellayers" :key="v.id">
      {{v.name}}
    </div>
    <button @click="fanhui">显示</button>
  </div>
</template>

<script>
export default {
  name:'applicaion',
  data(){
    return {
      show:true
    }
  },
  methods:{
    notify(v){
      console.log(v);
      this.$notify({
        title: v.name,
      })
    },
    fanhui(){
      this.show=!this.show
      // this.$router.push('/home')
    }
  },
  watch:{
    show(now,old){
      console.log(now);
      console.log(old);
    }
  },
  mounted(){
    // console.log(this.$el)
  }
}
</script>

<style scoped>
  #application{
    position: absolute;
    background: #f6f6fc;
    z-index: 1;
    pointer-events: auto;
    overflow: hidden;
    padding-top: 10px;
    height: 617px;
    width: 375px;
  }
</style>
