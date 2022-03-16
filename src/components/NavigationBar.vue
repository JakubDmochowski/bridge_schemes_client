<template>
  <div class="nav-wrapper">
    <div class="py-2 pl-2 md:py-3 md:pl-4">
      <button
        :class="{ disabled: modelValue.length <= 1 }"
        class="warning-button reset"
        @click="$emit('reset')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"
          />
        </svg>
      </button>
    </div>
    <div class="nav-elements-wrapper">
      <div
        class="flex items-center h-full overflow-auto px-4"
        ref="nav-carousel"
      >
        <template
          v-for="(element, index) in modelValue"
          :key="`nav-el-${element.id}`"
        >
          <span v-if="index !== 0" class="separator" ref="nav-separator">
            {{ separator }}</span
          >
          <span
            class="nav-el selectable"
            ref="nav-el"
            :class="{ active: preview.id === element.id }"
            @click="$emit('preview', element)"
            >{{ element.bid }}</span
          >
        </template>
      </div>
    </div>
    <div class="py-2 pr-2 md:py-3 md:pr-4">
      <button
        class="warning-button delete"
        :class="{ disabled: modelValue.length <= 1 }"
        @click="$emit('delete')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path
            d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    separator: {
      type: String,
      default: ">",
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
      const el = this.$refs["nav-el"][0];
      const sep = this.$refs["nav-separator"]?.[0];
      const getMargin = (element, field) => {
        return parseInt(window.getComputedStyle(element)[field]);
      };
      const offset = -2 * fontSizeInPx;
      const elementWidth =
        el.offsetWidth +
        getMargin(el, "marginRight") +
        getMargin(el, "marginLeft");
      const separatorWidth = sep
        ? sep.offsetWidth +
          getMargin(sep, "marginRight") +
          getMargin(sep, "marginLeft")
        : 0;
      this.$refs["nav-carousel"].scroll({
        left: elementWidth * index + separatorWidth * (index - 1) + offset,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  @apply flex items-stretch justify-center shadow;
}
.separator {
  @apply mx-2;
}
.nav-elements-wrapper {
  @apply flex grow overflow-hidden justify-center items-center;
}
.nav-el {
  @apply py-1 px-3 rounded-lg border border-gray-300;
  &:hover {
    @apply shadow;
  }
  &.active {
    @apply text-blue-600 border-blue-600 shadow-blue-400;
  }
}
@screen md {
  .nav-el {
    @apply py-2 px-4;
  }
}
.warning-button {
  @apply shadow px-3 py-2 mx-2 border border-red-600 text-red-600 rounded-lg shrink-0 cursor-pointer;
  fill: currentColor;
  & > svg {
    @apply h-4;
  }
  &:hover {
    @apply shadow-red-400;
  }
  &.disabled {
    @apply text-slate-300 border-slate-300 cursor-default;
    &:hover {
      @apply shadow-current;
    }
  }
}
@screen md {
  .warning-button {
    @apply px-4 py-2 mx-4;
  }
}
@screen lg {
  .warning-button {
    @apply mx-6;
  }
}
</style>
