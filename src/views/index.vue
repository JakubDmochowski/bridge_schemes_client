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
      @update:preview="preview = $event"
      @preview="handleElementPreview"
      @select="handleElementSelected"
      @add-new="handleElementAddNew"
      @refresh="handleElementRefresh"
    />
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";
import PreviewCarousel from "@/components/PreviewCarousel";
import axios from "@/utilities/axios";

export default {
  name: "App",
  components: {
    NavigationBar,
    PreviewCarousel,
  },
  data: () => ({
    navigation: [],
    preview: null,
  }),
  created() {
    this.$watch(
      () => this.$route.query,
      (toParams) => {
        this.$store.state.adminPrivilege =
          (toParams && toParams.adminPrivilege === "true") || false;
        this.$store.state.showIds =
          (toParams && toParams.showIds === "true") || false;
      }
    );
  },
  async mounted() {
    const { data: origin } = await axios.get(
      `${this.$store.state.scheme}\\origin`
    );
    this.navigation.push(origin);
    this.preview = origin;
  },
  methods: {
    handleElementPreview(selected) {
      this.preview = selected;
    },
    async handleElementSelected(selected, index) {
      const { data: element } = await axios.get(
        `${this.$store.state.scheme}\\${selected.id}`
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
    async handleElementRefresh(element) {
      const { data: newEl } = await axios.get(
        `${this.$store.state.scheme}\\${element.id}`
      );
      const oldElIndex = this.navigation.findIndex(
        (el) => el.id === element.id
      );
      this.navigation = [
        ...(oldElIndex > -1
          ? this.navigation.slice(0, oldElIndex)
          : this.navigation),
        newEl,
        ...(oldElIndex > -1 ? this.navigation.slice(oldElIndex + 1) : []),
      ];
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
