<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const historyArr = ref([]);
const comment = ref("");
const stripe = ref(null);
const message = ref('');


onMounted(async () => {
  const data = await fetch(`http://localhost:3000/property/history`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  let res = await data.json();

  historyArr.value = res.data;

  historyArr.value = historyArr.value.filter((item) => {
    return item.proofofwork !== null;
  });
  console.log("HistoryArr: ", historyArr.value);


  stripe.value = await loadStripe('pk_test_51PclD8EVBmuUWPZyHtm8S5Vpy3duvluHI5fGazFDWJcG5S6QYDBDoIFqYCBA6GTGAfclFEGfVx8OebsHvJZS1Yjq00xQv0I8fh')
});

const acceptWork = async (id) => {
  let data = await fetch(`http://localhost:3000/property/acceptwork`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, comment: comment.value }),
  });

  let res = await data.json();
};

const rejectWork = async (id) => {
  // const formdata = new FormData();

  // formdata.append('comment' , comment.value);
  // formdata.append('id' , id);

  const data = await fetch(`http://localhost:3000/property/rejectwork`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, comment: comment.value }),
  });

  let res = await data.json();

  console.log("FormData: ", res);

  if (res.success) {
    router.push("/property/home");
  }
};


const completePayment = async(wid , pid, cid , oid) => {
  // alert(oid)
  // router.push(`/payment/${pid}/${cid}`);

  try {
    const res = await fetch(`http://localhost:3000/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        PID: pid,
        CID: cid,
        OID:oid,
      }),
    });

    const session = await res.json();
    console.log("Session: ", session);

    store.commit('sessionId' , session.id)
    const { error } = await stripe.value.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      message.value = error.message;
    }
  } catch (error) {
    message.value = error.message;
  }

}
</script>

<template>
  <div>
    <h3 class="text-center mb-5 mt-5">work History</h3>

    <v-list lines="one">
      <v-list-item
        class="align-center"
        v-for="data in historyArr"
        :key="data"
        :title="'PropertyName: ' + data.property_name"
        :subtitle="'Owner: ' + data.owner_name"
      >
        <p>ContractorId: {{ data.proofofwork.contractor_id }}</p>
        <p>Title: {{ data.proofofwork.work_title }}</p>
        <p>Description: {{ data.proofofwork.work_description }}</p>
      </v-list-item>
    </v-list>

    <v-row dense>
      <v-col
        v-for="(data, i) in historyArr"
        :key="data"
        cols="10"
        md="4"
        class="elevation-10 pa-5 mb-2"
      >
        <v-card
          v-for="image in data.proofofwork.proofofwork_images"
          :key="image"
          class="mx-auto mb-2 bg-indigo-lighten-3 font-weight-bold elevation-10"
          color="black"
          max-width="344"
          height="250"
          :image="`http://localhost:3000${image.image}`"
        >
        </v-card>

        <div class="actions text-center mt-5 pa-3">
          <v-text-field name="id" id="id" type="hidden"></v-text-field>

          <v-btn
            v-if="data.proofofwork.status === null"
            @click="acceptWork(data.proofofwork.id)"
            color="success"
            class="mr-5"
            >Accept</v-btn
          >

          <v-btn
            v-if="data.proofofwork.status === null"
            @click="rejectWork(data.proofofwork.id)"
            color="error"
            >Reject</v-btn
          >

          <v-btn
            disabled="true"
            color="success"
            v-if="data.proofofwork.status === 'Accepted'"
          >
            Accepted
            <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
          </v-btn>

          <v-btn
            color="purple"
            class="ml-2"
            v-if="data.proofofwork.status === 'Accepted'"
            @click="
              completePayment(
                data.proofofwork.id,
                data.proofofwork.property_id,
                data.proofofwork.contractor_id,
                data.owner_id,
              )
            "
          >
            Payment
            <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
          </v-btn>

          <v-btn
          disabled="true"
            color="orange"
            class="ml-2"
            v-if="data.proofofwork.status === 'payment-done'"
         
          >
            Payment Completed
            <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
          </v-btn>


          <v-btn
            disabled="true"
            color="red"
            v-if="data.proofofwork.status === 'Rejected'"
          >
            Rejected
            <v-icon icon="mdi-cancel" end></v-icon>
          </v-btn>
        </div>

        <div class="comment d-flex elevation-20">
          <v-text-field
            v-if="data.proofofwork.status === null"
            name="comment"
            label="Comment"
            id="comment"
            v-model="comment"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped></style>
