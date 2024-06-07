<template>
    <div>
        <!--        <pre>{{ modelValue }}</pre>-->
        <!-- Read-only input to display selected value and open the dropdown -->
        <!--    <v-text-field-->
        <!--        readonly-->
        <!--        v-model="formattedValue"-->
        <!--        prepend-icon="mdi-calendar"-->
        <!--        @click="menu = !menu"-->
        <!--    />-->

        <!-- Dropdown with selectors -->

        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            :nudge-top="25"
            offset-y
        >
            <template v-slot:activator="{ props }">
                <div v-bind="props">
                    <!--                  label="Vicinity"-->
                    <v-text-field
                        label="Place Filter"
                        type="text"
                        :modelValue="displayPlace"
                        readonly
                        density="compact"
                        variant="outlined"
                        placeholder="All"
                    />
                </div>
            </template>

            <v-card>
                <v-card-text>
                    <template v-for="childFilter of filterField.children">
                        <template
                            v-if="
                                childFilter.usageType.startsWith(
                                    'relForeignKeyMapExtraRel'
                                )
                            "
                        >
                            <div :key="childFilter.name" class="ma-2">
                                <SuperSelect
                                    allowAll
                                    v-if="
                                        typeof filtersData[childFilter.name] !==
                                        'undefined'
                                    "
                                    :modelField="childFilter"
                                    :model="childFilter.meta.relatedModel"
                                    :filters="getFilters(childFilter)"
                                    v-model="filtersData[childFilter.name]"
                                    :disabled="
                                        filterParentName(childFilter) &&
                                        !modelValue[filterParentName(childFilter)]
                                    "
                                    @update:modelValue="
                                        handleSelectChange(childFilter.name)
                                    "
                                    :user="user"
                                />
                            </div>
                        </template>
                    </template>

                    <!-- OK Button -->
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="menu = false">OK</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import SuperSelect from './SuperSelect.vue'
import QuickListsHelpers from './QuickListsHelpers'
import SuperTableTable from "./SuperTableTable.vue";

export default {
    name: 'FilterPlace',
    components: {SuperTableTable, SuperSelect },
    props: {
        filterField: {
            type: Object,
            default() {
                return {}
            },
        },
        modelValue: {
            type: Object,
            default() {
                return {}
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
            placeFieldLevelTypes: [
                'relForeignKeyMapExtraRelCountry',
                'relForeignKeyMapExtraRelAdminArea1',
                'relForeignKeyMapExtraRelAdminArea2',
                'relForeignKeyMapExtraRelLocality',
                'relForeignKeyMapExtraRelSublocality',
            ],
            parentRelationships: {
                relForeignKeyMapExtraRelCountry: null,
                relForeignKeyMapExtraRelAdminArea1:
                    'relForeignKeyMapExtraRelCountry',
                relForeignKeyMapExtraRelAdminArea2:
                    'relForeignKeyMapExtraRelAdminArea1',
                relForeignKeyMapExtraRelLocality:
                    'relForeignKeyMapExtraRelAdminArea2',
                relForeignKeyMapExtraRelSublocality:
                    'relForeignKeyMapExtraRelLocality',
            },
            menu: false,
            filtersData: [],
        }
    },
    computed: {

        // filterValues() {
        //   let result = []
        //   for (const childFilter of this.filterField.children) {
        //     if (childFilter.usageType.startsWith('mapExtraRel')){
        //       result.push({
        //         ...childFilter,
        //         vModelValue: this.filtersData[childFilter.name]
        //       })
        //     }
        //   }
        //   return result
        // },
        displayPlace() {
            let displayText = ''
            const placeFields = this.filterField.children

            for (let placeFieldLevelType of this.placeFieldLevelTypes) {
                let placeField = placeFields.find(
                    (placeField) => placeField.usageType === placeFieldLevelType
                )

                if (
                    placeField &&
                    this.filtersData[placeField.name] &&
                    this.filtersData[placeField.name]
                ) {

                    // Use Vuex to fetch the display name
                    let displayName = this.fetchDisplayNameFromVuex(
                        placeField.meta.relatedModel,
                        this.filtersData[placeField.name]
                    )
                    // Store the displayName only if it exists
                    if (displayName) {
                        displayText = displayName
                    }
                }
            }

            return displayText
        },
    },
    methods: {
        handleSelectChange(fieldName) {
            // Once a change is detected, reset the child filters
            const changedField = this.filterField.children.find(
                (child) => child.name === fieldName
            )

            if (changedField) {
                const childTypes = this.getChildFields(changedField.usageType)
                for (let childType of childTypes) {
                    const childField = this.filterField.children.find(
                        (child) => child.usageType === childType
                    )
                    if (childField && this.filtersData[childField.name]) {
                        // this.$set(this.filtersData, childField.name, null)
                        this.filtersData[childField.name] = null;

                    }
                }
            }
        },
        getChildFields(modelFieldType) {
            const index = this.placeFieldLevelTypes.indexOf(modelFieldType)
            if (
                index === -1 ||
                index === this.placeFieldLevelTypes.length - 1
            ) {
                return [] // return empty array if the type isn't found or it's the last in the list
            }
            return this.placeFieldLevelTypes.slice(index + 1)
        },
        fetchDisplayNameFromVuex(model, id) {
            let result = 'PlaceholderName'
            const data = model.query().whereId(id).first()
            result = data[this.title(model).name]
            return result
        },
        title(model) {
            const computedAttrs = QuickListsHelpers.computedAttrs(model)
            const result = computedAttrs.find((header) => header.name !== 'id')
            return result
        },
        filterParentName(modelField) {
            const parentRelationships = this.parentRelationships
            const parentType = parentRelationships[modelField.usageType]
            let filterParentName = null
            if (parentType) {
                const parent = this.filterField.children.find(
                    (field) => field.usageType == parentType
                )
                if (parent) {
                    filterParentName = parent.name
                }
            }
            return filterParentName
        },
        getFilters(modelField) {
            const filterParentName = this.filterParentName(modelField)
            const result = this.modelValue[filterParentName]
                ? {
                      parent_id: this.modelValue[filterParentName],
                  }
                : {}
            return JSON.stringify(result)
        },
    },
    mounted() {
        // this.$set(this, 'filtersData', this.modelValue)
        this.filtersData = this.modelValue;
    },
    watch: {
        filtersData: {
            handler() {
                console.log("handler")
                this.$emit('update:modelValue', this.filtersData)
            },
            deep: true,
        },
    },
}
</script>

<style scoped></style>
