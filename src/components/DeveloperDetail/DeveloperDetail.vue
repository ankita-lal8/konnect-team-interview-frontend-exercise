<template>
  <div class="developer-detail">
    <img
      v-if="developer && developer.avatar && !isProfileImageBroken"
      class="developer-detail--avatar"
      :src="developer.avatar"
      @error="handleBrokenImage"
    >
    <img
      v-else
      src="@/assets/avatar.svg"
    >
    <span class="developer-detail--info">
      <p class="body-text-1">
        {{ developer?.name || "-" }}
      </p>
      <p
        v-if="!time"
        class="body-text-2"
      >
        {{ developer?.email || "-" }}
      </p>
      <p
        v-if="time"
        class="body-text-2"
      >
        {{ getTimeDifference(new Date(time)) }}
      </p>
    </span>
  </div>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { getTimeDifference } from '@/composables/utils'
import type { DEVELOPER } from '@/types'

const { developer, time } = defineProps<{
  developer: DEVELOPER | undefined;
  time?: string;
}>()

const isProfileImageBroken = ref(false)

function handleBrokenImage() {
  isProfileImageBroken.value = true
}
</script>
<style lang="scss" scoped>
.developer-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  &--info {
    flex: 1;
  }
  &--avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
}
</style>
