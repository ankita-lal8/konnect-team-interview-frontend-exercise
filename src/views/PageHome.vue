<template>
  <div
    class="page-home"
    data-testid="page-home"
  >
    <section class="page-home--header">
      <span class="page-home--header-text">
        <h1>Service Hub</h1>
        <p class="body-text-2">
          Organize services, manage and track versioning and API service
          documentation. Learn more
        </p>
      </span>
      <div class="page-home--header-actions">
        <input
          v-model="searchInput"
          data-testid="search"
          placeholder="Search"
          type="search"
          @input="() => debouncedSearch()"
          @keyup.enter="triggerSearch"
        >
        <button
          class="add-service"
          data-testid="add-service"
          @click="() => (isOverlayOpen = true)"
        >
          + Service Package
        </button>
      </div>
    </section>
    <div class="service-hub-wrapper">
      <DataLoader v-if="loading" />
      <ErrorState
        v-else-if="!loading && error"
        :error-type="errorType"
        @navigate_home="handleRefresh"
      />
      <template
        v-for="service in paginatedData"
        v-else
        :key="service.id"
      >
        <ServiceCard
          :service="service"
          @view_service_versions="handleVersionsListVisibility"
        />
      </template>
    </div>
    <DataPagination
      v-if="!loading && !error"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-services="dataToBeUsed.length"
      @page-change="handlePageChange"
    />
    <VersionsSidebar
      v-if="sidebarData && sidebarData.versions.length && isSidebarVisible"
      :data="getVersionsData(sidebarData)"
      @close_sidebar="closeSidebar"
    />
    <AddOverlay
      v-if="isOverlayOpen"
      data-testid="add-service-overlay"
      @close_add_overlay="() => (isOverlayOpen = false)"
    />
  </div>
</template>

<script lang="ts" setup>
import ServiceCard from '@/components/ServiceCard/ServiceCard.vue'
import DataPagination from '@/components/DataPagination/DataPagination.vue'
import VersionsSidebar from '@/components/VersionsSidebar/VersionsSidebar.vue'
import AddOverlay from '@/components/AddOverlay/AddOverlay.vue'
import DataLoader from '@/components/DataLoader.vue'
import ErrorState from '@/components/ErrorState/ErrorState.vue'
import useServices from '@/composables/useServices'
import { debounce } from '@/composables/utils'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { SERVICE } from '@/types'

const {
  services,
  loading,
  error,
  errorType,
  getFilteredServices,
  refreshServices,
} = useServices()
const $route = useRoute()
const currentPage = ref<number>(1)
const searchInput = ref<string>('')
const filteredData = ref<SERVICE[]>([])
const sidebarData = ref<SERVICE | null>(null)
const isSidebarVisible = ref<boolean>(false)
const isOverlayOpen = ref<boolean>(false)
const pageSize: number = 9

const dataToBeUsed = computed(() => {
  return searchInput.value.length ? filteredData.value : services.value
})
const paginatedData = computed<SERVICE[]>(() => {
  const start = (currentPage.value - 1) * 9
  const end = start + 9
  return dataToBeUsed.value.slice(start, end)
})

watch([() => $route.query?.id, () => services.value], () => {
  if ($route?.query?.id && services.value) {
    const service = services.value.find(
      (service: any) => service.id === $route.query.id,
    )
    if (service) {
      handleVersionsListVisibility(service)
      getPageNumber(service)
    }
  }
})

function handleRefresh(): void {
  currentPage.value = 1
  searchInput.value = ''
  refreshServices()
    .then(() => {
      error.value = false
    })
    .catch((err: Error) => {
      console.log(err)
    })
}

function handlePageChange(page: number): void {
  currentPage.value = page
}

function triggerSearch(): void {
  if (searchInput.value.length >= 2) {
    error.value = false
    currentPage.value = 1
    getFilteredServices(searchInput.value)
      .then((data: any) => {
        filteredData.value = data
      })
      .catch((err: Error) => {
        console.log(err)
      })
  }
}
function getVersionsData(service: any) {
  if (service.versions?.length) {
    const versionsData: any = {
      serviceName: service.name,
      versions: service.versions,
      type: service.type,
    }
    return versionsData
  }
}

function closeSidebar(): void {
  isSidebarVisible.value = false
  sidebarData.value = null
}

function handleVersionsListVisibility(data: SERVICE): void {
  sidebarData.value = data
  isSidebarVisible.value = true
}

function getPageNumber(serviceToFind: SERVICE): void {
  const index = services.value.findIndex(
    (service: any) => service.id === serviceToFind.id,
  )
  currentPage.value = searchInput.value.length ? 1 : Math.ceil((index + 1) / 9)
}

const debouncedSearch = debounce(triggerSearch, 500)
</script>
<style lang="scss" scoped>
.page-home {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--global-header-height));
  &--header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem;
    h1 {
      margin: 1rem 0;
    }
    .add-service {
      background-color: var(--primary-cta);
      color: var(--white);
      padding: 0.5rem 1rem;
      cursor: pointer;
      max-width: 14vw;
      min-height: 44px;
      border-radius: 100px;
      margin: 10px;
      font-size: 1.2rem;
      font-weight: 600;
      line-height: 20px;
      text-align: center;
      font-family: "Inter";
      &:hover {
        background-color: var(--primary-cta-hover);
      }
    }
    &-actions {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  .service-hub-wrapper {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    overflow: auto;
    margin: 0 1rem;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
@/types
