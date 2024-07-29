export const actions = {
  registerUser(context , payload){
    context.commit('addUser' , payload);
  },
  authenticate(context , payload){
    context.commit('authUser' , payload);
  },
  add_property(context , payload){
    context.commit('save_property' , payload);
  },
  getUserID(context , id){
    context.commit('loggedUser' ,id);
  },
  async paymentSuccess({ commit } , sessionId){
    const res = await fetch(`http://localhost:3000/success/${sessionId}` , {
      method:'GET',
      headers:{ 'Content-Type':'application/json' },
    });
    const data = await res.json();
    console.log("SuccessData: " , data);
    return data.mesage;
  }
 
};