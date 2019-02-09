<template>
  <div class="tiempo">
    <AppTiempo></AppTiempo>
    <br>
    <footer><pie></pie></footer>
  </div>
</template>

<script>
// @ is an alias to /src
import AppTiempo from '@/components/AppTiempo.vue'
import pie from '@/components/Footer.vue'

export default {
  name: 'tiempo',
  components: {
    AppTiempo,
    pie
  }
}
</script>

