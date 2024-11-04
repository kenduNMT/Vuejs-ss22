<template>
  <div id="app">
    <ListProduct />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ListProduct from './components/ListProduct.vue';

export default defineComponent({
  name: 'App',
  components: {
    ListProduct
  }
});
</script>