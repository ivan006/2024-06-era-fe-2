<template>
    <div>
        <!--      <pre>{{headers}}</pre>-->
        <v-tabs v-model="activeTab">
            <v-tab :value="'tab'"> Overview </v-tab>
            <v-tab
                v-for="(relation, index) in filteredChildRelations"
                :key="index"
                :value="'tab-' + index"
            >
                {{ relation.field.label }}
            </v-tab>


        </v-tabs>
        <v-tabs-window v-model="activeTab">

          <v-tabs-window-item value="tab">
            <template
              v-if="model.displayMapFull && model.displayMapFull.rows"
            >
              <RecordOverviewDynamic
                :item="item"
                :childRelations="childRelations"
                :filteredChildRelations="filteredChildRelations"
                :superOptions="{
                    headers: headers,
                    modelFields: modelFields,
                    displayMapField: displayMapField,
                    model: model,
                    canEdit: canEdit,
                    currentParentRel: {},
                    user: user,
                }"
              >
                <template v-for="(slot, slotName) in $slots" v-slot:[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps"></slot>
                </template>
              </RecordOverviewDynamic>
            </template>
            <template v-else>
              <RecordOverview
                :item="item"
                :superOptions="{
                    headers: headers,
                    modelFields: modelFields,
                    displayMapField: displayMapField,
                    model: model,
                    canEdit: canEdit,
                    currentParentRel: {},
                    user: user,
                }"
              />
            </template>
            <!--              @deleteItem="deleteItem"-->
            <!--              @editItem="editItem"-->
            <!--              @clickRow="clickRow"-->
            <!--              :clickable="true"-->
          </v-tabs-window-item>
          <v-tabs-window-item
            v-for="(relation, index) in filteredChildRelations"
            :key="index"
            :value="'tab-' + index"
          >
                            <!--<pre>{{ relation.currentParentRecord.foreignKeyToParentRecord }}</pre>-->
            <SuperTable
              :ref="`tab-${index}`"
              :currentParentRel="relation"
              :model="relation.field.meta.field.related"
              :canEdit="canEdit"
              :user="user"
              :forcedFilters="filters(relation.currentParentRecord.foreignKeyToParentRecord)"
            >
              <template v-if="!!$slots[relation.field.name]" #create>
                <slot :name="relation.field.name" />
              </template>
            </SuperTable>
          </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script>
import SuperTable from './SuperTable.vue'
import RecordOverview from './RecordOverview.vue'
import QuickListsHelpers from './QuickListsHelpers'
// import LoginSession from '@/models/LoginSession'
import RecordOverviewDynamic from './RecordOverviewDynamic.vue'
import SuperTableList from "./SuperTableList.vue";

export default {
    name: 'SuperRecord',
    components: {
      SuperTableList,
        RecordOverviewDynamic,
        RecordOverview,
        SuperTable,
    },

    props: {
        model: {
            type: [Object, Function],
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
        displayMapField: {
            type: Boolean,
            default() {
                return false
            },
        },
        user: {
          type: Object,
          default() {
            return {}
          },
        },
    },
    data() {
        return {
            activeTab: null,
            // childRelations: [],
        }
    },
    computed: {
        rowsAndDataIndicators() {
            // const result = QuickListsHelpers.rowsAndDataIndicators(
            //     false,
            //     this.model,
            //     this.headers,
            //     this.childRelations
            // )
            // return result

            let result = {
                dataIndicators: [],
                rows: [],
            }
            if (this.model.displayMapFull && this.model.displayMapFull.rows) {
                result.rows = this.model.displayMapFull.rows
            }

            for (const rowKey in result.rows) {
                for (const col of result.rows[rowKey].cols) {
                    if (col.rows) {
                        for (const row of col.rows) {
                            for (const col2 of row.cols) {
                                if (col2.dataPoint.data) {
                                    result.dataIndicators.push(
                                        col2.dataPoint.data
                                    )
                                }
                            }
                        }
                    } else {
                        if (col.dataPoint.data) {
                            result.dataIndicators.push(
                                col.dataPoint.data
                            )
                        }
                    }
                }
            }

            return result
        },
        canEdit() {
          return true
            // return !!this.loginSession
        },
        childRelations() {
            const fields = QuickListsHelpers.computedAttrs(
                this.model,
                this.excludedCols
            )
            const result = []

            for (let fieldName in fields) {
                const field = fields[fieldName]
                if (field.usageType.startsWith('relChildren')) {
                    result.push({
                        field,
                        currentParentRecord: {
                            item: this.item,
                            model: this.model,
                            relationType: field.usageType,
                            foreignKeyToParentRecord:
                                field.meta.field.foreignKey,
                        },
                    })
                }
            }
            return result
        },
        filteredChildRelations() {
            let result = []
            for (const childRelation of this.childRelations) {
                if (
                    !this.rowsAndDataIndicators.dataIndicators.includes(
                        childRelation.field.name
                    )
                ) {
                    result.push(childRelation)
                }
            }
            return result
        },
        // loginSession() {
        //     return LoginSession.query().withAllRecursive().first()
        // },
        headers() {
            return QuickListsHelpers.SupaerTableHeaders(
                this.model,
                [],
                this.canEdit,
                this.displayMapField
            )
        },
        item() {
            const result = this.model
                .query()
                .whereId(this.id)
                .withAll()
                .get()[0]
            return result
        },
        modelFields() {
            const result = QuickListsHelpers.computedAttrs(
                this.model,
                this.excludedCols
            )
            return result
        },
    },
    methods: {
        getMsg(type) {
            let result = ''
            if (Array.isArray(type)) {
                if (type.length > 1) {
                    result = `To create first set your active ${type[0]} group and  active ${type[1]}  group`
                }
            } else {
                result = `To create first set your active ${type} group`
            }
            return result
        },
        filters(foreignKey) {
            let result = {}
            result[foreignKey] = this.id
            return result
        },
        // getChildRelations() {
        // },
        fetchData() {
            this.model
                .FetchById(
                    this.id,
                    [],
                    { flags: {}, moreHeaders: {}, rels: [] }
                )
                .then(() => {})
                .catch(() => {})
        },
    },
    mounted() {
        // this.getChildRelations()
        this.fetchData()
    },
    watch: {
        activeTab(newVal) {
            this.$nextTick(() => {
                if (this.$refs[newVal]) {
                    this.$refs[newVal][0].fetchData()
                }
            })
        },
    },
}
</script>

<style scoped></style>
