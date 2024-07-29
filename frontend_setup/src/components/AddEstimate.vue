<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute()
const router = useRouter();

const estimateData = reactive(
  {
    amount:'',
    time:'',
  }
);

let data;
const submitEstimate = async() => {
    data = await fetch(`http://localhost:3000/contractor/estimate/${route.params.id}` , {
    method:'POST',
    headers:{ 'Content-Type' : 'application/json' },
    body:JSON.stringify(estimateData),
    credentials:'include',
  });
  data = await data.json();

  if(data.success){
  router.push('/property-list/contractor')
}

console.log("Data: " , data);
};

</script>

<template>
  <div>
    <h3 class="text-center mb-5">EstimatePage</h3>

    <v-sheet
    class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3"
    width="550"
    height="auto"
  >
    <v-form ref="form" class="pa-5">

      <div class="component mt-3">
        <v-text-field
          name="amount"
          id="amount"
          label="Estimate Amount"
          v-model="estimateData.amount"
          prepend-icon="mdi-vuetify"
        ></v-text-field>
       
        <v-text-field
          name="time"
          id="time"
          label="Estimated Time"
          v-model="estimateData.time"
          prepend-icon="mdi-clock"
        ></v-text-field>
       
      </div>

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" @click="submitEstimate" block>
          Submit
        </v-btn>
      </div>
    </v-form>
  </v-sheet>

  </div>
</template>

<style scoped>

</style>