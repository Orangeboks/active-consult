<template>
  <div class="documents">
    <v-container class="py-5">
      <v-row align="center">
        <v-col cols="8">
          <Breadcrumb :items="breadcrumb" />
          <h2 v-if="$vuetify.breakpoint.mdAndUp" class="black--text my-2">
            <span v-if="type == 'all'">All Documents</span>
            <span v-if="type != 'all'">Documents / <span v-if="type == 'monthly'">{{getMonth(month)}}</span></span>
            <span v-if="type == 'yearly'">{{year}}</span>
          </h2>
          <h4 v-if="$vuetify.breakpoint.smAndDown" class="black--text my-2">
            <span v-if="type == 'All'">All Documents</span>
            <span v-if="type != 'all'">Documents / <span v-if="type == 'monthly'">{{getMonth(month)}}</span>
            </span> <span v-if="type == 'yearly'">{{year}}</span></h4>
          <div class="d-flex">
            <p :class="type == 'all' ? 'active black--text link' : 'grey--text link'" @click="type = 'all'">All Documents</p>
            <p :class="type == 'monthly' ? 'active black--text pl-2 link' : 'grey--text pl-2 link'" @click="type = 'monthly'">Monthly Documents</p>
            <p :class="type == 'yearly' ? 'active black--text pl-2 link' : 'grey--text pl-2 link'" @click="type = 'yearly'">Annual Statements</p>
          </div>
        </v-col>
        <v-col cols="4" class="text-right" v-if="!loading">
            <v-btn depressed color="info" @click="addModal = !addModal">Upload Document</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="loading" class="my-5">
        <v-col cols="12" class="text-center">
            <v-progress-circular
                indeterminate
                color="info"
                size="40"
            ></v-progress-circular>
            <p class="mt-3 subtitle-2">Loading Documents...</p>
        </v-col>
      </v-row>

      <div v-if="type != 'all' && !loading">
        <div v-if="!client.id">
          <v-card v-if="!loading && documents.length" class="my-5">
            <v-row align="center" justify="center" no-gutters class="py-2">
              <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" style="border-right: 1px solid #ddd" align-self="center">
                  <div>
                      <v-icon color="info" size="35">mdi-cloud-upload</v-icon>
                  </div>
                  <div class="pl-4">
                    <p class="mb-n1">
                      <strong class="black--text text-capitalize">{{type}} Documents: </strong>
                      <span class="grey--text pl-3">{{getAllDocuments}} Total</span>
                    </p>
                  </div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                  <div>
                      <v-icon color="info" size="35">mdi-check-circle</v-icon>
                  </div>
                  <div class="pl-4">
                      <span class="grey--text text-sm text-capitalize">Processed</span>
                      <h1 class="black--text mt-n3">{{getAllProcessedDocuments}}</h1>
                  </div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                  <div>
                      <v-icon color="info" size="35">mdi-close-circle</v-icon>
                  </div>
                  <div class="pl-4">
                      <span class="grey--text text-sm text-capitalize">Unprocessed</span>
                      <h1 class="black--text mt-n3">{{getAllUnProcessedDocuments}}</h1>
                  </div>
              </v-col>
              <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                  <div>
                      <v-icon color="info" size="35">mdi-account-multiple</v-icon>
                  </div>
                  <div class="pl-4">
                      <span class="grey--text text-sm text-capitalize">Clients</span>
                      <h1 class="black--text mt-n3">{{getAllIndividualClients}}</h1>
                  </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
        
        <v-card class="mb-5" v-if="!client.id">
          <v-card-text>
            <v-row v-if="!loading">
              <v-col cols="12" md="9">
                <v-text-field
                    v-model.lazy="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    outlined
                    dense
                    hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-menu
                    v-if="type == 'monthly'"
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="month"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="month"
                        placeholder="Select Month"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        outlined
                        hide-details
                        dense
                        color="info"
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="month"
                        type="month"
                        color="info"
                        no-title
                        scrollable
                    >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(month)"
                    >
                        OK
                    </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-autocomplete outlined v-model="year" hide-details placeholder="Select Year" v-if="type == 'yearly'" dense :items="[2020, 2021]"></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-if="!client.id && !client.company">
          <div v-for="(item, index) in documents" :key="index">
              <v-row class="px-3 item" @click="getClientDocuments(item)">
                  <v-col cols="12" md="6">
                      <div class="grey--text pa-0 text-uppercase text-xs">Company Name</div>
                      <h4>{{ item.companyName }}</h4>
                  </v-col>
                  <v-col cols="4" md="2" class="text-md-center">
                      <div class="grey--text pa-0 text-uppercase text-xs">Total</div>
                      <strong>{{getTotalDocs(item.client_id)}}</strong>
                  </v-col>
                  <v-col cols="4" md="2" class="text-md-center">
                      <div class="grey--text pa-0 text-uppercase text-xs">Processed</div>
                      <v-icon color="green lighten-1" size="20">mdi-check-circle</v-icon><strong> {{getProcessedDocs(item.client_id)}}</strong>
                  </v-col>
                  <v-col cols="4" md="2" class="text-md-center">
                      <div class="grey--text pa-0 text-uppercase text-xs">Unprocessed</div>
                      <v-icon color="red lighten-1" size="20">mdi-close-circle</v-icon><strong> {{getUnProcessedDocs(item.client_id)}}</strong>
                  </v-col>
              </v-row>
              <v-divider></v-divider>
          </div>
        </v-card>

        <AllClientDocuments v-if="client.id && client.company" :client="client" @back="backToCients" />
        <!-- <v-data-table
          v-if="!loading && documents.length"
          :headers="headers"
          :items="documents"
          item-key="id"
        >
          <template v-slot:item.client_name="{ item }">
            <span class="underline info--text link" @click="$router.push('/client/'+item.client_id+'/documents')"><strong>{{item.companyName}}</strong></span>
          </template>
          <template v-slot:item.total="{ item }">
            {{getTotalDocs(item.client_id)}}
          </template>
          <template v-slot:item.processed="{ item }">
            {{getProcessedDocs(item.client_id)}}
          </template>
          <template v-slot:item.unprocessed="{ item }">
            {{getUnProcessedDocs(item.client_id)}}
          </template>
        </v-data-table> -->
      </div>

      <div v-if="type == 'all' && !loading">
        <AllDocuments />
      </div>

      <v-row v-if="!loading && !documents.length" class="my-5">
        <v-col cols="12" class="text-center">
            <p class="mt-3 info--text">No Document Found</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Upload Document Modal -->

    <v-dialog v-model="addModal" title="Upload Document" max-width="500" :scrollable="false" persistent>
      <v-card>
          <v-card-title class="d-flex">
              <h3 class="info--text">Upload Document</h3>
              <v-icon @click="addModal = !addModal" class="ml-auto">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="mt-4">
            <v-divider></v-divider>
              <v-row class="mt-4">
                  <v-col cols="12">
                      <v-autocomplete :items="getUsers" item-text="client_info.companyName" return-object v-model="document.client" placeholder="Select Client" color="info" outlined hide-details></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                      <v-text-field  v-model="document.category" hide-details placeholder="Category" color="info" outlined></v-text-field>
                  </v-col>
                  <v-col cols="12">
                      <v-select :items="['Processed', 'Unprocessed']"  v-model="document.status" hide-details placeholder="Status" color="info" outlined></v-select>
                  </v-col>
                  <v-col cols="12">
                      <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="document.month"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                      >
                          <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="document.month"
                              placeholder="Select Month"
                              prepend-inner-icon="mdi-calendar"
                              readonly
                              outlined
                              hide-details
                              color="info"
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                          </template>
                          <v-date-picker
                              v-model="document.month"
                              type="month"
                              color="info"
                              no-title
                              scrollable
                          >
                          <v-spacer></v-spacer>
                          <v-btn
                              text
                              color="primary"
                              @click="menu = false"
                          >
                              Cancel
                          </v-btn>
                          <v-btn
                              text
                              color="primary"
                              @click="$refs.menu.save(document.month)"
                          >
                              OK
                          </v-btn>
                          </v-date-picker>
                      </v-menu>
                  </v-col>
                  <v-col cols="12">
                      <v-file-input
                        outlined
                        color="info"
                        prepend-inner-icon="mdi-file"
                        @change="getPickedDocument"
                        label="Upload File"
                      ></v-file-input>
                  </v-col>
                  <v-col cols="12">
                      <v-btn block depressed color="info" @click="submitDocument" :disabled="createLoading">{{createLoading ? 'Uploading Document...' : 'Upload Document'}}</v-btn>
                  </v-col>
              </v-row>
          </v-card-text>
      </v-card>
  </v-dialog>
  </div>
