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
        @edit="handleElementEdit(element)"
        @delete="handleElementDelete(element)"
      />
    </div>
    <button
      class="add-button"
      type="button"
      @click="showModal = !showModal"
      v-if="$store.state.adminPrivilege"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"
        />
      </svg>
      dodaj nową pozycję
    </button>
    <b-modal
      v-if="$store.state.adminPrivilege"
      :show="showModal"
      @cancel="handleModalCancel"
    >
      <form @submit.prevent="handleBidSubmit">
        <div class="mb-2">
          <span> W odpowiedzi na: {{ bid }} </span>
        </div>
        <div class="mb-2" v-if="modalData.id !== null">
          <b-input
            v-model="modalData.id"
            label="Id Odzywki (opcjonalne)"
            disabled
            placeholder="origin"
          />
        </div>
        <div class="mb-2">
          <b-input
            label="Odzywka"
            v-model="modalData.bid"
            placeholder="1♣: 11+ pkt, 4+♣"
          />
        </div>
        <div class="mb-2">
          <b-input
            label="Treść"
            v-model="modalData.message"
            placeholder="1♣: 11+ pkt, 4+♣"
          />
        </div>
        <div class="mt-4 flex justify-end">
          <button class="w-32 button success" type="submit">Potwierdź</button>
          <button class="w-32 button danger ml-4" @click="handleModalCancel">
            Anuluj
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import ElementAnswer from "@/components/ElementAnswer";
import BModal from "@/components/BModal";
import BInput from "@/components/BInput";
import axios from "@/utilities/axios";
import { ref } from "vue";
import { v4 as uuid } from "uuid";

export default {
  components: {
    ElementAnswer,
    BModal,
    BInput,
  },
  setup() {
    const showModal = ref(false);
    return {
      showModal,
    };
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
  data: () => ({
    modalData: {
      id: null,
      message: "",
      bid: "",
      editId: null,
    },
  }),
  computed: {
    navigationIds() {
      return this.navigation.map((e) => e.id);
    },
  },
  methods: {
    handleModalCancel() {
      this.showModal = false;
      this.modalData.editId = null;
      this.modalData.bid = "";
      this.modalData.message = "";
      this.modalData.id = null;
    },
    async handleBidSubmit() {
      const editIndex = this.modalData.editId
        ? this.next_steps.findIndex((el) => el.id === this.modalData.editId)
        : null;
      const newBid = {
        id: this.modalData.id || uuid(),
        bid: this.modalData.bid,
        message: this.modalData.message,
      };
      const bid = {
        id: this.id,
        bid: this.bid,
        next_steps: [
          ...(editIndex !== null
            ? this.next_steps.slice(0, editIndex)
            : this.next_steps),
          newBid,
          ...(editIndex !== null ? this.next_steps.slice(editIndex + 1) : []),
        ],
      };
      if (editIndex === null) {
        await axios.put(`${this.$store.state.scheme}\\${this.id}`, newBid);
      }
      await axios.patch(`${this.$store.state.scheme}\\${this.id}`, bid);
      this.$emit("refresh");
      this.handleModalCancel();
    },
    handleElementEdit(element) {
      this.modalData.editId = element.id;
      this.modalData.message = element.message;
      this.modalData.bid = element.bid;
      this.modalData.id = element.id;
      this.showModal = true;
    },
    async handleElementDelete(element) {
      const prevIndex = this.navigation.findIndex((e) => e.id === element.id);
      if (prevIndex !== -1) {
        this.$emit("update:navigation", this.navigation.slice(0, prevIndex));
        this.$emit("update:preview", this.navigation[prevIndex - 1]);
      }
      await axios.delete(`${this.$store.state.scheme}\\${element.id}`);
      this.$emit("refresh");
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-wrapper {
}
.add-button {
  &:hover {
    @apply text-blue-600;
  }
  & > svg {
    @apply w-4 h-4 ml-2 inline-block fill-current;
  }
}
</style>
