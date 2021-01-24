import firebase from 'firebase'
import db from '../../fb'
import mixin from '../../mixins/global'
import router from '../../router/index'
import axios from 'axios'

const state = {
    users: []
}

const getters = {
    getUsers: state => state.users
}

const actions = {

  // CREATE USER
  async createUser({commit}, payload) {
    axios.post('https://us-central1-active-consult.cloudfunctions.net/createUser', payload).then(result => {
        if(result.data.success) {
          delete payload.password
            db.collection('users').doc(result.data.id).set(payload).then(() => {
              payload.id = result.data.id
              commit('addUser', payload)
          })
        }
    }).catch(err => {
        commit("setToast", {message: err.message, show: true, color: "red"})
    })
  },

  // Login User
  loginUser({commit}, payload) {
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(() => {
      firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then(doc => {
          if(doc.exists) {
            const data = doc.data()
            if(!data.isAdmin) {
              commit("setToast", {message: "Only Admin can Login.", color: "red", show: true})
            }
            else {
              data.id = doc.id
              mixin.methods.setLoggedUser(data)
              router.push('/')
            }
          }
          else {
            commit("setToast", {message: "Record not found.", color: "red", show: true})
          }
          
        }).catch(err => commit("setToast", {message: err.message, color: "red", show: true}));
      })
    }).catch(err => commit("setToast", {message: err.message, color: "red", show: true}));
  },

 // Fetch Users
 async fetchUsers({commit}) {
    let usersArray = []
    await db.collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            usersArray.push({
              id: doc.id,
              email: doc.data().email,
              isAdmin: doc.data().isAdmin,
              client_info: doc.data().client_info
            });
          });
          commit('setUsers', usersArray)
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },

  // Update User
 async updateUser({commit}, payload) {
  await db.collection("users")
    .doc(payload.id)
    .update({client_info: payload.client_info})
    .then(() => {
      commit('editUser', payload.client_info)
      commit("setToast", {message: "Client Updated Successfully.", color: "green", show: true})
    })
    .catch((error) => {
      commit("setToast", {message: error.message, color: "red", show: true})
    });
  }
}

const mutations = {
    // Set Users
    setUsers: (state, payload) => state.users = payload,
    addUser: (state, payload) => state.users.push(payload),
    editUser: (state, payload) => {
      state.users = state.users.map(user => {
        if(user.id == payload.id) {
          return Object.assign({}, user, payload)
        }
        return user
      })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}