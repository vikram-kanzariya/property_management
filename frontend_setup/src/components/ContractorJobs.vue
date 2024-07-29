<script setup>
import { onMounted , ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

let jobs = ref([]);
let newArr = ref([])

onMounted(async () => {
  console.log("inside Function")
  const res = await fetch("http://localhost:3000/property-list/contractor", {
    method: "GET",
    headers:{ 'Content-Type' : 'application/json' },
    credentials:'include'
  });
  const data = await res.json();
  console.log("JobsData: " , data.data)
  jobs.value = data.data;

  console.log("JobsValue:;;; " ,jobs.value);
});

const giveEstimate = (id) => {
  router.push(`/contractor/estimate/${id}`);
};

</script>

<template>
  <div>
    <h3 class="text-center ma-5 pa-1 rounded">Property-List</h3>

    <v-row >
      <v-col
      v-for="(arr, i) in jobs"
      :key="(i+1)"
      cols="10"
      md="4"
    >
    <v-card
        :variant="properties"
        class="mx-auto bg-indigo-lighten-3 position-relative mb-2"
        color="black"
        max-width="300"
        height="200"
        :image="`http://localhost:3000${arr[0].image}`"
        >

        <v-btn 
          color="primary" 
          @click="giveEstimate(i)"
          class="position-absolute bottom-0 right-0"
          >
          Give Estimate
        </v-btn>

        <v-btn 
          color="primary" 
          @click="giveEstimate(i)"
          class="position-absolute bottom-0 right-0"
          >
          Give Estimate
        </v-btn>

    </v-card>

      <v-card
        v-for="x in arr" :key="x.id"
        :variant="tonal"
        class="mx-auto bg-indigo-lighten-2 shdaow-black"
        color="black" 
        max-width="300"
        height="100"
        :text="x.description"
        :title="x.title"
      >
    </v-card>

      

    <template v-slot:actions class="position-relative">
          
      <p>Hello All</p>
          <!-- <v-btn 
          v-if="$route.fullPath.includes('list/contractor')" 
          color="success" 
          text="View Jobs" 
          class="border bg-black position-absolute bottom-0 left-0"  
          @click="jobList(x.id)"
          prepend-icon="mdi-eye"
          ></v-btn> -->

        </template>

    <div class="text-center text-caption">{{ variant }}</div>
    </v-col>

  </v-row>
  </div>
</template>

<style scoped></style>
