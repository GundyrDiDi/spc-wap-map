<template>
  <div id="login">
    <span @click="login_commit({value:'fwc',key:'username'})">{{username}}</span>
    <span @click="_commit({exp:'login.username',value:'cyd'})">{{username}}</span>
    <input type="text" v-commit:login.lazy="username"/>
    <input type="text" v-commit.number="self"/>{{self}}
    <input type="checkbox" v-commit="istrue"/>{{istrue}}
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
