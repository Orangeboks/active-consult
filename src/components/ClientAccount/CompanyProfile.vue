<template>
    <div class="company-profile">
        <v-row justify="center" class="mt-5" v-if="userInfo">
            <v-col cols="12" md="10" lg="9" xl="8">
                <v-card>
                    <v-card-title class="info--text d-flex">
                        <span>{{userInfo.client_info.companyName}}</span>
                        <div class="ml-auto">
                            <v-btn depressed color="info" @click="edit">Edit</v-btn>
                        </div>
                        
                    </v-card-title>
                    <v-card-text>
                        <v-divider></v-divider>
                        <v-row class="mt-3">
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">Email</strong>
                                <p>{{userInfo.email}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">VAT</strong>
                                <p>{{userInfo.client_info.vat ? userInfo.client_info.vat : 'N/A'}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">Bul Stat</strong>
                                <p>{{userInfo.client_info.bulstat ? userInfo.client_info.bulstat : 'N/A'}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">Short Note</strong>
                                <p>{{userInfo.client_info.shortNote ? userInfo.client_info.shortNote : 'N/A'}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">Registration Address</strong>
                                <p>{{userInfo.client_info.regAddress ? userInfo.client_info.regAddress : 'N/A'}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <strong class="info--text">Correspondance Address</strong>
                                <p>{{userInfo.client_info.corAddress ? userInfo.client_info.corAddress : 'N/A'}}</p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row align="center" justify="center" no-gutters class="mt-4">
            <v-col cols="12" md="10" lg="9" xl="8">
                <v-card>
                    <v-card-text>
                        <div class="mb-4 align-center d-flex justify-space-between">
                            <h2 class="black--text">Contacts</h2>
                            <v-btn depressed color="info" @click="submitContact">Create Contact</v-btn>
                        </div>
                        <v-divider></v-divider>
                        <v-layout row wrap class="mt-4">
                            <v-flex xs12 md6 class="px-15 mb-0">
                                <v-text-field
                                    placeholder="Name"
                                    v-model="contact.name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="px-15  mb-0">
                                <v-text-field
                                    placeholder="Email"
                                    v-model="contact.email"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="px-15">
                                <v-text-field
                                    placeholder="Phone Number"
                                    v-model="contact.phone"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="px-15">
                                <v-text-field
                                    placeholder="Address"
                                    v-model="contact.address"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 class="px-15">
                                <v-text-field
                                    placeholder="Position"
                                    v-model="contact.position"
                                ></v-text-field>
                            </v-flex>
                            </v-layout>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row align="center" justify="center" class="mt-4" v-if="clientContacts.length">
            <v-col cols="12" md="10" lg="9" xl="8">
                <v-expansion-panels>
                    <v-expansion-panel
                    v-for="contact in clientContacts"
                    :key="contact.name"
                    >
                        <v-expansion-panel-header>{{ contact.name }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout row wrap class="pa-3">
                            <v-flex xs12 md6 class="mb-5">
                                <div class="caption grey--text pa-0">Email</div>
                                <div class="subtitle-2">{{ contact.email }}</div>
                            </v-flex>
                            <v-flex xs12 md6>
                                <div class="caption grey--text pa-0">Phone</div>
                                <div class="subtitle-2">{{ contact.phone }}</div>
                            </v-flex>
                            <v-flex xs12 md6>
                                <div class="caption grey--text pa-0">Address</div>
                                <div class="subtitle-2">{{ contact.address }}</div>
                            </v-flex>
                            <v-flex xs12 md6>
                                <div class="caption grey--text pa-0">Position</div>
                                <div class="subtitle-2">{{ contact.position }}</div>
                            </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        

        <v-dialog max-width="600" persistent v-model="dialog">
            <v-card v-if="editClient">
                <v-card-title>Edit Client</v-card-title>
                <v-card-text>
                    <v-divider></v-divider>
                    <v-form @submit.prevent ref="form"></v-form>
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <v-text-field 
                                outlined
                                color="primary"
                                v-model="editClient.client_info.companyName"
                                label="Company Name*"
                                :rules="[v => !!v || 'Company Name is required']"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field outlined color="primary" v-model="editClient.email" label="Email" disabled></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                outlined
                                color="primary"
                                v-model="editClient.client_info.vat"
                                label="VAT*"
                                :rules="[v => !!v || 'VAT is required']"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                outlined
                                color="primary"
                                v-model="editClient.client_info.bulstat"
                                label="BULSTAT*"
                                :rules="[v => !!v || 'BULSTAT is required']"
                            ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                            <v-text-field outlined color="primary" v-model="editClient.client_info.regAddress" label="Registration Address"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field outlined color="primary" v-model="editClient.client_info.corAddress" label="Correspondance Address"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea outlined color="primary" :rules="[v => v.length <= 200 || 'Max 200 characters']" v-model="editClient.client_info.shortNote" label="Short Note*"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="mt-2">
                            <v-btn depressed color="grey lighten-2" @click="dialog = !dialog" block>Cancel</v-btn>
                        </v-col>
                        <v-col cols="12" md="6" class="mt-2">
                            <v-btn depressed color="info" block type="submit" @click="submit" :disabled="loading">{{loading ? 'Editing Client...' : 'Edit Client'}}</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import db from '@/fb'
export default {
    props: {
        userInfo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            dialog: false,
            editClient: null,
            contact: [],
            clientContacts: []
        }
    },
    created () {
    if(this.$route.params.id) {
      this.id = this.$route.params.id
    }
      console.log('again calling the params' + this.$route.params.id );
      const ref = db.collection('users').doc(this.$route.params.id).collection('client-info').doc(this.$route.params.id);
      console.log(ref);
        ref.onSnapshot((doc) => {
          if (doc.exists) {
              this.key = doc.id;
              this.client = doc.data();
              console.log(this.client);
          } else {
              // alert("No such document!");
          }
        })
            db.collection('users').doc(this.$route.params.id).onSnapshot((userDoc) =>{
          this.userEmail = userDoc.data().email
          })
      // ref.get().then((doc) => {
      //     if (doc.exists) {
      //         this.key = doc.id;
      //         this.client = doc.data();
      //         console.log(this.client);
      //     } else {
      //         alert("No such document!");
      //     }
      // }).then( () => {
      //     return db.collection('users').doc(this.$route.params.id).get().then((userDoc) =>{
      //     this.userEmail = userDoc.data().email
      //     })
      // })
     db.collection('users').doc(this.$route.params.id).collection('client-contacts').onSnapshot(res => {
        const changes = res.docChanges();
        changes.forEach(change => {
            if (change.type === 'added'){
              this.clientContacts.push({
                ...change.doc.data(),
                id: change.doc.id
              });
            }
        })
      })
    },
    methods: {
        edit() {
            const user = this.userInfo
            this.editClient = Object.assign({}, user)
            this.dialog = true
        },
        async submit() {
            if(this.$refs.form.validate()) {
                this.loading = true
                await this.$store.dispatch('updateUser', this.editClient)
                this.loading = false
                this.dialog = false
            }
        },
        submitContact(){
            db.collection('users').doc(this.$route.params.id).collection('client-contacts').doc().set({
                    name: this.contact.name,
                    email: this.contact.email,
                    phone: this.contact.phone,
                    address: this.contact.address,
                    position: this.contact.position,
            })   
        },
    },
}
</script>