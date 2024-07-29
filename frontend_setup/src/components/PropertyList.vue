<script setup>
import { onMounted , ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

let properties = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/property-list/property", {
    method: "GET",
    credentials:'include',
  });
  const data = await res.json();
  properties.value = data.property;
  console.log("property is: ", properties.value);
});

// onMounted(async () => {
//   const res = await fetch("http://localhost:3000/property-list/contractor", {
//     method: "GET",
//     credentials:'include'
//   });
//   const data = await res.json();
//   properties.value = data.property;
//   console.log("property is", properties.value);
// });

const addJob = (id) => {
  router.push(`/property/add-work/${id}`);
}

const giveEstimate = (id) => {
  router.push(`/contractor/estimate/${id}`);
}; 

const viewEstimate = (id) => {
  router.push(`/all-estimates/${id}`);
}

const jobList = (id) => {
  if(route.fullPath.includes('property-list/contractor')){
    router.push(`/jobs/${id}`)
  }
}

</script>

<template>
  <div>
    <h3 class="text-center ma-5 pa-1 rounded">Property List</h3>

    <v-row dense="">
      <v-col
      v-for="(x, i) in properties"
      :key="x.id"
      cols="10"
      md="4"
    >
      <v-card
        :variant="properties"
        class="mx-auto bg-indigo-lighten-3"
        color="black"
        max-width="400"
        height="250"
        :text="x.address"
        :title="x.property_name"
        :image="`http://localhost:3000${x.image}`"
      >
        <template v-slot:actions class="position-relative">
          <br>
          <br>
          <v-btn 
          v-if="$route.fullPath.includes('list/property')" 
          color="success" 
          text="Add Job" 
          class="border bg-black position-absolute bottom-0 left-0"  
          @click="addJob(x.id)"
          ></v-btn>

          <br>
          <br>
          <v-btn 
          v-if="$route.fullPath.includes('list/property')" 
          color="success" 
          text="View Estimate" 
          class="border bg-black position-absolute bottom-0 right-0"  
          @click="viewEstimate(x.id)"
          prepend-icon="mdi-eye"
          ></v-btn>

          <!-- <v-btn color="green" class="border bg-black font-weight-bold">Review Work</v-btn> -->

        </template>

      </v-card>

      <div class="text-center text-caption">{{ variant }}</div>
    </v-col>

  </v-row>

  </div>
</template>

<style scoped>

</style>
