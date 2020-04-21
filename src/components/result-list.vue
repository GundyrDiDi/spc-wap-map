<template>
  <div class="result-list flex-column">
    <div v-for="(v,i) in resultList" :key="i" class="result-item flex" @click="selectItem(v)">
      <aside class="flex-center">
        <i class="el-icon-location-outline"></i>
      </aside>
      <div :class="i<resultList.length-1&&'hordivider'">
        <div>{{v.name}}</div>
      </div>
    </div>
    <div v-show="resultList.length" class="more hordivider all" @click="moresearch">
      更多搜索数据
    </div>
  </div>
</template>

<script>
export default {
  name: 'result-lsit',
  mounted () {

  },
  methods: {
    selectItem (v) {
      this._setStorage(v)
      this.map_loadLocation(v)
    },
    moresearch () {
      this._moresearch(this.searchWord)
    }
  }
}
</script>

<style scoped>
  .result-list{
    background:#fff;
    box-shadow:0 1px 3px rgba(0,0,0,.15);
    margin:0 .3rem;
    border-radius:5px;
    font-size:var(--normalsize);
  }
  .result-item{
    height:3rem;
    line-height:3rem;
  }
  .result-item>aside{
    height:100%;
    width:3rem;
  }
  .result-item>div{
    flex:1
  }
  .more{
    line-height:2.5rem;
    font-size:var(--smallsize);
    text-align: center;
    color:var(--color);
  }
</style>
