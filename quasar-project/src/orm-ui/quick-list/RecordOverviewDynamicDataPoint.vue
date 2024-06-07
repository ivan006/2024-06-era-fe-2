<template>
    <div>
        <template v-if="dataPoint.xOrientation">
            <div class="">
                <div class="d-flex flex-row">
                    <div class="pr-2">
                        <!-- Content of the first column -->

                        <template v-if="!dataPoint.hideLabel">
                            <div
                                class="text-caption"
                                style="line-height: 1.6rem"
                            >
                                {{ compHeader.title }}:
                            </div>
                        </template>
                    </div>
                    <div>
                        <!-- Content of the second column -->
                        <component
                            :is="dataPoint.tag ? dataPoint.tag : 'div'"
                            :class="dataPoint.class ? dataPoint.class : ''"
                        >
                            <template
                                v-if="
                                    compHeader.usageType.startsWith(
                                        'relChildren'
                                    )
                                "
                            >
                                <div class="pt-1">
                                    <template v-if="compRelation">
                                        <SuperTable
                                            :currentParentRel="
                                                compRelation
                                            "
                                            :model="
                                                compRelation.field.meta.field
                                                    .related
                                            "
                                            :canEdit="superOptions.canEdit"
                                            :defaultViewModeProp="
                                                dataPoint.relationViewMode
                                                    ? dataPoint.relationViewMode
                                                    : 'table'
                                            "
                                        >
                                          <template v-if="!!$slots[compRelation.field.name]" #create>
                                            <slot :name="compRelation.field.name" />
                                          </template>
                                        </SuperTable>
                                    </template>
                                </div>
                            </template>
                            <template v-else>
                              <FormattedColumn
                                :header="compHeader"
                                :item="item"
                                :superOptions="superOptions"
                              />
                            </template>
                        </component>
                    </div>
                </div>
                <!--                                <v-card-text-->
                <!--                                    class="d-flex flex-column"-->
                <!--                                    style="height: 100%"-->
                <!--                                >-->

                <!--                                </v-card-text>-->
            </div>
        </template>
        <template v-else>
            <div class="d-flex flex-column" style="height: 100%">
                <template v-if="!dataPoint.hideLabel">
                    <div class="text-caption">
                        {{ compHeader.title }}
                    </div>
                </template>

                <!--<component :key="index" :is="dataPoint.tag" :class="dataPoint.class">-->
                <component
                    :is="dataPoint.tag ? dataPoint.tag : 'div'"
                    :class="dataPoint.class ? dataPoint.class : ''"
                >
                    <template
                        v-if="compHeader.usageType.startsWith('relChildren')"
                    >
                        <div class="pt-1">
                            <template v-if="compRelation">
                                <SuperTable
                                    :currentParentRel="
                                        compRelation
                                    "
                                    :model="
                                        compRelation.field.meta.field.related
                                    "
                                    :canEdit="superOptions.canEdit"
                                    :defaultViewModeProp="
                                        dataPoint.relationViewMode
                                            ? dataPoint.relationViewMode
                                            : 'table'
                                    "
                                >
                                  <template v-if="!!$slots[compRelation.field.name]" #create>
                                    <slot :name="compRelation.field.name" />
                                  </template>
                                </SuperTable>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <FormattedColumn
                            :header="compHeader"
                            :item="item"
                            :superOptions="superOptions"
                        />
                    </template>
                </component>
            </div>
        </template>
    </div>
</template>

<script>
import FormattedColumn from './FormattedColumn.vue'
import { defineAsyncComponent } from 'vue';
import RecordOverview from "./RecordOverview.vue";

export default {
    name: 'RecordOverviewDynamicDataPoint',
    components: {
      RecordOverview,
        SuperTable: defineAsyncComponent(() =>
          import('./SuperTable.vue')
        ),
        FormattedColumn,
    },
    props: {
        dataPoint: {
            type: Object,
            default() {
                return {}
            },
        },
        item: {
            type: Object,
            default() {
                return {}
            },
        },
        childRelations: {
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
    computed: {
        compHeader() {
            const result = this.superOptions.headers.find((header) => {
                return header.key == this.dataPoint.data
            })
            // console.log(this.dataPoint.data)
            // console.log("this.superOptions.headers")
            // console.log(this.superOptions.headers)
            // console.log(result)
            return result
        },
        compRelation() {
            let result = {}

            if (this.compHeader.usageType.startsWith('relChildren')) {
                result = this.childRelations.find((relation) => {
                    return relation.field.name == this.dataPoint.data
                })
            }

            return result
        },
    },
}
</script>

<style scoped></style>
