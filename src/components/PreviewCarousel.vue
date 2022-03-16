<template>
  <div class="carousel-wrapper" ref="carousel">
    <div
      class="card"
      ref="card"
      :class="{ active: element.id === preview.id }"
      v-for="(element, index) in modelValue"
      :key="`preview-el-${element.id}`"
      @click="$emit('preview', element)"
    >
      <element-preview
        v-bind="element"
        :navigation="modelValue"
        :preview="preview"
        @update:navigation="$emit('update:modelValue', $event)"
        @update:preview="$emit('update:preview', $event)"
        @select="$emit('select', $event, index)"
        @refresh="$emit('refresh', element)"
      />
    </div>
  </div>
</template>

<script>
import ElementPreview from "@/components/ElementPreview";

export default {
  components: {
    ElementPreview,
  },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    preview: {
      type: Object,
      default: null,
    },
  },
  watch: {
    preview: {
      handler(value) {
        this.$nextTick(() => {
          const index = this.modelValue.findIndex((el) => el.id === value.id);
          this.adjustCarouselScroll(index);
        });
      },
      deep: true,
    },
  },
  methods: {
    adjustCarouselScroll(index) {
      const fontSizeInPx = parseFloat(
        window
          .getComputedStyle(document.body, null)
          .getPropertyValue("font-size")
      );
      const cardEl = this.$refs["card"][0];
      const getMargin = (element, field) => {
        return parseInt(window.getComputedStyle(element)[field]);
      };
      const offset = -2 * fontSizeInPx;
      const scrollLeft =
        cardEl.offsetWidth +
        getMargin(cardEl, "marginRight") +
        getMargin(cardEl, "marginLeft");
      this.$refs.carousel.scroll({
        left: scrollLeft * index + offset,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  @apply relative overflow-auto flex flex-row -mx-2;
}
.card {
  @apply w-140 border shadow px-4 py-2 m-2 rounded-lg;
  min-width: calc(100% - 5rem);
  max-width: calc(100% - 5rem);
  &.active {
    @apply shadow-md border-blue-600;
  }
}
@screen md {
  .card {
    min-width: 35rem;
    max-width: 35rem;
  }
}
</style>
