<template>
  <div class="history-list flex-column">
    <div v-for="(v,i) in historyList" :key="i" class="history-item flex">
      <aside class="flex-center">
        <i class="el-icon-location-outline"></i>
      </aside>
      <div :class="i<historyList.length-1&&'hordivider'">{{v.point}}</div>
    </div>
    <div v-show="historyList.length" class="clearH hordivider all" @click="clear">
      清空历史纪录
    </div>
  </div>
</template>

<script>
export default {
  name: 'history-list',
  mounted () {
    console.log(this.historyList)
  },
  methods: {
    clear () {
      this.$confirm('清空历史纪录?', '', {
        confirmButtonText: '立即清空',
        cancelButtonText: '取消'
      }).then(() => {
        this._clearHistory()
      }).catch(() => {

      })
    }
  }
}

</script>

<style scoped>
  .history-list{
    background:#fff;
    box-shadow:0 1px 3px rgba(0,0,0,.15);
    font-size:var(--normalsize);
  }
  .history-item{
    line-height:3rem;
  }
  .history-item>aside{
    height:3rem;
    width:3rem;
  }
  .history-item>div{
    flex:1
  }
  .clearH{
    line-height:2.5rem;
    font-size:var(--smallsize);
    text-align: center;
    color:#999;
  }
</style>
