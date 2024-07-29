import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected:false,
  fooEvents:[],
  barEvents:[],
});

const URL = "http://localhost:3000";

export const socket = io(URL , {
  auth:{ serverOffset: 0 },
  // autoConnect:false,
  
});

socket.on("connect" , () => {
  console.log("user has Connected...")
  state.connected = true;
});

socket.on("disconnect" , () => {
  console.log("User DisConnect")
  state.connected = false;
});