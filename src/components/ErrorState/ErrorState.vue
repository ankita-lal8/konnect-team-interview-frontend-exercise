<template>
  <div class="error-state">
    <img
      alt="error"
      :src="errorType.icon"
    >
    <h2>{{ errorType.primaryText }}</h2>
    <p>{{ errorType.description }}</p>
    <button
      v-if="errorType.showCTA"
      class="primary-cta"
      @click="goToHome"
    >
      {{ errorType.ctaText }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ERROR } from '@/constants'

const emit = defineEmits(['navigate_home'])

const props = defineProps<{
  errorType: 'generic' | 'empty';
}>()

const errorType = computed(() => {
  return ERROR[props.errorType] || ERROR.generic
})

function goToHome() {
  emit('navigate_home')
}
</script>
<style lang="scss" scoped>
.error-state {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .primary-cta {
    margin: 1rem;
    font-weight: 500;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 12px 30px;
    background-color: var(--primary-cta);
    color: var(--white);
    &:hover {
      background-color: #086152;
    }
  }
}
</style>
