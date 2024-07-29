export const getters = {
  getAllUsers(state) {
    return state.users;
  },
  getLoggedUser(state) {
    // console.log("State is", state);
    return state.loggedInUser;
  },
  getSessionId(state){
    return state.sessionId;
  }
};
