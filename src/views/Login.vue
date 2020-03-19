<template>
  <div id="login">
    login
    <span @click="_commit({value:'cyd',module:'login',key:'username'})">{{username}}</span>
    <span @click="_commit({exp:'login.username',value:'cyd'})">{{username}}</span>
  </div>
</template>

<script>
export default {
  name: 'login',
  mounted () {
    console.log(this.api.getdata)
  }
}
</script>

<style>

</style>
