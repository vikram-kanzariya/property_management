<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const workArray = ref([]);
onMounted(async () => {
  let data = await fetch("http://localhost:3000/contractor/history", {
    method: "GET",
    headers: { "Content-Type": "aplication/json" },
    mode: "cors",
    credentials: "include",
  });

  const res = await data.json();
  workArray.value = res.data;

  console.log("Works Array: ", workArray.value);
});

const newProof = () => {
  router.push("/workproof");
};
</script>

<template>
  <div>
    <h4>ContractorHistory Page</h4>

    <h3 v-if="workArray.length == 0" class="text-red text-center mt-5">
      You have not Any Work History
    </h3>

    <v-list lines="one">
      <v-list-item
        class="align-center"
        v-for="data in workArray"
        :key="data"
        :title="'Title: ' + data.work_title"
        :subtitle="'Description: ' + data.work_description"
      >
        <p>status: {{ data.status }}</p>
        <p>Comment: {{ data.comment }}</p>
      </v-list-item>
    </v-list>

    <v-row dense>
      <v-col
        v-for="(data, i) in workArray"
        :key="data"
        cols="10"
        md="4"
        class="elevation-10 pa-5 mb-2"
      >
        <v-card
          v-for="image in data.proofofwork_images"
          :key="image"
          class="mx-auto mb-2 bg-indigo-lighten-3 font-weight-bold elevation-10"
          color="black"
          max-width="344"
          height="250"
          :image="`http://localhost:3000${image.image}`"
        >
        </v-card>

        <v-btn
          color="success"
          @click="newProof"
          v-if="data.status === 'Rejected'"
          >Upload New Work of Proof</v-btn
        >

        <v-btn
          disabled="true"
          color="success"
          v-if="data.status === 'Accepted'"
        >
          Accepted
          <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
        </v-btn>

        <v-btn
          disabled="true"
          color="success"
          v-if="data.status === 'payment-done'"
        >
          Payment Completed
          <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
        </v-btn>

        <v-btn disabled="true" color="red" v-if="data.status === 'Rejected'">
          Rejected
          <v-icon icon="mdi-cancel" end></v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
