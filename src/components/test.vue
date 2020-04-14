<template>
<div style="width:200px;position:relative">
  <div>test</div>
  <slot></slot>
</div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {}
  },
  mounted () {
    console.log(this.$slots)
  }
}
</script>

<style scoped>
  .a{
    font-size:80px;
    animation: a 4s linear;
    overflow:hidden;
    color:var(--color);
    position: absolute;
    top:0;
    left:0;
    /* background:red; */
  }
  .aa{
    animation:aa 4s linear;
    transform:translateX(-5px) translateY(-3px);
  }
  @keyframes a {
    from{
      width:0;
      left:100%;
    }
    to{
      width:100%;
      left:0;
    }
  }
  @keyframes aa {
    from{
      transform:translateX(-205px) translateY(-3px)
    }
    to{
      transform:translateX(-5px) translateY(-3px)
    }
  }
</style>
