<template>
  <div class="answer selectable" @click="$emit('select')">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.answer {
  @apply mx-2;
  &.selectable:hover {
    @apply text-blue-600;
  }
  &.highlight {
    @apply text-blue-600 underline;
  }
}
</style>
