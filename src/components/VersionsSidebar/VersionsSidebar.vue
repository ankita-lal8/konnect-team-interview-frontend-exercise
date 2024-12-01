<template>
  <div
    ref="sideBarHTMLRef"
    class="sidebar"
  >
    <section
      v-if="sidebarData && sidebarData.serviceName"
      class="sidebar--header"
    >
      <h3>{{ sidebarData.serviceName }}</h3>
      <span
        class="close"
        @click="() => emit('close_sidebar')"
      >&#x2715;</span>
    </section>
    <table>
      <thead>
        <tr>
          <th data-row="version">
            Version
          </th>
          <th data-row="description">
            Description
          </th>
          <th data-row="type">
            Type
          </th>
          <th data-row="developer">
            Developer
          </th>
        </tr>
      </thead>
      <tbody v-if="sidebarData && sidebarData.versions">
        <tr
          v-for="version in sidebarData.versions"
          :key="version.id"
        >
          <td data-column="name">
            v{{ version.name }}
          </td>
          <td data-column="description">
            {{ version.description }}
          </td>
          <td data-column="type">
            <p
              :class="['tag', sidebarData.type == 'HTML' as string ? 'active' : '']"
            >
              HTML
            </p>
            <p :class="['tag', sidebarData.type == 'REST' ? 'active' : '']">
              REST
            </p>
          </td>
          <td data-column="developer">
            <DeveloperDetail
              :developer="version.developer"
              :time="version.updated_at"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import DeveloperDetail from '@/components/DeveloperDetail/DeveloperDetail.vue'
import type { SIDEBAR_VERSIONS_DATA } from '@/types'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{
  data: SIDEBAR_VERSIONS_DATA | null;
}>()

// type EVENTS = {
//   close_sidebar: [void];
// };

const sidebarData = computed(() => {
  return props.data
})

const emit = defineEmits(['close_sidebar'])
const sideBarHTMLRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (
    sideBarHTMLRef.value &&
    !sideBarHTMLRef.value.contains(e.target as HTMLElement) &&
    !(e.target as HTMLElement | null)?.classList?.contains('sidebar-trigger')
  ) {
    emit('close_sidebar')
  }
}
function handleEscapeKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close_sidebar')
  }
}

onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
  }, 10)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style lang="scss" scoped>
.sidebar {
  position: absolute;
  z-index: 100;
  right: 0;
  height: calc(100vh - 49px);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  width: 54vw;
  background-color: #ffffff;
  overflow: auto;
  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f8fa;
    padding: 1rem;
    .close {
      cursor: pointer;
      color: #8a8a8a;
      font-size: 20px;
    }
  }
  table {
    padding: 2rem;
    width: 100%;
    thead {
      background-color: #f8f8fa;
      height: 53px;
      th {
        padding: 1rem;
      }
    }
    tbody tr {
      td {
        // padding: 1rem;
        border-bottom: 1px solid #f2f2f2;
        font-family: Inter;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-align: left;
        color: #262626;
        height: 40px;

        &[data-column="name"] {
          font-weight: 600;
          text-align: center;
          width: 10%;
        }
        &[data-column="description"] {
          color: #8a8a8a;
          width: 50%;
        }
        &[data-column="type"] {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          text-align: center;
          padding: 10px 0;
        }
      }
      .tag {
        width: 40px;
        height: 20px;
        padding: 6px 4px 2px;
        border-radius: 4px;
        background-color: #f8f8fa;
        text-align: center;
        color: #1155cb;
        font-family: Inter;
        font-size: 10px;
        font-weight: 500;
        line-height: 14px;
        &.active {
          background-color: #bdd3f9;
        }
      }
    }
  }
}
</style>
