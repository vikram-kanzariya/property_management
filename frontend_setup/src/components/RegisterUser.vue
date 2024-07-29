<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

// const users = computed(() => store.getters.getAllUsers);

const userData = reactive({
  id: 1,
  fname: "",
  lname: "",
  email: "",
  number: "",
  password: "",
  cpassword: "",
  role: "",
});

const rules = computed(() => {
  return {
    fname: { required, minLength: minLength(4) },
    lname: { required, minLength: minLength(4) },
    email: { required, email },
    number: { required },
    password: { required },
    cpassword: { required },
    role: { required },
  };
});
const items = ["property_owner", "contractor"];

const v$ = useVuelidate(rules, userData);

const registerUser = async () => {
  const result = await v$.value.$validate();

  if (result) {
    let data = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    data = await data.json();

    console.log("Data: ", data);
    console.log("UserData: ", userData);

    store.dispatch("registerUser", {
      id: userData.id,
      roleId: userData.role,
      fname: userData.fname,
      lname: userData.lname,
      email: userData.email,
      number: userData.number,
    });
    userData.id++;
    userData.fname = "";
    userData.lname = "";
    userData.email = "";
    userData.number = "";
    userData.role = "";
    userData.password = "";
    userData.cpassword = "";

    router.push("/login");
  }
};
</script>

<template>
  <div class="register d-flex h-50 pa-5">
    <v-sheet
      class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-5"
      width="450"
      height="auto"
    >
      <form @submit.prevent="submit">
        <v-text-field
          v-model="userData.fname"
          prepend-icon="mdi-account"
          label="FirstName"
          name="fname"
          @blur="v$.fname.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.fname.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <v-text-field
          prepend-icon="mdi-account"
          v-model="userData.lname"
          label="LastName"
          name="lname"
          @blur="v$.lname.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.lname.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <select name="" id="">
          <option value=""></option>
        </select>

        <v-text-field
          prepend-icon="mdi-phone"
          v-model="userData.number"
          label="Phone Number"
          name="number"
          @blur="v$.number.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.number.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <v-text-field
          prepend-icon="mdi-email"
          v-model="userData.email"
          label="Email"
          name="email"
          @blur="v$.email.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.email.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <v-select
          prepend-icon="mdi-account-group"
          v-model="userData.role"
          :items="items"
          label="Select-Role"
          name="role"
          @blur="v$.role.$touch"
        ></v-select>

        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.role.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <v-text-field
          prepend-icon="mdi-lock"
          v-model="userData.password"
          label="Password"
          name="password"
          type="password"
          @blur="v$.password.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.password.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <v-text-field
          prepend-icon="mdi-lock"
          v-model="userData.cpassword"
          label="Confirm-Password"
          name="cpassword"
          type="password"
          @blur="v$.cpassword.$touch"
        ></v-text-field>
        <span
          class="text-red text-600 pa-2"
          v-for="error in v$.cpassword.$errors"
          :key="error.$uid"
        >
          {{ error.$property }} - {{ error.$message }}
        </span>

        <div class="btn d-flex flex-column align-center">
          <v-btn class="mt-4 w-50" type="submit" @click="registerUser">
            submit
          </v-btn>
        </div>
      </form>
    </v-sheet>
  </div>
</template>
