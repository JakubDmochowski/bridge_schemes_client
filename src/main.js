import { createApp } from "vue";
import App from "./views/index.vue";
import "@/assets/global.scss";
import "./assets/tailwind.css";
import store from "./store";
import router from "./router";

createApp(App).use(store).use(router).mount("#app");
