<script setup>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { computed } from "vue";

import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const loginUser = reactive({
  email: "",
  password: "",
  isError: false,
  errorMessage: "",
});

const rules = computed(() => {
  return {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  };
});

const v$ = useVuelidate(rules, loginUser);

const checkLogin = async () => {
  const result = await v$.value.$validate();
  console.log("Result is: ", result);

  if (result) {
    store.dispatch("authenticate", true);

    let data = await fetch("http://localhost:3000/login", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: JSON.stringify(loginUser),
    });
    data = await data.json();
    store.dispatch('getUserID' , data.id)

    // console.log("UserData: ", data);
    // console.log("Login user's RoleId: ", data.token.dataValues.roleId);

    // localStorage.setItem('token' , data.token.token)
    // localStorage.setItem('roleId' , data.token.dataValues.roleId)
    if (data.success == false) {
      router.push("/register");
      return;
    }

    if (data.token.dataValues.roleId == 1) {
      router.push("/property/home");
      console.log("data: ", data);
    }

    if (data.token.dataValues.roleId == 2) {
      router.push("/contractor/home");
      console.log("data: ", data);
    }
    // alert('Something Went Wrong...');
    // router.push('/register');
  }
  // else{
  //   alert('Something Went Wrong...');
  //   router.push('/register');
  // }
};

let userList = computed(() => {
  return store.getters.getAllUsers;
});
</script>

<template>
  <h2 class="mt-5">Login</h2>

  <v-sheet
    class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3"
    width="450"
    height="auto"
  >
    <v-form ref="form" class="pa-5">
      <v-text-field
        name="email"
        label="Email"
        v-model="loginUser.email"
        prepend-icon="mdi-email"
      ></v-text-field>

      <span
        class="text-red text-600"
        v-for="error in v$.email.$errors"
        :key="error.$uid"
        >{{ error.$property }} - {{ error.$message }}</span
      >

      <v-text-field
        name="password"
        label="Password"
        type="password"
        v-model="loginUser.password"
        prepend-icon="mdi-lock"
      ></v-text-field>

      <span
        class="text-red text-600"
        v-for="error in v$.password.$errors"
        :key="error.$uid"
        >{{ error.$property }} - {{ error.$message }}</span
      >

      <div class="d-flex flex-column">
        <v-btn color="success" class="mt-4" @click="checkLogin" block>
          Login
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<style scoped></style>
