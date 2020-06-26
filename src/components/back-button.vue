<template>
  <div class="backbutton" :style="{paddingTop:truestateBar+'px'}">
    <div class="flex-ter">
      <div @click="_goback">
        <i class="el-icon-arrow-left"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'back-button'
  }

</script>

<style scoped>
  .backbutton{
    z-index:1;
    position: absolute;
    top: 0;
    width: inherit;
    padding: 0 .5rem;
    font-size:var(--bigsize);
    box-shadow:0 1px 2px rgba(0,0,0,.2);
    background:#fff;
  }
  .backbutton>div{
    padding:6px 0;
  }
  .flex-ter>div:not(:nth-child(2)){
    flex-basis: 50px;
  }
  .flex-ter>div:nth-child(2){
    flex:1;
    text-align:center;
  }
  .flex-ter>div:nth-child(3){
    color:var(--color);
    font-size:var(--smallsize);
    text-align:center;
    padding:6px;
    border-radius:3px;
  }
</style>
