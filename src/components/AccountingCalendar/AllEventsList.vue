<template>
    <div class="all-events">
        <v-row no-gutters class="cyan lighten-5">
            <!-- <v-col cols="12">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    outlined
                    dense
                    class="cyan lighten-5"
                    single-line
                    hide-details
                ></v-text-field>
            </v-col> -->

            <v-col cols="12" class="d-flex" v-if="selected.length">
                <!-- <v-btn color="info" text><v-icon>mdi-arrow-down</v-icon> Archive</v-btn> -->
                <v-btn color="info" text @click="updateStatus('Complete')">Mark as complete</v-btn>
                <v-btn color="info" text @click="updateStatus('Uncomplete')">Mark as uncomplete</v-btn>
            </v-col>
        </v-row>

        <v-data-table
            class="events-table"
            v-model="selected"
            :headers="headers"
            :items="events"
            :search="search"
            :single-select="singleSelect"
            item-key="id"
            show-select
        >
            <template v-slot:item.assigned="{ item }">
                {{item.user_id != getLoggedUser().id ? item.companyName : 'Me'}}
            </template>
            <template v-slot:item.days_left="{ item }">
                <v-chip small :color="getDaysLeft(item.deadline_date) > -1 ? 'green' : 'red'" dark>{{getDaysLeft(item.deadline_date)}}</v-chip>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: "AllEventsList",
    props: {
        events: Array,
        headers: Array,
        search: String
    },
    data() {
        return {
            singleSelect: false,
            selected: [],
        }
    },

    methods: {
        getDaysLeft(date) {
            const currentDate = moment()
            const eventDate = moment(date)

            const diff = eventDate.diff(currentDate, 'days')
            return diff;
        },

        updateStatus(status) {
            const payload = {
                status: status,
                events: this.selected
            }

            this.$emit('updateStatus', payload)
        }
    }
}
</script>