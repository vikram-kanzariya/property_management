<script setup>
import { socket } from "@/socket";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

let estimates = ref([]);

onMounted(async () => {
  const res = await fetch(
    `http://localhost:3000/all-estimates/${route.params.id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await res.json();
  console.log("Estimates: ", data.data);
  estimates.value = data.data;
});

const acceptEstimate = async (id, pId) => {
  console.log("Inside Accept Estimate Function");

  const data = await fetch(`http://localhost:3000/accept`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ estimateId: id, propertyId: pId }),
  });
  let res = await data.json();
  console.log("Response: ", res);

  if (res) {
    router.push("/contractor/home");
  }
};

const rejectEstimate = async (id) => {
  console.log("Inside rejected Function...");

  const data = await fetch(`http://localhost:3000/reject`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ estimateId: id }),
  });
  let res = await data.json();
  console.log("Response: ", res);

  if (res) {
    router.push("/contractor/home");
  }
};

const sendMessage = async (id) => {
  // alert(id)
  router.push(`/chat/owner/${route.params.id}/${id}`);
  // router.push()
};

// console.log("PropertyID: " ,route.params.id);
// console.log("ContractorID: " , id);
</script>

<template>
  <div>
    <h3>Estimates</h3>

    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Contractor ID</th>
          <th class="text-left">Amount</th>
          <th class="text-left">Time</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in estimates" :key="data.id">
          <!-- <td>{{ data.id }}</td> -->
          <td>{{ data.contractor_id }}</td>
          <td>{{ data.amount }}</td>
          <td>{{ data.time }}</td>
          <!-- <td>{{ data.property_id }}</td> -->
          <td>
            <v-btn
              v-if="data.status == null"
              class="ma-2"
              color="primary"
              @click="acceptEstimate(data.id, data.property_id)"
            >
              Accept
              <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
            </v-btn>

            <v-btn
              v-if="data.status == null"
              class="ma-2"
              color="red"
              @click="rejectEstimate(data.id)"
            >
              Decline
              <v-icon icon="mdi-cancel" end></v-icon>
            </v-btn>

            <v-btn
              disabled="true"
              color="success"
              v-if="data.status == 'Accepted'"
            >
              Accepted
              <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
            </v-btn>

            <v-btn disabled="true" color="red" v-if="data.status == 'Rejected'">
              Rejected
              <v-icon icon="mdi-cancel" end></v-icon>
            </v-btn>

            <v-btn
              @click="sendMessage(data.contractor_id)"
              color="success"
              v-if="data.status !== 'Rejected'"
            >
              Chat
              <v-icon icon="mdi-message-text" end></v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
