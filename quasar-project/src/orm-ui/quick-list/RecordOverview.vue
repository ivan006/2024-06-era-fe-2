<template>
    <div :style="clickable ? 'cursor: pointer' : ''" @click="clickRow(item)">
        <template v-for="(header, index) in superOptions.headers">
            <div
                :key="header.name"
                v-if="
                    header.key !== 'id' &&
                    (index < maxFields || header.type == 'actions')
                "
                style="min-height: 1.375rem"
            >
                <template v-if="index < 2">
                    <template v-if="superOptions.headers[0].value == 'id'">
                        <template v-if="index == 0"></template>
                        <template v-else>
                            <v-card-title>
                                <FormattedColumn
                                    :header="header"
                                    :item="item"
                                    :superOptions="superOptions"
                                />
                            </v-card-title>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="index == 0">
                            <v-card-title>
                                <FormattedColumn
                                    :header="header"
                                    :item="item"
                                    :superOptions="superOptions"
                                />
                            </v-card-title>
                        </template>
                        <template v-else>
                            <v-card-text>
                                <div class="text-caption">
                                    {{ header.title }}
                                </div>
                                <FormattedColumn
                                    :key="index"
                                    :header="header"
                                    :item="item"
                                    :superOptions="superOptions"
                                />
                            </v-card-text>
                        </template>
                    </template>
                </template>
                <template v-else>
                    <v-card-text>
                        <div class="text-caption">
                            {{ header.title }}
                        </div>
                        <FormattedColumn
                            :key="index"
                            :header="header"
                            :item="item"
                            :superOptions="superOptions"
                        />
                    </v-card-text>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import FormattedColumn from './FormattedColumn.vue'

export default {
    name: 'RecordOverview',
    components: { FormattedColumn },
    props: {
        clickable: {
            type: Boolean,
            default() {
                return false
            },
        },
        maxFields: {
            type: Number,
            default() {
                return 999
            },
        },

        item: {
          type: Object,
          default() {
            return {}
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
}
</script>

<style scoped></style>
