<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let response = ref([]);

onMounted(async () => {
  const data = await fetch(`http://localhost:3000/review`, {
    method: "GET",
    credentials: "include",
  });

  let res = await data.json();

  response.value = res.data;
  console.log("Response: ", response.value);
});

const sendMessage = (pid, oid) => {
  // alert(id)
  router.push(String(`/chat/owner/${pid}/${oid}`));
  // alert(`/chat/owner/${pid}/${oid}`)
};
</script>

<template>
  <div>
    <h3 class="text-center mb-5">View Estimate Page</h3>

    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">PropertyID</th>
          <th class="text-left">ProertyName</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Time</th>
          <th class="text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in response" :key="data.id">
          <td>{{ data.property_id }}</td>
          <td>{{ data.property_name }}</td>
          <td>{{ data.amount }}</td>
          <td>{{ data.time }}</td>
          <td>
            <v-btn
              color="success"
              disabled="true"
              v-if="data.status == 'Accepted'"
            >
              {{ data.status }}
              <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
            </v-btn>

            <v-btn color="red" disabled="true" v-if="data.status == 'Rejected'">
              {{ data.status }}
              <v-icon icon="mdi-cancel" end></v-icon>
            </v-btn>

            <v-btn disabled="true" color="primary" v-if="data.status == null">
              Pending
              <v-icon icon="mdi-cancel" end></v-icon>
            </v-btn>

            <v-btn
              @click="sendMessage(data.property_id, data.owner_id)"
              color="success"
              v-if="data.status !== 'Rejected'"
            >
              Chat
              <v-icon icon="mdi-message-text" end></v-icon>
            </v-btn>
          </td>
          <td></td>
        </tr>
      </tbody>
    </v-table>

    <!-- <div v-for="x in response" :key="x">
      <p>Response: {{ x.amount }}</p>
    </div> -->
  </div>
</template>

<style scoped></style>
