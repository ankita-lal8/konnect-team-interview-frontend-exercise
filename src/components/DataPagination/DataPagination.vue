<template>
  <div class="pagination">
    <button
      :class="['pagination--prev', `${itemStartIndex == 1 ? 'disabled' : ''}`]"
      @click="handlePage(activePage - 1)"
    >
      &#8592;
    </button>
    <p class="pagination--info">
      <span class="pagination--current">{{ itemStartIndex }} to {{ itemEndIndex }}</span>
      <span class="pagination--total">of {{ totalServices }} services</span>
    </p>

    <button
      :class="`pagination--next ${
        itemEndIndex == totalServices ? 'disabled' : ''
      }`"
      @click="handlePage(activePage + 1)"
    >
      &#8594;
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const $emit = defineEmits(['pageChange'])
const props = defineProps<{
  totalServices: number;
  currentPage: number;
  pageSize: number;
}>()

const activePage = ref(props.currentPage)

watch(
  () => props.currentPage,
  (newVal) => {
    activePage.value = newVal
  },
)

const itemStartIndex = computed<number>(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const itemEndIndex = computed<number>(() => {
  return Math.min(activePage.value * props.pageSize, props.totalServices)
})

function handlePage(page: number) {
  activePage.value = page
  $emit('pageChange', page)
}
</script>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  max-height: 4.2rem;
  &--prev,
  &--next {
    background-color: transparent;
    border-radius: 50%;
    padding: 0.85rem;
    color: var(--pagination-cta-color);
    border: 1px solid var(--pagination-cta-border-color);
    cursor: pointer;
    &:hover {
      background-color: var(--pagination-cta-hover-color);
    }
    &.disabled {
      opacity: 0.25;
      border: 1px solid var(--black);
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  &--info {
    padding: 24px 12px;
    font-size: 1rem;
    font-weight: 500;
    line-height: 2rem;
    text-align: center;
  }
  &--current {
    color: var(--pagintation-text-color);
  }
  &--total {
    padding-left: 4px;
    color: var(--black);
    opacity: 0.45;
  }
}
</style>
