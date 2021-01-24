<template>
    <div class="client-list">
        <v-row justify="center" align="center" v-if="!client.id">
            <v-col cols="12" md="10" lg="10">
                <v-card>
                    <v-card-text>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            placeholder="Search..."
                            color="grey"
                            class="grey--text"
                            outlined
                            single-line
                            dense
                            hide-details
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="10" lg="10">
                <v-card>
                    <div v-for="(event, index) in getClientEvents" :key="index">
                        <v-row class="px-3 item" @click="getClientEventList(event)">
                            <v-col cols="12" md="6">
                                <div class="grey--text pa-0 text-uppercase text-xs">Company Name</div>
                                <h4>{{ event.companyName }}</h4>
                            </v-col>
                            <v-col cols="4" md="2" class="text-md-center">
                                <div class="grey--text pa-0 text-uppercase text-xs">To Me</div>
                                <strong>{{toMe(event.user_id).length}}</strong>
                            </v-col>
                            <v-col cols="4" md="2" class="text-md-center">
                                <div class="grey--text pa-0 text-uppercase text-xs">Active</div>
                                <v-icon color="green lighten-1" size="20">mdi-chevron-right</v-icon><v-icon color="green lighten-1" class="ml-n4" size="20">mdi-chevron-right</v-icon><strong> {{active(event.user_id).length}}</strong>
                            </v-col>
                            <v-col cols="4" md="2" class="text-md-center">
                                <div class="grey--text pa-0 text-uppercase text-xs">Overdue</div>
                                <v-icon color="red lighten-1" size="20">mdi-bell-alert</v-icon><strong> {{overdue(event.user_id).length}}</strong>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="client.id">
            <v-col cols="12">
                <AllClientEvents :events="events" :client="client" @back="setAllClients" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import AllClientEvents from './AllClientEvents'
export default {
    name: "ClientList",
    props: {
        events: Array
    },
    components: {
        AllClientEvents
    },
    computed: {
        getClientEvents() {
            let eventArray = []
            if(this.events.length) {
                this.events.forEach(event => {
                    const found = eventArray.find(e => e.user_id == event.user_id)
                    if(!found) {
                        eventArray.push(event)
                    }
                })
            }
            if(this.search) {
                eventArray = eventArray.filter(e => e.companyName.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
            }
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.clientList = eventArray
            return this.clientList
        }
    },
    data() {
        return {
            clientList: [],
            search: null,
            client: {
                id: null,
                company: null,
            }
        }
    },
    methods: {
        getClientEventList(event) {
            this.client.id = event.user_id
            this.client.company = event.companyName
        },
        setAllClients() {
            this.client.id = null
            this.client.company = null
        },
        toMe(id) {
            return this.events.filter(e => e.user_id == id && e.user_id == this.getLoggedUser().id)
        },
        active(id) {
            return this.events.filter(e => e.user_id == id && e.status == 'Uncomplete')
        },
        overdue(id) {
            return this.events.filter(e => e.user_id == id && e.status == 'Overdue')
        }
    },

    // watch: {
    //     search(val) {
    //         if(val) {
    //             this.clientList = 
    //         }
    //         else {

    //         }
    //     }
    // }
}
</script>

<style scoped>
.item {
    padding: 0;
    margin: 0;
    border-left: 2px solid #64CD8D;
}
.item:hover {
    cursor: pointer;
}
</style>