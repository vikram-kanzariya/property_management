<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const rail = ref(true);

const logoutUser = async () => {
  let data = await fetch("http://localhost:3000/logout", {
    method: "GET",
    headers: { "Content-type": "acpplication/json" },
    credentials: "include",
  });

  if (data) {
    console.log("LogOut SuccessFull...");
    localStorage.clear();
    router.push("/login");
  }
};
</script>

<template>
  <div>
    <v-card>
      <v-layout>
        <v-navigation-drawer
          :rail="rail"
          @click="rail = !rail"
          class="bg-indigo-lighten-1 pa-5"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>

          <v-list density="compact" nav class="pa-5">
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Home"
              value="home"
              to="/"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-plus"
              title="Create Property"
              value="Create Property"
              to="add-property"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-home-group"
              title="View Properties"
              value="View properies"
              to="/property-list/property"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-history"
              title="Work History"
              value="History"
              to="/property/history"
            ></v-list-item>

            <v-btn
              class="text-center ml-6 mt-5 font-weight-bold"
              color="success"
              @click="logoutUser"
              >Logout</v-btn
            >
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 250px"></v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<style scoped></style>
