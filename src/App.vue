<template>
  <navigation-bar
    v-model="navigation"
    :preview="preview"
    @preview="handleElementPreview"
    @reset="handleReset"
    @delete="handleDelete"
  />
  <div class="px-2 py-1 md:px-4">
    <preview-carousel
      v-model="navigation"
      :preview="preview"
      @preview="handleElementPreview"
      @select="handleElementSelected"
    />
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar";
import PreviewCarousel from "./components/PreviewCarousel";
import axios from "/utilities/axios";

export default {
  name: "App",
  components: {
    NavigationBar,
    PreviewCarousel,
  },
  data: () => ({
    scheme: "precision",
    navigation: [],
    preview: null,
  }),
  async mounted() {
    const { data: origin } = await axios.get(`${this.scheme}\\origin`);
    this.navigation.push(origin);
    this.preview = origin;
  },
  methods: {
    handleElementPreview(selected) {
      this.preview = selected;
    },
    async handleElementSelected(selected, index) {
      const { data: element } = await axios.get(
        `${this.scheme}\\${selected.id}`
      );
      if (!element) {
        // notify that answer does not exist in the database
        return;
      }
      if (index + 1 === this.navigation.length) {
        this.navigation.push(element);
      } else {
        const newNavigation = [...this.navigation.slice(0, index + 1), element];
        this.navigation = newNavigation;
      }
      this.preview = element;
    },
    handleReset() {
      this.navigation = this.navigation.slice(0, 1);
      this.preview = this.navigation[0];
    },
    handleDelete() {
      if (this.navigation.length <= 1) {
        return;
      }
      if (this.preview.id === this.navigation.slice(-1)[0].id) {
        this.preview = this.navigation.slice(-2)[0];
      }
      this.navigation = this.navigation.slice(0, -1);
    },
  },
};
</script>

<style>
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
body {
  margin: 0;
}
</style>
