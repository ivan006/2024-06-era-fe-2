<template>
    <div>
      <!--<pre>{{flattenedHeadersHideMapField}}</pre>-->
        <v-data-table-server
            :mobile-breakpoint="0"
            @click:row="clickRow"
            :headers="flattenedHeadersHideMapField"
            :items="items"
            :itemsLength="+itemsLength"
            :page="optionsComputed.page"
            :items-per-page="optionsComputed.itemsPerPage"
            @update:options="(e)=>{$emit('update:options', e)}"
            v-model:sort-by="sortBy"
        >
            <template
                v-for="(header, index) in flattenedHeaders"
                v-slot:[`item.${header.key}`]="{ item }"
                :key="index"
            >
                <template v-if="header.isChildOf">
                    <div>
                        <FormattedColumn
                            :isTag="true"
                            :header="header"
                            :item="item[header.isChildOf.value]"
                            :superOptions="superOptions"
                        />
                    </div>
                </template>
                <template v-else>
                    <div>
                        <FormattedColumn
                            :header="header"
                            :item="item"
                            :superOptions="superOptions"
                        />
                    </div>
                </template>
            </template>
        </v-data-table-server>
    </div>
</template>

<script>
import FormattedColumn from './FormattedColumn.vue'
import CreateEditForm from "./CreateEditForm.vue";

export default {
    name: 'SuperTableTable',
    components: {CreateEditForm, FormattedColumn },

    props: {
        items: {
            type: Array,
            default() {
                return []
            },
        },
        options: {
            type: Object,
            default() {
                return {}
            },
        },
        itemsLength: {
            type: Number,
            default() {
                return null
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
            }
          },
        },
    },
  data(){
    return {
      sortBy: [{ key: this.pKey, order: 'asc' }]
    }
  },
    computed: {
        pKey() {
          return this.superOptions.model.primaryKey
        },
        optionsComputed: {
            get() {
                return this.options
            },
            set(value) {
                this.$emit('update:options', value)
            },
        },
        flattenedHeaders() {
            let result = []
            for (const header of this.superOptions.headers) {
                result.push(header)
                if (header.headerChildren) {
                    for (const childHeader of header.headerChildren) {
                        result.push({
                            // isChildOf: header,
                            ...childHeader,
                        })
                    }
                }
            }
            return result
        },
        flattenedHeadersHideMapField() {
            let result = []
            for (const header of this.flattenedHeaders) {
                if (!this.superOptions.superOptions) {
                    if (
                        !header.usageType.startsWith('relLookupMapExtra') &&
                        !header.usageType.startsWith('mapExtra')
                    ) {
                        result.push(header)
                    }
                } else {
                  result.push(header)
                }
            }
            return result
        },
    },
    methods: {
        updateOptions(e) {
            this.$emit('updateOptions', e)
        },
        deleteItem(e) {
            this.$emit('deleteItem', e)
        },
        editItem(e) {
            this.$emit('editItem', e)
        },
        clickRow(e, row) {
            this.$emit('clickRow', row.item)
        },
    },
    watch: {
        'editItemData.showModal'(arg) {
            if (!arg) {
                this.editItemData.data = {}
            }
        },
    },
}
</script>

<style scoped></style>
