<script setup>
import { reactive, computed , ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();


const propertyData = reactive({
  owner_name: "",
  property_name: "",
  address: "",
  image: "",
});

const rules = computed(() => {
  return {
    owner_name:{ required },
    property_name: { required },
    address: { required },
  }
});

const v$ = useVuelidate(rules , propertyData)

let isError = ref(false);
let errorMsg = ref("");

let image;
let handleImage = async(event) => {
  image = event.target.files[0];
  console.log("Image is: " , image);
};

const createProperty = async () => {

  const result = await v$.value.$validate();
  console.log("result " , result)

  if(result == true){

    store.dispatch('add_property' , {
      owner_name:propertyData.owner_name,
      property_name:propertyData.property_name,
      address:propertyData.address,
      image:image,
    })

    isError.value = false;
    errorMsg.value = "";

    const formdata = new FormData();
    formdata.append("owner_name" , propertyData.owner_name)
    formdata.append("property_name" , propertyData.property_name)
    formdata.append("address" , propertyData.address)
    formdata.append("property_image" , image)

    let data = await fetch("http://localhost:3000/property/add-property", {
      credentials: "include",
      method: "POST",
      body: formdata
    });
    data = await data.json();
    console.log("PropertyData: ", data);
    

    router.push('/property-list/property');
  }
  else{
    isError.value = true;
    errorMsg.value = "Something wrong While Createing Property..."
  }
};

</script>

<template>
  <div>
    <h2>Add New Property</h2>

    <v-sheet
      class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3"
      width="500"
      height="auto"
    >
      <v-form ref="form" class="pa-5">
        <v-text-field
          name="owner_name"
          id="owner_name"
          label="Property Owner Name"
          v-model="propertyData.owner_name"
          prepend-icon="mdi-account"
        ></v-text-field>

        <span class="text-red text-600" v-for="error in v$.owner_name.$errors" :key="error.$uid">{{ error.$property }} - {{ error.$message }}</span>

        <v-text-field
          name="property_name"
          id="property_name"
          label="Property Name"
          v-model="propertyData.property_name"
          prepend-icon="mdi-home"
        ></v-text-field>

        <span class="text-red text-600" v-for="error in v$.property_name.$errors" :key="error.$uid">{{ error.$property }} - {{ error.$message }}</span>

        <v-text-field
          name="address"
          id="address"
          label="Address"
          v-model="propertyData.address"
          prepend-icon="mdi-map"
        ></v-text-field>

        <span class="text-red text-600" v-for="error in v$.address.$errors" :key="error.$uid">{{ error.$property }} - {{ error.$message }}</span>

        <v-file-input
          accept="image/png, image/jpeg, image/jpg"
          label="Upload Property Image"
          prepend-icon="mdi-paperclip"
          name="property_image"
          id="property_image"
          @change="handleImage($event)"
        ></v-file-input>

        <div class="d-flex flex-column">
          <v-btn
            color="success"
            class="mt-4"
            width="50%"
            @click="createProperty"
            block
          >
            Create Property
          </v-btn>

          <p v-if="isError" class="text-red mt-4 text-center">{{ errorMsg }}</p>

        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
