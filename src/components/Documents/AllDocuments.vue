<template>
  <div class="documents">
    <v-container class="mb-5">
      <!-- <v-row>
        <v-col cols="8">
        </v-col>
        <v-col cols="4" class="text-right" v-if="!loading">
            <v-btn depressed color="info" @click="addModal = !addModal">Upload Document</v-btn>
        </v-col>
      </v-row> -->

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

      <v-row v-if="!loading && !documents.length" class="my-5">
        <v-col cols="12" class="text-center">
            <p class="mt-3 info--text">No Document Found</p>
        </v-col>
      </v-row>

      <v-card v-if="!loading && documents.length">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search..."
                  outlined
                  color="grey"
                  class="grey--text"
                  dense
                  single-line
                  hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card>
        
      </v-card>
      <v-card class="mt-3">
        <v-row v-if="selected.length" no-gutters class="cyan lighten-5 pt-3">
          <v-col cols="12" class="d-flex">
            <v-btn color="grey" class="text-capitalize" text :disabled="isStatusUpdating" @click="archiveDocuments()"><v-icon color="grey lighten-1" class="pr-3">mdi-arrow-down</v-icon> Archive</v-btn>
            <download-excel
              class="btn btn-default"
              :data="selected"
              :fields="json_fields"
              worksheet="Archived Documents Worksheet"
              name="Archived Documents.xls"
            >
              <v-btn color="grey" class="text-capitalize" text :disabled="isStatusUpdating">Download</v-btn>
            </download-excel>
            <v-btn color="grey" class="text-capitalize" text :disabled="isStatusUpdating" @click="updateStaus('Processed')">Mark as processed</v-btn>
            <v-btn color="grey" class="text-capitalize" text :disabled="isStatusUpdating" @click="updateStaus('Unprocessed')">Mark as unprocessed</v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-data-table
              class="documents-table"
              
              v-if="!loading && documents.length"
              v-model="selected"
              :headers="headers"
              :items="documents"
              :search="search"
              :single-select="singleSelect"
              item-key="id"
              show-select
            >
              <template v-slot:item.file_name="{ item }">
                  <a :href="item.file_path" target="_blank"><strong>{{item.file_name}}</strong></a>
              </template>
              <template v-slot:item.month="{ item }">
                  {{getMonth(item.month)}}
              </template>
              <template v-slot:item.status="{ item }">
                  <v-chip :color="item.status == 'Processed' ? 'green' : 'red'" dark small>{{item.status}}</v-chip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

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
import {mapActions, mapGetters} from 'vuex'
export default {
  name: "AllDocuments",
  computed: {
    ...mapGetters(["getUsers", "getDocuments", "getToast"]),
  },
  methods: {
    ...mapActions(['createDocument', 'fetchUsers', 'fetchDocuments', 'updateDocumentStatus', 'updateArchive']),
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
    async updateStaus(status) {
      Promise.all(
        this.selected.map(async doc => {
            this.isStatusUpdating = true
            doc.status = status
            await this.updateDocumentStatus(doc)
        })
      )
    },

    async archiveDocuments() {
      Promise.all(
        this.selected.map(async doc => {
            this.isStatusUpdating = true
            doc.isArchived = true
            await this.updateArchive(doc)
        })
      )
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
        this.documents = this.getDocuments.filter(doc => !doc.isArchived)
        // Sorting in Ascending Order
        this.documents = this.documents.sort((a,b) => new Date(a.month) - new Date(b.month))
        this.json_data = this.documents
    }
  },
  watch: {
    getDocuments(val) {
      if(val) {
        this.createLoading = false
        this.loading = false
        this.documents = val.filter(doc => !doc.isArchived)
        // Sorting in Ascending Order
        this.documents = this.documents.sort((a,b) => new Date(a.month) - new Date(b.month))
        this.json_data = this.documents
        this.addModal = false
      }
    },
    getToast(val) {
      if(val) {
        this.createLoading = false
        this.loading = false
        this.isStatusUpdating = false
      }
    }
  },
  data() {
    return {
      menu: false,
      addModal: false,
      search: null,
      singleSelect: false,
      selected: [],
      loading: false,
      createLoading: false,
      isStatusUpdating: false,
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
      headers: [
        { text: 'File Name', sortable: true, value: 'file_name', width: '40%'},
        { text: 'Client', value: 'companyName', sortable: true },
        { text: 'Category', value: 'category', sortable: true },
        { text: 'Period', value: 'month', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
      ],
      json_data: [],
      documents: [],
      json_fields: {
        "File Name": "file_name",
        "File Path": "file_path",
        "Client Name": "companyName",
        "Category": "category",
        "Month": "month",
        "Status": "status"
      }
    }
  }
};
</script>
