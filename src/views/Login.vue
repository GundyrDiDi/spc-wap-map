<template>
  <div id="login">
    login
    <span @click="login_commit({value:'fwc',key:'username'})">{{username}}</span>
    <span @click="_commit({exp:'login.username',value:'cyd'})">{{username}}</span>
    <input type="text" v-commit:login="username"/>
    <input type="text" v-commit="self"/>{{self}}
  </div>
</template>

<script>
export default {
  name: 'login',
  mounted () {
    console.log(api.getdata)
    console.log(axios)
    console.log(Element)
  }
}

</script>

<style>

</style>
