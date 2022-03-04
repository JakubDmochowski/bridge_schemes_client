<template>
  <div class="preview-wrapper">
    <div>Odzywka: {{ bid }}</div>
    <div>
      Odpowiedzi:
      <element-answer
        v-for="element in next_steps"
        v-bind="element"
        :key="element.id"
        :class="{
          highlight: navigationIds.includes(element.id) || false,
        }"
        @select="$emit('select', element)"
      />
    </div>
  </div>
</template>

<script>
import ElementAnswer from "./ElementAnswer";

export default {
  components: {
    ElementAnswer,
  },
  props: {
    bid: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    next_steps: {
      type: Array,
      default: () => [],
    },
    navigation: {
      type: Array,
      required: true,
    },
  },
  computed: {
    navigationIds() {
      return this.navigation.map((e) => e.id);
    },
  },
};
</script>

<style scoped>
.preview-wrapper {
}
</style>
