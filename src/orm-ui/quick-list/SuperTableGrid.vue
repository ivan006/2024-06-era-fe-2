<template>
    <div>
        <v-row class="fill-height ma-n2" justify="center">
            <template v-for="item of items" :key="item.name">
                <v-col cols="12" md="3" class="pa-2">
                    <v-card class="mx-auto" style="height: 100%;">
                        <template v-if="superOptions.model.displayMapSummary && superOptions.model.displayMapSummary.rows">
                            <RecordOverviewDynamic
                                :item="item"
                                @clickRow="clickRow"
                                :clickable="true"
                                :maxFields="6"
                                :childRelations="[]"
                                isSummary
                                :superOptions="superOptions"
                            />
                        </template>
                        <template v-else>
                            <RecordOverview
                                :item="item"
                                @clickRow="clickRow"
                                :clickable="true"
                                :maxFields="6"
                                :superOptions="superOptions"
                            />
                        </template>
                    </v-card>
                </v-col>
            </template>
        </v-row>
        <template v-if="!items.length">
            <div style="text-align: center">No data available</div>
        </template>
    </div>
</template>

<script>
import RecordOverview from './RecordOverview.vue'
import RecordOverviewDynamic from './RecordOverviewDynamic.vue'
// import QuickListsHelpers from './QuickListsHelpers'

export default {
    name: 'SuperTableGrid',
    components: {
        RecordOverview,
        RecordOverviewDynamic,
    },
    props: {
        items: {
            type: Array,
            default() {
                return []
            },
        },
        superOptions: {
          type: Object,
          default() {
            return {
              headers: [],
              modelFields: [],
              displayMapField: false,
              model: {},
              canEdit: false,
              currentParentRecord: {},
              user: {},
            }
          },
        },
    },
    methods: {
        deleteItem(e) {
            this.$emit('deleteItem', e)
        },
        editItem(e) {
            this.$emit('editItem', e)
        },
        clickRow(e) {
            this.$emit('clickRow', e)
        },
    },
    mounted() {
        // console.log(this.superOptions.model.displayMapSummary)
    },
    computed: {
        // rowsAndDataIndicators() {
        //     return QuickListsHelpers.rowsAndDataIndicators(
        //         true,
        //         this.superOptions.model,
        //         this.headers,
        //         []
        //     )
        // },
    }
}
</script>

<style scoped></style>
