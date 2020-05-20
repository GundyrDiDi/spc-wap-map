<template>
  <div class="brief">
    <div class="name">
      {{lct.name}}
    </div>
    <div class="sub flex">
      <div>
        <img :src="lct.layer.seticon">
        {{lct.type}}
      </div>
      <div class="verdivider"></div>
      <div>
        所属 {{lct.name}}
      </div>
    </div>
    <div class="descript">
      联系方式: 021-87654321
      <i class="el-icon-phone-outline"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loc-brief',
  data () {
    return {}
  },
  props: ['lct']
}

</script>

<style scoped>
  .brief>.name{
    font-size:var(--hugesize);
    line-height:30px;
  }
  .sub{
    height:30px;
    padding:7px 0;
    font-size:var(--smallsize);
    color:#999;
    font-weight: normal;
    padding-left:30px;
    position: relative;
    margin:5px 0;
  }
  .verdivider{
    margin:0 .6rem;
  }
  .sub img{
    width: 24px;
    height: 24px;
    top: 0;
    left: -3px;
    position: absolute;
  }
  .descript{
    height:35px;
    line-height:30px;
    font-size:var(--normalsize);
  }
  .descript>i{
    font-size:var(--hugesize);
    margin:.2rem;
  }
</style>
