<template>
  <div class="loader" />
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.loader {
  border: 3px solid var(--loader-border-color);
  border-radius: 50%;
  border-top: 3px solid var(--loader-border-spinning-color);
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
