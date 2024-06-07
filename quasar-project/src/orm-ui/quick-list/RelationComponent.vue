<template>
    <div>
        <v-text-field
            @click="click"
            :label="configs.label"
            :modelValue="computedValue"
            :rules="configs.meta.rules"
            readonly
            :disabled="readonly"
            variant="underlined"
        ></v-text-field>
        <!--        <v-btn @click="showRelationDialog = true">{{-->
        <!--            displayNameField || 'Select'-->
        <!--        }}</v-btn>-->
        <v-dialog v-model="showRelationDialog" max-width="800px">
            <v-card>
                <v-card-title> Select Item </v-card-title>
                <v-card-text>
                    <!--              :model="selectedRelationModel"-->
                    <!--              @emitValue="setRelation"-->
                    <SuperTable
                        :isForSelectingRelation="true"
                        :canEdit="false"
                        :modelValue="modelValue"
                        @update:modelValue="input"
                        :model="configs.meta.relatedModel"
                    ></SuperTable>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { Attribute } from '@vuex-orm/core'
export default {
    name: 'RelationComponent',
    components: {
        SuperTable: () => import('./SuperTable.vue'),
    },
    props: {
        configs: {
            type: Object,
            default() {
                return {}
            },
        },
        // model: {
        //     type: Function,
        //     required: true,
        // },
        lookup: {
            type: Number,
            default() {
                return null
            },
        },
        modelValue: {
            type: Number,
            default() {
                return null
            },
        },
        readonly: {
            type: Boolean,
            default() {
                return false
            },
        },
    },
    data() {
        return {
            showRelationDialog: false,
            newlookup: {},
        }
    },
    computed: {
        isNullable() {
            return this.configs.meta.relatedModel.fields()[this.foreignKey]
                .isNullable
        },
        displayNameField() {
            const relatedModelFields = this.configs.meta.relatedModel.fields()
            return Object.keys(relatedModelFields).find(
                (fName) =>
                    fName !== 'id' &&
                    relatedModelFields[fName] instanceof Attribute
            )
        },
        computedValue() {
            let result = ''
            // if (this.lookup) {
            //     result = this.lookup?.[this.configs.meta.lookupDisplayField]
            // } else {
            //     result = this.newlookup?.[this.configs.meta.lookupDisplayField]
            // }

            const entities = this.configs.meta.relatedModel
                .query()
                .whereId(+this.modelValue)
                .get()
            if (entities.length) {
                result = entities[0][this.configs.meta.lookupDisplayField]
            }

            return result
        },
    },
    methods: {
        input(item) {
            this.newlookup = item
            // Set the relation based on the selected item
            // Close the relation dialog
            this.showRelationDialog = false

            this.$emit('update:modelValue', item.id)
        },
        click() {
            if (!this.readonly) {
                this.showRelationDialog = true
            }
        },
    },
    mounted() {},
}
</script>
