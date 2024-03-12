<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  navigatorIsSubscribed,
  subscribe,
  unsubscribe,
} from "../utils/notifications";

const subscribed = ref<boolean>(false);
const loading = ref<boolean>(false);

onMounted(() => {
  subscribed.value = navigatorIsSubscribed();
});

async function onChange() {
  loading.value = true;
  try {
    if (subscribed.value) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  } catch (e) {
    console.log(e);
    subscribed.value = !subscribed.value;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form :aria-busy="loading">
    <input
      type="checkbox"
      role="switch"
      v-model="subscribed"
      @change="onChange"
    />
  </form>
</template>

<style scoped>
form[aria-busy="true"] {
  pointer-events: none;
  animation: blink 1s infinite;
}

input[role="switch"] {
  display: flex;
  align-items: center;
  appearance: none;
  width: 4rem;
  height: 2.5rem;
  background-color: rgba(155, 155, 155, 0.2);
  border-radius: 999px;
  cursor: pointer;
}

input[role="switch"]::after {
  content: "";
  display: block;
  width: 2rem;
  height: 2rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
  transform: translateX(0.25rem);
}

input[role="switch"]:checked {
  background-color: rgb(98, 232, 53);
}

form[aria-busy="true"] input:not(:checked)::after,
form[aria-busy="false"] input[role="switch"]:checked::after {
  transform: translateX(1.75rem);
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 0.5;
  }
  70% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
