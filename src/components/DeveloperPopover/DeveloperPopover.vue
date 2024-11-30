<template>
  <div
    class="popover"
    data-v-inspector="src/components/Popover/index.vue:2:3"
  >
    <ul data-v-inspector="src/components/Popover/index.vue:3:5">
      <li
        v-for="developer in list"
        :key="developer.id"
        data-v-inspector="src/components/Popover/index.vue:4:7"
      >
        <DeveloperDetail
          data-v-inspector="src/components/Popover/index.vue:8:9"
          :developer="developer"
        />
        <img
          class="copy"
          data-v-inspector="src/components/Popover/index.vue:9:9"
          src="@/assets/copy.svg"
          @click="copyEmail(developer.email)"
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import DeveloperDetail from '@/components/DeveloperDetail/index.vue'

const { list } = defineProps<{
  list: any;
}>()

function copyEmail(email: string) {
  navigator.clipboard
    .writeText(email)
    .then(() => {})
    .catch(() => {})
}
</script>
<style lang="scss" scoped>
.popover {
  width: 300px;
  max-height: 150px;
  overflow: auto;
  right: 60%;
  top: 100%;
  position: absolute;
  z-index: 100;
  background-color: var(--white);
  box-shadow: 0 0 4px var(--overlay-bg-color); //   &::before {
  li {
    list-style-type: none;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    gap: 10px;
    margin: 10px;
    .developer-details {
      flex: 1;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .copy {
      justify-self: flex-end;
      cursor: pointer;
    }
  }
}
</style>
