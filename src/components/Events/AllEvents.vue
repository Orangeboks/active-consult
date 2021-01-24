<template>
    <div class="all-events">
        <v-row align="center" justify="center">
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

        <v-row align="center" justify="center">
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
    </div>
</template>

<script>
import moment from 'moment'
import AllEventsList from '@/components/AccountingCalendar/AllEventsList'
import TodayEvents from '@/components/AccountingCalendar/TodayEvents'
import ThisWeekEvents from '@/components/AccountingCalendar/ThisWeekEvents'
import ThisMonthEvents from '@/components/AccountingCalendar/ThisMonthEvents'
// import CompleteEvents from '@/components/AccountingCalendar/CompleteEvents'
// import UncompleteEvents from '@/components/AccountingCalendar/UncompleteEvents'
export default {
    name: "AllEvents",
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
        headers: Array
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
        }
    },

    methods: {
        getDaysLeft(date) {
            const currentDate = moment()
            const eventDate = moment(date)

            const diff = eventDate.diff(currentDate, 'days')
            if(diff >= 0) {
                return diff
            } 
            return "Expired";
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
        if(this.events && this.events.length) {
            this.all_events = this.events
        }
    },

    watch: {
        events(val) {
            if(val && val.length) {
                this.all_events = val
            }
        },
        show(val) {
            if(val) {
                if(val == 'all') {
                    this.all_events = this.events
                }
                else {
                    this.all_events = this.events.filter(e => e.status == val)
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