<script setup>
import { socket, state } from "@/socket";
import { io } from "socket.io-client";
import { onMounted, computed } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

let path = route.fullPath;

path = path.split("/");
const message = ref("");
const mesagesArray = ref([]);

// let getMessages;
// onMounted(async () => {
//   const getMessages = await fetch(
//     `http://localhost:3000/chat/owner/${route.params.cid}`,
//     {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//     }
//   );
//   let res = await getMessages.json();
//   console.log("responce: ", res);
// });

const messageArray = ref([]);
const responseArray = ref([]);

let res;
onMounted(async () => {
  const getMessages = await fetch(
    `http://localhost:3000/chat/owner/${route.params.cid}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  res = await getMessages.json();

  res.data?.forEach((msg) => {
    messageArray.value.push(msg);
  });

  // responseArray.value = res.data;
  // console.log("res Arr: " ,responseArray.value);
});

let userId = computed(() => {
  return store.getters.getLoggedUser;
});

console.log("UserID: ", userId.value);

const sendMessage = async () => {
  if (message.value.trim() !== "") {
    console.log("PID:", route.params.id);

    const data = await fetch(`http://localhost:3000/chat/owner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        propertyId: route.params.id,
        reciverId: route.params.cid,
        message: message.value,
      }),
    });
    let res = await data.json();
    // console.log("Responses are:: ", res);

    if (res.success) {
      messageArray.value.push(res.data);
      message.value = "";
    }
  }
};

socket.on(`send_message-${userId.value}`, async (msg) => {
  console.log("Message is: ", msg);
  messageArray.value.push(msg);
  window.scrollTo(0, document.body.scrollHeight);
});
</script>

<template>
  <div>
    <h3 class="text-center mb-5">Chat-Component</h3>

    <v-sheet
      class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3 overflow-y-auto"
      width="550"
      height="auto"
    >

      <div class="lists">
        <v-list
          class="rounded-lg border-black"
          lines="one"
          v-for="msg in messageArray"
        >
          <v-list-item
            class="text-left"
            v-if="msg.senderID === userId"
            :key="msg"
            :title="msg.message"
          ></v-list-item>

          <v-list-item
            class="text-right"
            v-if="msg.senderID !== userId"
            :key="msg"
            :title="msg.message"
          ></v-list-item>
        </v-list>
      </div>

      <v-form ref="form" class="pa-5">
        <div class="mesage d-flex">
          <v-text-field
            name="message"
            id="message"
            label="Message"
            v-model="message"
            prepend-icon="mdi-message-text"
          ></v-text-field>

          <v-btn @click="sendMessage" color="success" class="mt-3 ml-5"
            >SEND</v-btn
          >
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped></style>
