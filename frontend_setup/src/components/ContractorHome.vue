<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logOut = async () => {
  let data = await fetch("http://localhost:3000/logout", {
    method: "GET",
    headers: { "Content-type": "acpplication/json" },
  });

  if (data) {
    console.log("LogOut SuccessFull...");
    localStorage.removeItem("token");
    router.push("/login");
  }
};
</script>

<template>
  <div>
    <h2>ContractorHome Page</h2>

    <v-card>
      <v-layout>
        <v-navigation-drawer floating permanent class="bg-blue pa-5">
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-view-dashboard"
              title="Home"
              value="home"
              to="/"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-account-group"
              title="View Properties"
              value="Property List"
              to="/property-list/contractor"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-city"
              title="Review Estimate"
              value="Property List"
              to="/review"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-thumb-up"
              title="Add Work Proof"
              value="Property List"
              to="/workproof"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-history"
              title="Work History"
              value="History"
              to="/contractor/history"
            ></v-list-item>

            <v-btn
              class="ml-6 mt-4 font-weight-bold"
              color="success"
              @click="logOut"
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
