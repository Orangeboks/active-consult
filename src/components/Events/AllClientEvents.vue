<template>
    <div class="all-events">
        <v-row align="center" justify="center" v-if="clientAccount">
            <v-col cols="12" md="10" lg="10" class="d-flex justify-space-between" >
                <h3>All Client Events</h3>
                <v-btn color="info" depressed @click="addModal = !addModal">Add Event</v-btn>
            </v-col>
        </v-row>
        <v-row align="center" justify="center">
            <v-col cols="12" md="10" lg="10" v-if="client.company">
                <v-card color="grey lighten-3">
                    <v-card-text class="d-flex justify-space-between">
                        <h3 class="blac--text">{{client.company}}</h3>
                        <v-btn text small class="text-capitalize" color="info" @click="$emit('back', 1)"><v-icon>mdi-chevron-left</v-icon> Go back to all clients</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="10" lg="10" v-if="events.length">
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

                        <v-row align="center" justify="center" no-gutters>
                            <v-col cols="12" md="2" lg="1">
                                <p class="info--text mr-3 mt-4"><strong>Show:</strong></p>
                                
                            </v-col>
                            <v-col cols="12" md="10" lg="11">
                                <v-radio-group row mandatory v-model="show" hide-details class="info--text">
                                    <v-radio color="info" class="text-xs info--text" value="all" label="All" ></v-radio>
                                    <v-radio color="info" class="text-xs info--text" value="Complete" label="Completed"></v-radio>
                                    <v-radio color="info" class="text-xs info--text" value="Uncomplete" label="Uncompleted"></v-radio>
                                    <v-radio color="info" class="text-xs info--text" value="Overdue" label="Overdue"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row align="center" justify="center" v-if="events.length">
            <v-col cols="12" md="10">
                <v-card>
                    <v-row class="cyan lighten-5 px-5" no-gutters>
                        <v-col cols="12" class="d-flex py-3">
                            <p class="text-sm pt-1">Period: </p>
                            <ul>
                                <li :class="type == 'all' ? 'info--text' : 'grey--text'" @click="type = 'all'">All</li>
                                <li :class="type == 'today' ? 'info--text' : 'grey--text'" @click="type = 'today'">Today</li>
                                <li :class="type == 'weekly' ? 'info--text' : 'grey--text'" @click="type = 'weekly'">This Week</li>
                                <li :class="type == 'monthly' ? 'info--text' : 'grey--text'" @click="type = 'monthly'">This Month</li>
                            </ul>
                        </v-col>
                        <!-- <v-col cols="12" class="d-flex" v-if="selected.length">
                            <v-btn color="info" class="text-capitalize" text @click="updateStatus('Complete')">Mark as complete</v-btn>
                            <v-btn color="info" class="text-capitalize" text @click="updateStatus('Uncomplete')">Mark as uncomplete</v-btn>
                        </v-col> -->
                    </v-row>
                        <AllEventsList v-if="type == 'all'" :events="all_events" :headers="headers" :search="search" />
                        <TodayEvents v-if="type == 'today'" :events="all_events" :headers="headers" :search="search" />
                        <ThisWeekEvents v-if="type == 'weekly'" :events="all_events" :headers="headers" :search="search" />
                        <ThisMonthEvents v-if="type == 'monthly'" :events="all_events" :headers="headers" :search="search" />
                        <!-- <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="all_events"
                            :search="search"
                            :single-select="singleSelect"
                            item-key="id"
                            show-select
                        >
                            <template v-slot:item.days_left="{ item }">
                                {{getDaysLeft(item.deadline_date)}}
                            </template>
                        </v-data-table> -->
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="text-center">
                <p class="info--text">No Client Event Found</p>
            </v-col>
        </v-row>

        <v-dialog v-model="addModal" title="Add Event" max-width="500" :scrollable="false" persistent>
            <v-card>
                <v-card-title class="d-flex">
                    <h3 class="info--text">Add Event</h3>
                    <v-icon @click="addModal = !addModal" class="ml-auto">mdi-close</v-icon>
                </v-card-title>
                <v-card-text class="mt-4">
                    <v-divider></v-divider>
                    <v-row class="mt-4">
                        <v-col cols="12">
                            <v-text-field placeholder="Event Name" color="info" v-model="event.name" outlined hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-select :items="['Complete', 'Uncomplete', 'Overdue']"  v-model="event.status" hide-details placeholder="Status" color="info" outlined></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="event.deadline_date"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="event.deadline_date"
                                    placeholder="Deadline Date"
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
                                    v-model="event.deadline_date"
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
                                    @click="$refs.menu.save(event.deadline_date)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12">
                            <v-autocomplete :items="getUsers" v-model="event.user" return-object item-text="client_info.companyName" placeholder="Select Client" color="info" outlined hide-details></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea placeholder="Description" v-model="event.description" color="info" outlined hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-btn block depressed color="info" @click="submitEvent" :disabled="createLoading">{{createLoading ? 'Adding Event...' : 'Add Event'}}</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import AllEventsList from '@/components/AccountingCalendar/AllEventsList'
