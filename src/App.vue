<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0!important;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
