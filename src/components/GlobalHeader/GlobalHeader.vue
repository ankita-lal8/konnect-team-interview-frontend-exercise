<template>
  <div class="header">
    <section class="header--app-name cursor-pointer" @click="navigateToHome">
      <img alt="Kong" class="kong" src="@/assets/kong-logo.svg" />
      <img alt="Konnect" class="konnect" src="@/assets/konnect.svg" />
    </section>
    <section class="header--user-preferences">
      <p>
        <img alt="organization" src="@/assets/account.svg" />
        <span>Organization</span>
      </p>
      <p>
        <img alt="settings" src="@/assets/settings.svg" />
        <span>Settings</span>
      </p>
      <p>
        <img alt="user-profile" src="@/assets/avatar.svg" />
        <span>Ankita Lal</span>
      </p>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const $router = useRouter();
function navigateToHome() {
  $router.push({ name: "home" });
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--black-3);
  background: linear-gradient(
    180deg,
    var(--header-bg-base) 0%,
    var(--header-bg-secondary) 100%
  );
  padding: 1.5rem;
  &--app-name {
    width: 25rem;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    .kong {
      width: 2rem;
      height: 2rem;
    }
    .konnect {
      width: 9rem;
      height: 1.5rem;
    }
  }
  &--user-preferences {
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
    display: flex;
    justify-content: space-between;
    // width: 23rem;
    align-items: center;
    gap: 10px;
    p {
      display: flex;
      align-items: center;
    }
    img {
      width: 1.25rem;
      margin: 0 0.5rem;
    }
  }
}
</style>
