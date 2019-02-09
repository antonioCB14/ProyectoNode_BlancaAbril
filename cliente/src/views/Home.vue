<template>
  <div class="home">
    <nota></nota>
    <br>
    <footer><pie></pie></footer>
  </div>
</template>

<script>
// @ is an alias to /src
import nota from '@/components/Nota.vue'
import pie from '@/components/Footer.vue'

export default {
  name: 'home',
  components: {
    nota,
    pie
  }
}
</script>
