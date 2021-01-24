<template>
    <v-card class="menu py-4" color="grey lighten-4" flat>
        <v-card-text>
            <v-btn color="info" text @click="redirect('company')">
                <v-icon color="red">mdi-account-box</v-icon> Profile
            </v-btn>
            <v-btn color="info" class="ml-2" text @click="redirect('documents')">
                <v-icon color="red">mdi-file-document</v-icon> Documents
            </v-btn>
            <v-btn color="info" class="ml-2" text @click="redirect('events')">
                <v-icon color="red">mdi-calendar</v-icon> Events
            </v-btn>
            <v-btn color="info" class="ml-2" text>
                <v-icon color="red">mdi-email</v-icon> Messages
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'Menu',
  
  methods: {
    redirect (to) {
      this.$emit('redirect', { path: to })
    },
  }
}
</script>