import TodayEvents from '@/components/AccountingCalendar/TodayEvents'
import ThisWeekEvents from '@/components/AccountingCalendar/ThisWeekEvents'
import ThisMonthEvents from '@/components/AccountingCalendar/ThisMonthEvents'
import { mapActions, mapGetters } from 'vuex'
// import CompleteEvents from '@/components/AccountingCalendar/CompleteEvents'
// import UncompleteEvents from '@/components/AccountingCalendar/UncompleteEvents'
export default {
    name: "AllClientEvents",
    computed: {
        ...mapGetters(['getToast', 'getUsers'])
    },
    components: {
        AllEventsList,
        TodayEvents,
        ThisWeekEvents,
        ThisMonthEvents,
        // CompleteEvents,
        // UncompleteEvents
    },
    props: {
        events: Array,
        client: Object,
        clientAccount: Boolean
    },
    data() {
        return {
            search: null,
            singleSelect: false,
            selected: [],
            show: "all",
            type: "all",
            all_events: [],
            events_copy: [],
            headers: [
                { text: 'Event', sortable: true, value: 'name', width: '30% '},
                { text: 'Client', value: 'companyName', sortable: true },
                { text: 'Assigned to', value: 'assigned', sortable: true },
                { text: 'Until', value: 'deadline_date', sortable: true },
                { text: 'Days Left', value: 'days_left', sortable: true },
            ],
            addModal: false,
            event: {
                name: null,
                deadline_date: null,
                status: null,
                user: null,
                isArchived: false,
                description: null,
            },
            createLoading: false,
            menu: false,
        }
    },

    methods: {
        ...mapActions(['createEvent', 'fetchUsers']),
        getDaysLeft(date) {
            const currentDate = moment()
            const eventDate = moment(date)

            const diff = eventDate.diff(currentDate, 'days')
            if(diff >= 0) {
                return diff
            } 
            return "Expired";
        },

        async submitEvent() {
            let eventData = Object.assign({}, this.event)
            if(!eventData.user) {
                this.$store.commit('setToast', {message: "Please Select User.", color: 'red', show: true})
                return
            }
            if(!eventData.name || eventData.name == "") {
                this.$store.commit('setToast', {message: "Please Enter Event Name.", color: 'red', show: true})
                return
            }
            if(!eventData.deadline_date || eventData.deadline_date == "") {
                this.$store.commit('setToast', {message: "Please Select Deadline Date.", color: 'red', show: true})
                return
            }
            if(!eventData.status) {
                this.$store.commit('setToast', {message: "Please Select Status", color: 'red', show: true})
                return
            }
            if(!eventData.description) {
                this.$store.commit('setToast', {message: "Please Enter Description", color: 'red', show: true})
                return
            }
            eventData.companyName = eventData.user.client_info.companyName
            eventData.user_id = eventData.user.id
            delete eventData.user
            this.createLoading = true
            this.createEvent(eventData)
        },

        updateStatus(status) {
            const payload = {
                status: status,
                events: this.selected
            }

            this.$emit('updateStatus', payload)
        }
    },

    created() {
        if(!this.getUsers.length) {
            this.fetchUsers()
        }
        if(this.events && this.events.length) {
            this.all_events = this.events.filter(event => event.user_id == this.client.id)
        }
    },

    watch: {
        getToast() {
            this.createLoading = false
            this.addModal = false
        },
        events(val) {
            if(val && val.length) {
                this.all_events = val.filter(event => event.user_id == this.client.id)
            }
        },
        show(val) {
            if(val) {
                if(val == 'all') {
                    this.all_events = this.events.filter(event => event.user_id == this.client.id)
                }
                else {
                    this.all_events = this.events.filter(e => e.status == val && e.user_id == this.client.id)
                }
                
            }
        },
        type() {
            // if(this.type == 'today') {
            //     const today = moment().format('YYYY-MM-DD')
            //     this.all_events = this.events.filter(e => e.deadline_date == today)
            // }
            // if(this.type == 'monthly') {
            //     const today = moment().format('YYYY-MM-DD')
            //     this.all_events = this.events.filter(e => e.deadline_date == today)
            // }
        }
        
    }
}
</script>

<style scoped>
.arrow {
    margin-right: -20px !important;
}

p {
    margin: 0 !important;
}
ul li {
    list-style-type: none;
    display: inline-flex;
    padding-right: 10px;
    font-size: 13px;
    margin: 0;
}
li:hover {
    cursor: pointer;
}
</style>