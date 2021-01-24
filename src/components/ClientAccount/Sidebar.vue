<template>
    <v-card width="250" class="sidebar" height="100%" min-height="100vh" flat>
        <v-navigation-drawer v-model="show" absolute color="cyan lighten-5">
            <v-list-item class="px-2">
                <v-list-item-title>
                    <p class="pt-5 pl-2">{{user ? user.client_info.companyName : 'No'}}</p> 
                </v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>
            <v-list nav dense>
                <v-list-item link @click="redirect('company')">
                    <v-list-item-icon>
                    <v-icon color="red">mdi-account-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Company Information</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="redirect('documents')">
                    <v-list-item-icon>
                    <v-icon>mdi-file-document</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Documents</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="redirect('events')">
                    <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Accounting Calendar</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-icon>
                    <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Messages</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },

    computed: {
        user() {
            if(this.getLoggedUser()) {
                return this.getLoggedUser()
            }
            return null
        }
    },
  
  methods: {
    redirect (to) {
      this.$emit('redirect', { path: to })
    },
  }
}
</script>


