<script setup>
import { reactive, computed, ref } from "vue";
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const form = ref("");
const router = useRouter();

const workData = reactive([
  {
    title: "",
    description: "",
    images: null,
  },
]);

const rules = computed(() => {
  return {
    title:{ required },
    description:{ required },
  }
});

const addField = () => {
  workData.push({
    title: "",
    description: "",
    images: "",
  });
};

const removeField = () => {
  if (workData.length > 1) {
    workData.pop();
  }
};

const imgObj = {};

const handleImage = (e) => {
  let imageName = e.target.name;
  let images = e.target.files;

  imgObj[imageName] = images;
  console.log("image Object: " , imgObj)
  console.log("objectName: " , imageName)

  return imgObj;
};

const v$ = useVuelidate(rules.value , workData);
console.log("Result is: " , v$.value.$validate)

const createWork = async () => {
  const formdata = new FormData();

  workData.forEach((data) => {
    formdata.append('title' , data.title);
    formdata.append('description' , data.description);
  });

  for (let i=0; i<Object.keys(imgObj).length; i++) {
    for (let j=0; j<imgObj[Object.keys(imgObj)[i]].length; j++) {
      // console.log(Object.keys(imgObj)[i]);
      // console.log("image", imgObj[Object.keys(imgObj)[i]][j]);
      formdata.append(
        Object.keys(imgObj)[i],
        imgObj[Object.keys(imgObj)[i]][j],
      );
    }
  }


      let data = await fetch(
      `http://localhost:3000/property/add-work/${route.params.id}`,
      {
        method: "POST",
        body: formdata,
      }
    );
    data = await data.json();
    console.log("JobsData is: ", data);

    if (data.success) {
      router.push(`/jobs/${route.params.id}`);
  }

  }
</script>

<template>
  <h2 class="mt-5">Add Work</h2>

  <v-sheet
    class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3"
    width="550"
    height="auto"
  >
    <v-form ref="form" class="pa-5">
      <v-btn class="ma-2" color="success" @click="addField">ADD</v-btn>
      <v-btn class="ma-2" color="error" @click="removeField">REMOVE</v-btn>

      <div
        class="component mt-3"
        v-for="(data, index) in workData"
        :key="index"
      >
        <!-- <p>Index is: {{ index }}</p> -->
        <v-text-field
          name="title"
          id="title"
          label="Title"
          v-model="data.title"
          prepend-icon="mdi-table"
        ></v-text-field>

        <v-textarea
          prepend-icon="mdi-group"
          color="cyan"
          label="Description"
          name="description"
          id="description"
          v-model="data.description"
        ></v-textarea>

        <v-file-input
          accept="image/png, image/jpeg, image/jpg"
          label="Upload Work Image"
          prepend-icon="mdi-paperclip"
          :name="'job_image-' + index"
          id="job_image"
          multiple
          show-size
          counter
          @change="handleImage($event)"
        ></v-file-input>
      </div>

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" @click="createWork" block>
          ADD Work
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<style scoped></style>
