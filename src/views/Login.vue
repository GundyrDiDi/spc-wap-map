<template>
  <div id="login">
    <span @click="_commit({chain:'login.username',value:'fwc'})">{{username}}</span>
    <span @click="_commit({chain:'login.username',value:'cyd'})">{{username}}</span>
    <input type="text" v-commit.lazy="login.username"/>
    <input type="text" v-commit.number="self"/>{{self}}
    <input type="checkbox" v-commit="istrue"/>
    <span @click="_commit({chain:'istrue',value:!istrue})">{{istrue}}</span>
  </div>
</template>

<script>
export default {
  name: 'login',
  mounted () {
    console.log(api.getdata)
    console.log(axios)
    console.log(Element)
    console.log(this.map)
  }
}

</script>

<style>

</style>
