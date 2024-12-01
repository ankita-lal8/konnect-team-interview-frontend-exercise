<template>
  <div :class="['service-card']" data-testid="service-card">
    <section class="service-card--header">
      <span class="status">
        <img :src="loadImageSrc(service.id)" />
        <p v-if="!isConfigured">In Progress</p>
        <p v-else>
          {{ isPublished ? "Published" : "Not Published" }}
        </p>
      </span>
      <p
        :class="[
          'version',
          'sidebar-trigger',
          service.versions.length ? 'cursor-pointer ' : 'no-pointer',
        ]"
        data-testid="versions-count"
        @click="viewVersions(service)"
      >
        {{ versionCount }}
      </p>
    </section>
    <section class="service-card--main-content">
      <span class="service-info">
        <p class="service-name" data-testid="service-name">
          {{ service.name }}
        </p>
        <p class="service-desc">
          {{ service.description }}
        </p>
      </span>
    </section>
    <section class="service-card--footer">
      <ul class="service-metrics" data-testid="service-metrics">
        <li>{{ latency }} <span class="metrics-type">latency</span></li>
        <li>{{ upTime }} <span class="metrics-type">uptime</span></li>
        <li>
          {{ requests }} <span class="metrics-type">requests</span>
          <span class="dot">&#8226;</span>
          {{ errors }} <span class="metrics-type">errors</span>
        </li>
      </ul>
      <aside
        v-if="developers.length"
        class="avatar-stack"
        @mouseleave="() => (isPopoverVisible = false)"
        @mouseover="() => (isPopoverVisible = true)"
      >
        <span
          v-for="developer in developers.slice(0, 2)"
          :key="developer.id"
          class="avatar"
        >
          <img
            v-if="developer.avatar && !isProfileImageBroken"
            :src="developer.avatar"
            @error="handleBrokenImage"
          />
          <img v-else src="@/assets/avatar.svg" />
        </span>
        <span v-if="developers.length > 2" class="avatar count">
          +{{ developers.length - 2 }}
        </span>
        <DeveloperPopover v-if="isPopoverVisible" :list="developers" />
      </aside>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import DeveloperPopover from "@/components/DeveloperPopover/DeveloperPopover.vue";
import { useRouter } from "vue-router";
import { type DEVELOPER, type SERVICE } from "@/types";
const props = defineProps<{
  service: SERVICE;
}>();

// type EVENTS = {
//   view_service_versions: [SERVICE];
// };

const emit = defineEmits(["view_service_versions"]);
const $router = useRouter();

const isProfileImageBroken = ref<boolean>(false);
const isPopoverVisible = ref<boolean>(false);
const activeCardId = ref<string>("");

const versionCount = computed<string>(() => {
  const suffix = props.service.versions.length > 1 ? "versions" : "version";
  return `${props.service.versions.length} ${suffix}`;
});

const isConfigured = computed<boolean>(() => {
  return props.service.configured;
});

const isPublished = computed<boolean>(() => {
  return props.service.published;
});

const developers = computed<DEVELOPER[]>(() => {
  const developerData: any = [];
  if (props.service?.versions?.length) {
    props.service.versions.forEach((version: any) => {
      if (version.developer) {
        developerData.push(version.developer);
      }
    });
  }
  return developerData;
});

const latency = computed<string>(() => {
  return `${props.service.metrics?.latency || 0}ms `;
});

const upTime = computed<string>(() => {
  if (props.service?.metrics?.uptime) {
    return `${(props.service.metrics.uptime * 100).toFixed(2)}% `;
  }
  return "0 ";
});

const requests = computed<string>(() => {
  if (props.service?.metrics?.requests) {
    return `${Math.floor(props.service.metrics.requests / 1000)}k `;
  }
  return "0";
});
const errors = computed<string>(() => {
  if (props.service?.metrics?.errors) {
    return `${(props.service.metrics.errors * 100).toFixed(2)}% `;
  }
  return "0";
});

function handleBrokenImage() {
  isProfileImageBroken.value = true;
}

function loadImageSrc(serviceId: string): string {
  const imgSrc: any = {};
  imgSrc[serviceId] = "/src/assets/in-progress.svg";
  if (props.service.configured) {
    props.service.published
      ? (imgSrc[serviceId] = "/src/assets/success-tick.svg")
      : (imgSrc[serviceId] = "/src/assets/failure.svg");
  }
  return imgSrc[serviceId];
}

function viewVersions(service: SERVICE): void {
  if (props.service.versions.length === 0) return;
  activeCardId.value = "";
  activeCardId.value = service.id;
  $router.push({ name: "home", query: { id: service.id } });
  emit("view_service_versions", service);
}

onMounted(() => {
  const container = document.querySelector(
    ".service-hub-wrapper"
  ) as HTMLElement;
  const items: HTMLElement[] | null = container
    ? (Array.from(
        container?.querySelectorAll(".service-card")
      ) as HTMLElement[])
    : null;
  const containerWidth: number = container?.offsetWidth;
  if (items?.length) {
    const itemWidth: number = items[0].offsetWidth;
    const itemsPerRow: number = Math.floor(containerWidth / itemWidth);
    const lastRowItems = Array.from(items).slice(-itemsPerRow);
    lastRowItems.forEach((item) => item.classList.add("last-row"));
  }
});
</script>
<style lang="scss" scoped>
.service-card {
  border-radius: 0.5rem;
  // margin: 0.5rem;
  padding: 1rem;
  flex: 1 0 28.33%;
  background-color: var(--white);
  position: relative;
  // max-height: 20vh;
  max-width: 31vw;

  &.last-row {
    .popover {
      top: auto;
      bottom: 0;
    }
  }
  &.active {
    background-color: var(--card-bg-color);
    border: 1px solid var(--card-border-color);
  }
  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    .status {
      color: #3c4557;
      font-size: 0.85rem;
      font-weight: 400;
      display: flex;
      align-items: center;
    }
    .version {
      color: #5888db;
      font-size: 1rem;
      font-weight: 600;
      background-color: var(--card-bg-color);
      padding: 8px 16px;
      border-radius: 100px;
      &:hover {
        background-color: var(--tag-hover-color);
      }
    }
  }
  &--main-content {
    // margin-bottom: 1rem;
    .service-name {
      font-size: 1.42rem;
      font-weight: 600;
      line-height: 1.75rem;
      text-align: left;
      color: var(--title-color);
    }
    .service-desc {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.42rem;
      text-align: left;
      color: var(--sub-title-color);
    }
  }
  &--footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: relative;
    .avatar-stack {
      justify-items: center;
      display: flex;
      justify-content: center;
      flex-direction: row-reverse;
      cursor: pointer;
      position: relative;
    }
    .service-metrics {
      font-size: 0.85rem;
      font-weight: 600;
      line-height: 1.14rem;
      text-align: left;
      color: var(--title-color);
      .metrics-type {
        opacity: 0.75;
      }
      .dot {
        opacity: 0.75;
        font-size: 0.75rem;
        margin: 0 8px;
        vertical-align: middle;
      }
    }

    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      margin-right: -1rem;
      position: relative;
      img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
      }
      &.count {
        background-color: var(--badge-bg-color);
        color: var(--badge-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    li::marker {
      color: var(--list-style-color);
    }
  }
}
</style>
