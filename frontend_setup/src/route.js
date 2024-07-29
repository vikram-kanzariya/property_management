import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { state } from "./store/modules/users/state";
import PropertyList from "./components/PropertyList.vue";

const routes = [
  {
    path: "/workproof",
    name: "ProofofWork",
    component: () => import("./components/ProofofWork.vue"),
  },
  {
    path: "/register",
    name: "RegisterUser",
    component: () => import("./components/RegisterUser.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "LoginUser",
    // meta: { requiresAuth: false },
    component: () => import("./components/LoginUser.vue"),
  },
  {
    path: "/property/home",
    name: "PoropertyHome",
    component: () => import("./components/PropertyHome.vue"),
    // meta: { requiresAuth: true, role: "1" },
  },
  {
    path: "/property/history",
    name: "WorkHistory",
    component: () => import("./components/WorkHistory.vue"),
  },
  {
    path: "/contractor/history",
    name: "ContractorHistory",
    component: () => import("./components/ContractorHistory.vue"),
  },
  {
    path: "/contractor/home",
    name: "ContractorHome",
    component: () => import("./components/ContractorHome.vue"),
    meta: { requiresAuth: true, role: "2" },
  },
  {
    path: "/property/add-property",
    name: "CreateProperty",
    component: () => import("./components/CreateProperty.vue"),
    // meta:{ requiresAuth: true }
  },
  {
    path: "/contractor/estimate/:id",
    name: "AddEstimate",
    component: () => import("./components/AddEstimate.vue"),
  },

  {
    // path: "/property-list/property",
    path: "/property-list",
    name: "PropertyList",
    // component: () => import("./components/PropertyList.vue"),
    children: [
      {
        path: "property",
        component: () => import("./components/PropertyList.vue"),
      },
      {
        path: "contractor",
        component: () => import("./components/ContractorJobs.vue"),
        // component: () => import("./components/PropertyList.vue"),
      },
    ],
  },
  {
    path: "/property/add-work/:id",
    name: "AddWork",
    component: () => import("./components/AddWork.vue"),
  },
  {
    path: "/jobs/:id",
    name: "JobList",
    component: () => import("./components/JobList.vue"),
  },
  {
    path: "/all-estimates/:id",
    name: "ShowEstimates",
    component: () => import("./components/ShowEstimates.vue"),
  },
  {
    path: "/review",
    name: "ReviewEstimate",
    component: () => import("./components/ReviewEstimate.vue"),
  },
  {
    path: "/payment/:pid/:cid",
    name: "PaymentComponent",
    component: () => import("./components/PaymentComponent.vue"),
  },
  {
    path:'/success',
    name:'Success',
    component:() => import("./components/PaymentSuccess.vue")
  },
  {
    path:'/error',
    name:'Error',
    component:() => import("./components/PaymentError.vue")
  },
  {
    path: "/chat",
    name: "ChatComponent",
    // component:()=> import('./components/ChatComponent.vue'),
    children: [
      {
        path: "owner/:id/:cid",
        name: "ChatOwner",
        component: () => import("./components/ChatComponent.vue"),
      },
      {
        path: "contractor",
        name: "ChatContractor",
        component: () => import("./components/ChatComponent.vue"),
      },
    ],
  },
];

const router = new createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const roleId = localStorage.getItem("roleId");
  // console.log(typeof roleId);

  if (to.meta.requiresAuth && !state.isAuth) {
    next("/login");
  } else {
    next();

    // if (to.meta.role === roleId) {
    //   console.log("innn");
    //   next();
    // } else {
    //   next("/login");
    // }
  }
});

export default router;
