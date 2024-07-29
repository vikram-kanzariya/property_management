<script setup>
import { onBeforeMount } from "vue";
// import { io } from "socket.io-client";

// const URL = "http://localhost:3000";
// const socket = io(URL);

// socket.on("connect" , () => {
//   console.log("Connected SuccessFully")
// });

onBeforeMount(async () => {
  let data = await fetch("http://localhost:3000");

  data = await data.json();
  console.log("Data: ", data);
});
</script>

<template>
  <h3>Home Page</h3>
  <div class="home">
    <!-- <router-link class="routes" to="/register">Register</router-link>
    <router-link class="routes" to="/login">Login</router-link>
    <router-link class="routes" to="/chat">Chat</router-link> -->
    <!-- <router-link class="routes" to="/property/home">Property</router-link>
    <router-link class="routes" to="/contractor/home">Contractor</router-link> -->

    <router-view></router-view>
  </div>
</template>

<style scoped>
.routes {
  color: black;
  /* margin-left: 15%; */
  padding: 5px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
}
</style>
