<template>
    <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="10">
            <v-card>
                <v-row align="center" justify="center" no-gutters class="py-2">
                    <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                        <div>
                            <v-icon color="info" size="35">mdi-update</v-icon>
                        </div>
                        <div class="pl-4">
                            <span class="grey--text text-xs">UPCOMING</span>
                            <h1 class="black--text mt-n3">{{upcoming.length}}</h1>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                        <div>
                            <v-icon color="info" size="35">mdi-bell-alert</v-icon>
                        </div>
                        <div class="pl-4">
                            <span class="grey--text text-xs">OVERDUE</span>
                            <h1 class="black--text mt-n3">{{overdue.length}}</h1>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                        <div>
                            <v-icon color="info" size="35">mdi-face-agent</v-icon>
                        </div>
                        <div class="pl-4">
                            <span class="grey--text text-xs">TO ME</span>
                            <h1 class="black--text mt-n3">{{toMe.length}}</h1>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" class="d-flex align-center justify-center" align-self="center">
                        <div>
                            <v-icon color="info" size="35">mdi-account-multiple</v-icon>
                        </div>
                        <div class="pl-4">
                            <span class="grey--text text-xs">CLIENTS</span>
                            <h1 class="black--text mt-n3">{{clients.length}}</h1>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "EventStats",
    props: {
        events: Array
    },
    computed: {
        upcoming() {
            return this.events.filter(e => e.status == 'Uncomplete')
        },
        overdue() {
            return this.events.filter(e => e.status == 'Overdue')
        },
        toMe() {
            const id = this.getLoggedUser().id
            return this.events.filter(e => e.user_id == id)
        },
        clients() {
            let clientArray = []
            if(this.events.length) {
                this.events.forEach(element => {
                    const client = clientArray.find(c => c == element.user_id)
                    if(!client) {
                        clientArray.push(element.user_id)
                    }
                });
            }
            return clientArray
        }
    }
}
</script>