<template>
    <div class="account grey lighten-5">
        <v-row v-if="loading" class="py-5">
            <v-col cols="12" class="text-center">
                <v-progress-circular
                    indeterminate
                    color="info"
                    size="40"
                ></v-progress-circular>
                <p class="mt-3 subtitle-2">Loading Company Information...</p>
            </v-col>
        </v-row>
        <v-row v-if="!loading && !userInfo" class="py-5">
            <v-col cols="12" class="text-center">
                <p class="mt-3 info--text">No Company Found</p>
            </v-col>
        </v-row>
        <v-row no-gutters v-if="!loading && userInfo">
            <v-col cols="12" v-if="$vuetify.breakpoint.mdAndDown">
                <Menu @redirect="redirect" />
            </v-col>
            <v-col cols="2" lg="2" v-if="$vuetify.breakpoint.lgAndUp">
                <Sidebar :show="show" @redirect="redirect" />
            </v-col>
            <v-col cols="12" lg="10">
                <CompanyProfile :userInfo="userInfo" v-if="path == 'company'" />
                <div v-if="path == 'documents'" class="px-4 py-4">
                    <AllClientDocuments v-if="path == 'documents'" :client="client" :clientAccount="true" />
                </div>
                <div v-if="path == 'events'" class="px-4 py-4">
                    <AllClientEvents v-if="path == 'events'" :client="client" :events="events" :clientAccount="true" />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import Sidebar from '@/components/ClientAccount/Sidebar.vue'
import Menu from '@/components/ClientAccount/Menu.vue'
import CompanyProfile from '@/components/ClientAccount/CompanyProfile.vue'
import AllClientDocuments from '@/components/Documents/AllClientDocuments'
import AllClientEvents from '@/components/Events/AllClientEvents'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "ClientAccount",
    components: {
        Sidebar,
        Menu,
        CompanyProfile,
        AllClientDocuments,
        AllClientEvents
    },
    data() {
        return {
            loading: false,
            show: true,
            path: 'company',
            userInfo: null,
            client: {
                id: this.$route.params.id
            },
            events: []
        }
    },
    computed: {
        ...mapGetters(['getUsers', 'getEvents'])
    },
    methods: {
        ...mapActions(['fetchUsers', 'fetchEvents']),
        redirect (value) {
            this.path = value.path
        }
    },
    async created() {
        if(!this.getEvents.length) {
            this.fetchEvents()
        }
        else {
            this.events = this.getEvents.filter(event => event.user_id == this.$route.params.id)
        }

        if(!this.getUsers.length) {
            this.loading = true
            await this.fetchUsers()
            this.loading = false
        }
        else {
            const id = this.$route.params.id
            const user = this.getUsers.find(user => user.id == id)
            if(user && user.client_info) {
                this.userInfo = user
            }
            else {
                this.userInfo = null
            }
        }
    },
    watch: {
        getUsers(val) {
            if(val && val.length) {
                const id = this.$route.params.id
                const user = val.find(user => user.id == id)
                if(user && user.client_info) {
                    this.userInfo = user
                }
                else {
                    this.userInfo = null
                }
            }
        },
        getEvents(val) {
            if(val && val.length) {
                this.events = val.filter(event => event.user_id == this.$route.params.id)
            }
        }
    }
}
</script>

<style scoped>
.account {
    height: 100vh !important;
    max-height: 100vh !important;
}
</style>