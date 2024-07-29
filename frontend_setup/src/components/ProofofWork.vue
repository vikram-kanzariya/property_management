<script setup>
import { reactive , onMounted , ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const aproovedProperties = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/workproof", {
    method: "GET",
    credentials:'include'
  });
  const data = await res.json();
  console.log("JobsData: " , data.data)
  aproovedProperties.value = data.data;

  console.log("aproovedProperties Values " , aproovedProperties.value);
});

const proofData = reactive({
  title:null,
  description:null,
  proof_images:[],
})


let images;
const handleImage = (e) => {
  images = e.target.files;
  console.log("Images: " , images)

  return images;
}

const submitProof = async(id) => {
  console.log("Length: " , images.length)
  const formdata = new FormData();

  formdata.append('title' , proofData.title);
  formdata.append('description' , proofData.description);
  formdata.append('property_id' , JSON.stringify(id))

  for(let i=0 ; i<images.length ; i++){
    formdata.append('job_image' , images[i])
  }

  let data = await fetch('http://localhost:3000/workproof' , {
    method:'POST',
    credentials:'include',
    body:formdata
  });
  let res = await data.json();
  
  if(res.success){
    router.push('/contractor/home');
  }
};

</script>

<template>
  <div>
    <h3 class="text-center ma-5 pa-2">Add proof of Work Page</h3>

    <h3 
      v-if="aproovedProperties.length == 0"
      class="text-center text-red"
    >
      :(( You Have not any work of Proof to Submit )):
    </h3>

    <v-row >
      <v-col
      v-for="(arr, i) in aproovedProperties"
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
        :image="`http://localhost:3000${arr.image}`"
      >
    </v-card>

    <v-card
      :title="arr.property_name"
      :text="arr.status"
      :subtitle="arr.address"
    >
    </v-card>

    <v-dialog max-width="500">
  <template v-slot:activator="{ props: activatorProps }" class="position-relative">
    <v-btn
      class="position-absolute right-50 top-20 ma-5 w-10"
      v-bind="activatorProps"
      color="indigo-darken-3"
      text="Add Proof of Work"
      variant="flat"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Submit Proof of Work">
      <v-card-text>

        <v-text-field
          name="property_id"
          id="property_id"
          type="hidden"
        ></v-text-field>


          <v-text-field
          name="title"
          id="title"
          label="Title"
          prepend-icon="mdi-table"
          v-model="proofData.title"
        ></v-text-field>

          <v-text-field
          name="description"
          id="description"
          label="Description"
          prepend-icon="mdi-message-text"
          v-model="proofData.description"
        ></v-text-field>


        <v-file-input
          accept="image/png, image/jpeg, image/jpg"
          label="Upload Work Image"
          prepend-icon="mdi-camera"
          name="job_image"
          id="job_image"
          multiple
          show-size
          counter
          @change="handleImage($event)"
        ></v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
        <v-btn
          text="Submit"
          @click="submitProof(arr.property_id)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>


    </v-dialog>


  

    <div class="text-center text-caption">{{ variant }}</div>
    </v-col>

  </v-row>

  </div>
</template>

<style scoped>

</style>