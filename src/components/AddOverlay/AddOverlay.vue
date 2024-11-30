<template>
  <div class="overlay">
    <div class="overlay--modal">
      <div class="overlay--modal-header">
        <h2>Add Service Package</h2>
        <span
          class="close-button cursor-pointer"
          @click="emit('close_add_overlay')"
        >X</span>
      </div>
      <p>What kind of item would you like to add?</p>
      <div class="button-group">
        <button
          class="cancel-button cursor-pointer"
          type="button"
          @click="emit('close_add_overlay')"
        >
          Cancel
        </button>
        <button
          class="add-button cursor-pointer"
          type="submit"
          @click="emit('close_add_overlay')"
        >
          Add item
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close_add_overlay'])
</script>
<style lang="scss" scoped>
.overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: var(--overlay-bg-color);
  &--modal {
    background-color: var(--white);
    border-radius: 20px;
    max-width: 490px;
    width: 100%;
    padding: 50px;
    box-shadow: 0px 10px 12px var(--modal-shadow-color);
    position: relative;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    &-header h2 {
      font-size: 2rem;
      font-weight: 700;
    }
    .close-button {
      position: relative;
      top: 0;
      font-size: 24px;
      cursor: pointer;
    }
    .button-group {
      display: flex;
      justify-content: space-around;
      margin: 30px;
    }

    .cancel-button,
    .add-button {
      font-weight: 500;
      font-size: 1rem;
      background: none;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      padding: 12px 30px;
    }

    .cancel-button {
      color: var(--secondary-cta-color);
    }

    .add-button {
      background-color: var(--primary-cta);
      color: var(--white);
    }

    /* Button Hover Styles */
    .cancel-button:hover {
      color: var(--white);
      background-color: var(--secondary-cta-hover-color);
    }

    .add-button:hover {
      background-color: var(--primary-cta-hover);
    }
  }
}
</style>
