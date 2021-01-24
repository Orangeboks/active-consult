<template>
    <v-breadcrumbs :items="items" divider="/">
        <template v-slot:item="{ item }">
        <v-breadcrumbs-item
            active-class="grey--text"
            :to="item.href"
            :disabled="item.disabled"
        >
            {{ item.text }}
        </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: null
        }
    }
}
</script>