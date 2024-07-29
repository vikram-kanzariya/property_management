<script setup>
import { onMounted, ref } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useRoute } from "vue-router";
// import axios from "axios";
// import StripeCheckout from "vue-stripe-checkout";

const route = useRoute();
const amount = ref(null);
const message = ref("");
const stripe = ref(null);

onMounted(async () => {
  stripe.value = await loadStripe(
    "pk_test_51PclD8EVBmuUWPZyHtm8S5Vpy3duvluHI5fGazFDWJcG5S6QYDBDoIFqYCBA6GTGAfclFEGfVx8OebsHvJZS1Yjq00xQv0I8fh"
  );
});

const payBill = async () => {
  try {
    const res = await fetch(`http://localhost:3000/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount.value,
        PID: route.params.pid,
        CID: route.params.cid,
      }),
    });

    const session = await res.json();
    console.log("Session: ", session);

    const { error } = await stripe.value.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      message.value = error.message;
    }
  } catch (error) {
    // console.error("Something went Wrong: " , error);
    message.value = error.message;
  }
};
</script>

<template>
  <div>
    <v-sheet
      class="rounded-lg mx-auto bg-blue-grey-lighten-4 pa-3"
      width="450"
      height="auto"
    >
      <v-form ref="form" class="pa-5">
        <v-text-field
          name="email"
          label="Amount"
          v-model="amount"
          prepend-icon="mdi-checkbox-marked-circle"
        ></v-text-field>

        <div class="btn d-flex flex-column align-center">
          <v-btn color="success" class="mt-4" @click="payBill" block>
            Pay now
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped></style>
