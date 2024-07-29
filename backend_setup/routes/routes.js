const { Router } = require("express");
const {
  createUser,
  loginUser,
  contractorHomePage,
  propertyHomePage,
  createProperty,
  propertyStorage,
  logOut,
  addWork,
  getAllJobs,
  getPropertiesPropertySide,
  getJobsContractorSide,
} = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/authUser");
const multer = require("multer");
const {
  submitEstimate,
  getEstimates,
} = require("../controllers/contractror.controller");
const {
  acceptEstimate,
  rejectEstimates,
  WorkProof,
  reviewEstimate,
} = require("../controllers/estimate.controller");
const {
  findApprovedProperties,
  submitworkofProof,
  getWorkHistory,
  acceptWork,
  rejectWork,
  getProofStatus,
} = require("../controllers/workproof.controller");
const {
  paymentController,
  successPayment,
} = require("../controllers/payment.controller");
const {
  sendMessage,
  getOwnerChannels,
  getContractorChannels,
  getMessages,
} = require("../controllers/chat.controller");
const uploadImg = multer({ storage: propertyStorage });

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post(
  "/property/add-property",
  uploadImg.any(),
  authenticateUser,
  createProperty
);
router.post("/property/add-work/:id", uploadImg.any(), addWork);

router.post("/contractor/estimate/:id", authenticateUser, submitEstimate);
router.get("/all-estimates/:id", getEstimates);

router.get("/contractor/home", authenticateUser, contractorHomePage);
router.get("/property/home", authenticateUser, propertyHomePage);

router.post("/accept", acceptEstimate);
router.post("/reject", rejectEstimates);

router.get("/logout", authenticateUser, logOut);

router.get(
  "/property-list/property",
  authenticateUser,
  getPropertiesPropertySide
);
router.get(
  "/property-list/contractor",
  authenticateUser,
  getJobsContractorSide
);

router.get("/property/history", authenticateUser, getWorkHistory);
router.get("/contractor/history", authenticateUser, getProofStatus);

router.post("/property/acceptwork", acceptWork);
router.post("/property/rejectwork", rejectWork);

router.get("/jobs/:id", getAllJobs);

router.get("/workproof", authenticateUser, findApprovedProperties);
router.post("/workproof", uploadImg.any(), authenticateUser, submitworkofProof);

router.get("/review", authenticateUser, reviewEstimate);

router.post("/create-checkout-session", paymentController);
router.get("/success/:sessionID", successPayment);

// router.post('/chat' , authenticateUser, sendMessage);
// router.get('/chat/owner/:id/:cid' , authenticateUser , getOwnerChannels);
// router.get('/chat/contractor' , authenticateUser , getContractorChannels);

router.post("/chat/owner", authenticateUser, sendMessage);
router.get("/chat/owner/:cid", authenticateUser, getMessages);

module.exports = router;
