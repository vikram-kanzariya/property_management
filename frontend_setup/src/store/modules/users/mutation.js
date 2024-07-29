export const mutations = {
  addUser(state , payload){
    state.users = payload;
  },
  authUser(state , auth){
    state.isAuth = auth;
  },
  save_property(state , payload){
    state.property = payload;
  },
  loggedUser(state , id){
    state.loggedInUser = id;
  },
  setSessionId(state , id){
    state.sessionId = id;
  }
};