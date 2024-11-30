<template>
  <header>
    <div class="nav">
      <GlobalHeader />
    </div>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalHeader from '@/components/GlobalHeader/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
  },
})
</script>

<style lang="scss" scoped></style>
