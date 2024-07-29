<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { ref } from "vue";

const route = useRoute();

let jobsArr = ref([]);

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/jobs/${route.params.id}`, {
    method: "GET",
  });
  const data = await res.json();
  console.log("jobs Data: " , data.data)
  // jo = data.data;
  jobsArr.value = data.data
});

// console.log("jobsArray: ", jobsArr.value);
</script>

<template>
  <div>
    <h3 class="text-center ma-5 pa-2">Jobs List</h3>
  
    <v-row dense>
      <v-col v-for="(x, i) in jobsArr" :key="x" cols="10" md="4">
        <v-card
          v-if="x.job_status == 'created'"
          :variant="jobsArr"
          class="mx-auto bg-indigo-lighten-3 font-weight-bold"
          color="black"
          max-width="344"
          height="250"
          :text="x.description"
          :title="x.title"
          :subtitle="x.job_status"
          :image="`http://localhost:3000${x.images}`"
        >
        </v-card>

        <div class="text-center text-caption">{{ variant }}</div>
      </v-col>
      
      <v-btn 
    color="primary"
    prepend-icon="mdi-message-text"
    >CHAT</v-btn>

    </v-row>

  
  </div>
</template>

<style scoped></style>
