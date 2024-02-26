<template>
  <main class="h-[calc(100dvh-48px)] flex flex-col">
    <ul class="grow overflow-y-auto" ref="scrollRef">
      <div
        v-for="(bit, i) in bits"
        :key="bit.id"
        class="mb-4 group flex items-center"
      >
        <li class="bg-blue-200 p-2 pl-6 pr-6 rounded-xl w-fit">
          <span>
            {{ bit.text }}
          </span>
          <span class="ml-6 text-[0.7em]">{{ bit.date.slice(-8) }} </span>
        </li>
        <button
          class="ml-6 bg-slate-100 hidden group-hover:block w-8 h-8 rounded-full"
          @click="deleteField(bit.id)"
        >
          x
        </button>
      </div>
    </ul>

    <form @submit.prevent="send">
      <div
        class="shadowclip p-1 flex flex-wrap items-start gap-3 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] clip"
      >
        <input
          class="rounded-sm px-2 py-1 w-full max-w-[600px]"
          name="msg"
          v-model="msg"
        />
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

type Bit = {
  id: string;
  text: string;
  date: string;
};

const props = defineProps({
  bits: {
    type: Array<Bit>,
    required: true,
  },
});

const msg = ref("");
const bits = ref(props.bits);
const scrollRef = ref(null);

const deleteField = async (id: string) => {
  console.log(" DEL ", id);
};

const createReq = (text) =>
  fetch("/api/bits/new", {
    method: "POST",
    body: text,
  }).then(async (res) => {
    if (res.ok) return { data: await res.json() };
    return { error: await res.text() };
  });

const send = async (ev) => {
  const resp = await createReq(msg.value);

  if (resp.error) {
    return;
  }

  bits.value = [...bits.value, resp.data];
  msg.value = "";
  await nextTick();
  scrollDown(scrollRef.value);
};

const scrollDown = (el) => (el.scrollTop = el.scrollHeight);

onMounted(() => {
  scrollDown(scrollRef.value);
});
</script>
