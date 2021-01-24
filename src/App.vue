<template>
<!-- v-app is route component from Vuetify. All cuetify components should be nested inside. -->
  <v-app> 
   <MainNavigation v-if="!$route.meta.hideNavigation" />
      <v-snackbar
      v-if="toast"
      v-model="toast.show"
      :color="toast.color"
      top
      right
    >
      {{ toast.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="toast.show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
      <v-main class="">
        <router-view></router-view>
      </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import MainNavigation from  './components/MainNavigation'

export default {
  name: 'App',
  components: { MainNavigation },
  computed: {
    ...mapGetters(['getToast'])
  },
  data: () => ({
    toast: null,
  }),
  watch: {
    getToast(val) {
      if(val && val.show) {
        this.toast = val
      }
    }
  }
};
</script>

<style>
body {
  margin: 0 !important;
  padding: 0 !important;
}
.theme--light.v-icon {
  color: #4D97F3 !important;
}

/* .v-radio .v-icon.v-icon {
  font-size: 20px !important;
} */

.v-radio .v-label {
  font-size: 16px !important;
}

.v-tab {
  font-style: normal;
  text-transform: capitalize !important;
}

.v-breadcrumbs a.v-breadcrumbs__item {
  color: #9E9E9E !important;
}

.v-breadcrumbs {
  padding: 0 !important;
}

.text-sm {
  font-size: 13px;
}

.events-table th, .documents-table th {
  background: #E0F7FA !important;
  color: black !important;
  margin: 0;
}

.documents-table tr::after {
  border: none !important;
}

.text-xs {
  font-size: 10px;
}

.v-data-table__checkbox i.mdi-checkbox-blank-outline {
  /* border: 4px solid black !important; */
  border-radius: 50% !important;
}

</style>
