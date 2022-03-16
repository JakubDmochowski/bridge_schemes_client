<template>
  <label :for="id" class="input-label">{{ label }}</label>
  <input
    type="text"
    :value="modelValue"
    :name="id"
    :class="{ disabled: disabled }"
    :id="id"
    class="input"
    :disabled="disabled"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
import { v4 as uuid } from "uuid";

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    id: null,
  }),
  mounted() {
    this.id = uuid();
  },
  methods: {
    log(event) {
      console.log(event.target.value);
    },
  },
};
</script>

<style></style>