</template>

<script>
// import moment from 'moment'
import Breadcrumb from '@/components/Breadcrumb'
import {mapActions, mapGetters} from 'vuex'
import AllDocuments from '@/components/Documents/AllDocuments'
import AllClientDocuments from '@/components/Documents/AllClientDocuments'
export default {
  name: "Documents",
  components: {
    Breadcrumb,
    AllDocuments,
    AllClientDocuments
  },
  computed: {
    ...mapGetters(["getUsers", "getDocuments", "getToast"]),
    getAllDocuments() {
      return this.clientDocs.length
    },
    getAllProcessedDocuments() {
      const docs = this.clientDocs.filter(doc => doc.status == 'Processed')
      return docs.length
    },
    getAllUnProcessedDocuments() {
      const docs = this.clientDocs.filter(doc => doc.status == 'Unprocessed')
      return docs.length
    },
    getAllIndividualClients() {
      return this.documents.length
    }
  },
  methods: {
    ...mapActions(['createDocument', 'fetchUsers', 'fetchDocuments', 'updateDocumentStatus', 'updateArchive']),
    getClientDocuments(doc) {
      this.client.id = doc.client_id
      this.client.company = doc.companyName
    },
    backToCients() {
      this.client.id = null
      this.client.company = null
    },
    async setClientDocuments() {
      const currentMonth = this.month.split('-')[1]
      const currentYear = this.year
      this.clientDocs = []
      if(this.type == 'all') {
        this.documents = this.getDocuments
        this.clientDocs = this.getDocuments
        return
      }
      await this.getDocuments.forEach(item => {
        let itemMonth = item.month.split('-')[1]
        let itemYear = item.month.split('-')[0]
        if(this.type == 'monthly') {
          if((itemMonth == currentMonth) && !item.isArchived) {
            this.clientDocs.push(item)
          }
        }
        if(this.type == 'yearly') {
          if((itemYear == currentYear) && !item.isArchived) {
            this.clientDocs.push(item)
          }
        }
        
      })
      this.documents = []
      if(this.clientDocs.length) {
        await this.clientDocs.forEach(item => {
          let doc = this.documents.find(cd => cd.client_id == item.client_id)
          if(!doc) {
            this.documents.push(item)
          }
        })
      }
      this.allDocs = this.documents
    },
    getTotalDocs(id) {
      const total = this.clientDocs.filter(doc => doc.client_id == id)
      return total.length
    },
    getProcessedDocs(id) {
      const processed = this.clientDocs.filter(doc => doc.client_id == id && doc.status == 'Processed')
      return processed.length
    },
    getUnProcessedDocs(id) {
      const unprocessed = this.clientDocs.filter(doc => doc.client_id == id && doc.status == 'Unprocessed')
      return unprocessed.length
    },
    getPickedDocument(e) {
      this.document.file.file_name = e.name
      this.document.file.file = e
    },
    submitDocument() {
      let documentData = Object.assign({}, this.document)
      if(!documentData.client) {
        this.$store.commit('setToast', {message: "Please Select Client", color: 'red', show: true})
        return
      }
      if(!documentData.category || documentData.category == "") {
        this.$store.commit('setToast', {message: "Please Enter Category", color: 'red', show: true})
        return
      }
      if(!documentData.month || documentData.month == "") {
        this.$store.commit('setToast', {message: "Please Select Month", color: 'red', show: true})
        return
      }
      if(!documentData.status) {
        this.$store.commit('setToast', {message: "Please Select Status", color: 'red', show: true})
        return
      }
      if(!documentData.file.file) {
        this.$store.commit('setToast', {message: "Please Pick Document File", color: 'red', show: true})
        return
      }
      documentData.companyName = documentData.client.client_info.companyName
      documentData.client_id = documentData.client.id
      delete documentData.client
      this.createLoading = true
      this.createDocument(documentData)
    },
  },
  created() {
    if(!this.getUsers.length) {
      this.fetchUsers()
    }
    if(!this.getDocuments.length) {
      this.loading = true
      this.fetchDocuments()
    }
    else {
      this.setClientDocuments()
    }
  },
  watch: {
    getDocuments(val) {
      if(val) {
        this.createLoading = false
        this.loading = false
        // this.json_data = this.documents
        this.addModal = false
        this.setClientDocuments()
      }
    },
    getToast(val) {
      if(val) {
        this.loading = false
      }
    },
    search(val) {
      if(val) {
        this.documents = this.allDocs.filter(doc => doc.companyName.toLowerCase().indexOf(val.toLowerCase()) >= 0)
      }
      else {
        this.documents = this.allDocs
      }
    },
    month() {
      this.setClientDocuments()
    },
    year() {
      this.setClientDocuments()
    },
    type() {
      this.setClientDocuments()
    }
  },
  data() {
    return {
      menu: false,
      type: 'all',
      month: new Date().getFullYear()+"-"+new Date().getMonth()+1,
      year: new Date().getFullYear(),
      addModal: false,
      createLoading: false,
      search: null,
      loading: false,
      headers: [
        { text: 'Client', sortable: true, value: 'client_name'},
        { text: 'Total', value: 'total', sortable: true },
        { text: 'Processed', value: 'processed', sortable: true },
        { text: 'Unprocessed', value: 'unprocessed', sortable: true }
      ],
      document: {
        client: null,
        category: null,
        month: null,
        status: null,
        isArchived: false,
        file: {
          file_name: null,
          file: null,
        },
      },
      documents: [],
      clientDocs: [],
      allDocs: [],
      breadcrumb: [
        {
            text: 'Dashboard',
            disabled: false,
            href: '/',
        },
        {
            text: 'Documents',
            disabled: true,
            href: '/documents',
        },
      ],
      client: {
        id: null,
        company: null
      }
    }
  }
};
</script>

<style scoped>
.documents {
  background: #f9f9f9;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
.active {
  padding-bottom: 2px;
  border-bottom: 3px solid #F2BA2D;
  font-weight: bold;
}
.link:hover {
  cursor: pointer;
}
.underline {
  text-decoration: underline;
}
.item {
    padding: 0;
    margin: 0;
    border-left: 2px solid #64CD8D;
}
.item:hover {
    cursor: pointer;
}
</style>
