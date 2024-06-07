<template>

    <v-card>
        <v-card-title> {{ title }} </v-card-title>
        <v-card-text>
            <v-form ref="editForm">
                <template v-for="field in superOptions.modelFields" :key="field.name">
                    <div>
                        <!--                          <pre>{{field.usageType}}</pre>-->
                        <!--                            <pre>{{ field }}</pre>-->
                        <!--                            <pre>{{ itemData[field.name] }}</pre>-->
                        <template v-if="field.dataType === 'uid'">
                        </template>
                        <template
                            v-else-if="field.usageType.startsWith('rel')"
                        >
                            <template
                                v-if="
                                    field.usageType.startsWith('relLookup')
                                "
                            >
                                <!--                                                  <RelationComponent-->
                                <!--                                                      :configs="field"-->
                                <!--                                                      v-model="itemData[field.name]"-->
                                <!--                                                  ></RelationComponent>-->
                            </template>
                            <template
                                v-else-if="
                                    field.usageType.startsWith(
                                        'relForeignKeyNormal'
                                    )
                                "
                            >
                                <!--                              <pre>{{field.usageType }}</pre>-->
                                <!--                              <pre>{{field.dataType}}</pre>-->
                                <!--                                    <RelationComponent-->
                                <!--                                        :configs="field"-->
                                <!--                                        v-model="itemData[field.name]"-->
                                <!--                                    ></RelationComponent>-->

                                <SuperSelect
                                    :modelField="field"
                                    v-model="itemData[field.name]"
                                    :model="field.meta.relatedModel"
                                    variant="underlined"
                                    density="default"
                                    :user="superOptions.user"
                                />
                            </template>

                            <template
                                v-else-if="
                                    field.usageType.startsWith(
                                        'relForeignKeyMapExtraRel'
                                    )
                                "
                            >
                                <RelationComponent
                                    :configs="field"
                                    v-model="itemData[field.name]"
                                    readonly
                                ></RelationComponent>
                            </template>
                            <!--<template-->
                            <!--    v-else-if="-->
                            <!--        field.usageType == 'relForeignKeyCreatorType'-->
                            <!--    "-->
                            <!--&gt;-->
                            <!--    &lt;!&ndash;                                  class="ma-2 flex-grow-1 is-flex"&ndash;&gt;-->
                            <!--    <SuperSelect-->
                            <!--        allowAll-->
                            <!--        :modelField="field"-->
                            <!--        :modelValue="loginSession.user.person[0].id"-->
                            <!--        :model="field.meta.relatedModel"-->
                            <!--        readonly-->
                            <!--        variant="underlined"-->
                            <!--        density="default"-->
                            <!--        :user="superOptions.user"-->
                            <!--    />-->
                            <!--</template>-->
                            <!--<template-->
                            <!--    v-else-if="-->
                            <!--        field.usageType == 'relForeignKeyOwnerProviderType'-->
                            <!--    "-->
                            <!--&gt;-->
                            <!--    <SelectAssociatedProvider-->
                            <!--        v-model="itemData[field.name]"-->
                            <!--        :readonly="-->
                            <!--            superOptions.currentParentRel.currentParentRecord && superOptions.currentParentRel.currentParentRecord.model.name == 'DBProviderGroup'-->
                            <!--        "-->
                            <!--        :rules="field.meta.rules"-->
                            <!--    />-->
                            <!--</template>-->
                            <!--<template-->
                            <!--    v-else-if="-->
                            <!--        field.usageType == 'relForeignKeyOwnerApprovedByProviderType'-->
                            <!--    "-->
                            <!--&gt;-->
                            <!--    <SelectGroupsUserOwns-->
                            <!--        v-model="itemData[field.name]"-->
                            <!--        :whiteList="[superOptions.currentParentRel.currentParentRecord.item.id]"-->
                            <!--        :label="field.label"-->
                            <!--    />-->
                            <!--    &lt;!&ndash;                                  readonly&ndash;&gt;-->
                            <!--    <template-->
                            <!--        v-if="-->
                            <!--            currentParentRecordRelationType !==-->
                            <!--            'relChildrenChildrenApplicationType'-->
                            <!--        "-->
                            <!--    >-->
                            <!--    </template>-->
                            <!--</template>-->
                            <!--<template-->
                            <!--    v-else-if="-->
                            <!--        field.usageType == 'relForeignKeyOwnerCustomerType'-->
                            <!--    "-->
                            <!--&gt;-->
                            <!--    <SelectAssociatedCustomer-->
                            <!--        v-model="itemData[field.name]"-->
                            <!--        :readonly="-->
                            <!--            superOptions.currentParentRel.currentParentRecord && superOptions.currentParentRel.currentParentRecord.model.name == 'DBCustomerGroup'-->
                            <!--        "-->
                            <!--        :rules="field.meta.rules"-->
                            <!--    />-->
                            <!--</template>-->
                            <template
                                v-else-if="
                                    field.usageType == 'relForeignKeyOwnerAppliedToProviderType'
                                "
                            >
                                <SuperSelect
                                    :modelField="field"
                                    v-model="itemData[field.name]"
                                    :model="field.meta.relatedModel"
                                    readonly
                                    variant="underlined"
                                    density="default"
                                    :user="superOptions.user"
                                />
                            </template>

                            <template
                                v-else-if="
                                    field.usageType.startsWith(
                                        'relChildren'
                                    )
                                "
                            >
                            </template>

                            <template v-else>
                                <RelationComponent
                                    :configs="field"
                                    v-model="itemData[field.name]"
                                ></RelationComponent>
                            </template>
                        </template>

                        <template
                            v-else-if="field.usageType == 'timeRangeType'"
                        >
                            <DateAndTimeRangePicker
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                            />
                        </template>
                        <template
                            v-else-if="field.usageType == 'timeRangeStart'"
                        >
                            <DateAndTimePicker
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                                @update:modelValue="setDefaultForEndTime"
                            />
                        </template>
                        <template
                            v-else-if="field.usageType == 'timeRangeEnd'"
                        >
                            <DateAndTimePicker
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                            />
                        </template>
                        <template
                            v-else-if="field.usageType == 'timestampType'"
                        >
                            <DateAndTimePicker
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                            />
                        </template>
                        <template
                            v-else-if="
                                field.usageType == 'readOnlyTimestampType'
                            "
                        >
                            <DateAndTimePicker
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                                disabled
                            />
                        </template>
                        <template v-else-if="field.usageType === 'mapName'">
                            <SearchGooglePlace
                                :configs="field"
                                v-model="itemData[field.name]"
                                @change="searchGooglePlace"
                            />
                        </template>
                        <template
                            v-else-if="
                                field.usageType.startsWith('mapExtra')
                            "
                        >
                            <v-text-field
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                                disabled
                                style="display: none"
                                variant="underlined"
                            ></v-text-field>
                        </template>
                        <template v-else-if="field.usageType == 'normal'">
                            <template v-if="field.dataType === 'string'">
                                <v-text-field
                                    :label="field.label"
                                    v-model="itemData[field.name]"
                                    :rules="field.meta.rules"
                                    variant="underlined"
                                ></v-text-field>
                            </template>
                            <template
                                v-else-if="field.dataType === 'boolean'"
                            >
                                <v-checkbox
                                    :label="field.label"
                                    v-model="itemData[field.name]"
                                    :rules="field.meta.rules"
                                ></v-checkbox>
                            </template>
                            <template
                                v-else-if="field.dataType === 'number'"
                            >
                                <v-text-field
                                    :label="field.label"
                                    v-model="itemData[field.name]"
                                    :rules="field.meta.rules"
                                    type="number"
                                    variant="underlined"
                                ></v-text-field>
                            </template>
                            <template v-else-if="field.dataType === 'attr'">
                                <v-text-field
                                    :label="field.label"
                                    v-model="itemData[field.name]"
                                    :rules="field.meta.rules"
                                    variant="underlined"
                                ></v-text-field>
                            </template>
                        </template>
                        <template v-else>
                            <v-text-field
                                :label="field.label"
                                v-model="itemData[field.name]"
                                :rules="field.meta.rules"
                                variant="underlined"
                            ></v-text-field>
                        </template>
                    </div>
                </template>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-btn @click="cancel">Cancel</v-btn>
            <v-btn @click="editItemSubmit" :disabled="loading">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import RelationComponent from './RelationComponent.vue'
import DateAndTimeRangePicker from './DateAndTimeRangePicker.vue'
import DateAndTimePicker from './DateAndTimePicker.vue'
import moment from 'moment'
import SearchGooglePlace from './SearchGooglePlace.vue'
import QuickListsHelpers from './QuickListsHelpers'
// import DBVenueCountry from '@/models/DBVenueCountry'
// import DBVenueState from '@/models/DBVenueState'
// import DBVenueSubstate from '@/models/DBVenueSubstate'
// import DBVenueTown from '@/models/DBVenueTown'
// import DBVenueSuburb from '@/models/DBVenueSuburb'
// import LoginSession from '@/models/LoginSession'
import SuperSelect from './SuperSelect.vue'
// import SelectGroupsUserOwns from '@/views/global/SelectGroupsUserOwns.vue'
// import SelectAssociatedProvider from '@/views/global/selects/SelectAssociatedProvider.vue'
// import SelectAssociatedCustomer from '@/views/global/selects/SelectAssociatedCustomer.vue'

export default {
    name: 'CreateEditForm',
    components: {
        // SelectAssociatedCustomer,
        // SelectAssociatedProvider,
        // SelectGroupsUserOwns,
        SuperSelect,
        SearchGooglePlace,
        DateAndTimePicker,
        DateAndTimeRangePicker,
        RelationComponent,
    },
    props: {
        title: {
            type: String,
            default() {
                return ''
            },
        },
        modelValue: {
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
    data() {
        return {
            itemData: {},
            loading: false,
        }
    },
    computed: {
        // currentParentRecordRelationType() {
        //     let result = null
        //     if (this.superOptions.currentParentRel?.currentParentRecord) {
        //         result = this.superOptions.currentParentRel.currentParentRecord.relationType
        //     }
        //     return result
        // },
        // currentParentRecordforeignKeyToParentRecord() {
        //     let result = null
        //     if (this.superOptions.currentParentRel?.currentParentRecord) {
        //         result = this.superOptions.currentParentRel.currentParentRecord.foreignKeyToParentRecord
        //     }
        //     return result
        // },
        // loginSession() {
        //     return LoginSession.query().withAllRecursive().first()
        // },
        placeFieldsWithFieldNames() {
            let result = []
            const mapName = this.superOptions.modelFields.find((field) => {
                return field.usageType == 'mapName'
            })

            if (mapName) {
                for (const placeFieldType of QuickListsHelpers.mapPlaceFields()) {
                    const placeField = this.superOptions.modelFields.find((field) => {
                        return field.usageType == placeFieldType.flag
                    })
                    if (placeField) {
                        result.push({
                            ...placeFieldType,
                            fieldNames: placeField.name,
                        })
                    }
                }
            }
            return result
        },
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        editItemSubmit() {
            if (this.$refs.editForm.validate()) {
                this.$emit('submit')
            }
        },
        setDefaultForEndTime(arg) {
            const timeRangeEndField = this.superOptions.modelFields.find((field) => {
                return field.usageType == 'timeRangeEnd'
            })

            this.itemData[timeRangeEndField.name] = moment(arg)
                .add(2, 'hours')
                .toISOString()
        },
        async upsertAndGetEntityIds(googlePlace) {
          // todo: fix the below
            // // Assume Upsert returns a promise that resolves with the upserted entity.
            // let parent_id = null
            //
            // // Mapping of flags to Vuex ORM Models.
            // const flagToModel = {
            //     relForeignKeyMapExtraRelCountry: DBVenueCountry,
            //     relForeignKeyMapExtraRelAdminArea1: DBVenueState,
            //     relForeignKeyMapExtraRelAdminArea2: DBVenueSubstate,
            //     relForeignKeyMapExtraRelLocality: DBVenueTown,
            //     relForeignKeyMapExtraRelSublocality: DBVenueSuburb,
            //     test: this.superOptions.model,
            // }
            // let allValues = []
            // let result = []
            // for (const placeField of QuickListsHelpers.mapPlaceFields()) {
            //     if (placeField.googleType === 'components') {
            //         let component
            //         if (Array.isArray(placeField.googleName)) {
            //             // Find the first available sublocality level
            //             for (const name of placeField.googleName) {
            //                 component = googlePlace.address_components.find(
            //                     (item) => item.types.includes(name)
            //                 )
            //                 if (component) break
            //             }
            //         } else {
            //             component = googlePlace.address_components.find(
            //                 (item) => item.types.includes(placeField.googleName)
            //             )
            //         }
            //
            //         let finalValue = ''
            //         if (component) {
            //             finalValue = component.long_name
            //         } else {
            //             if (
            //                 placeField.flag ===
            //                 'relForeignKeyMapExtraRelSublocality'
            //             ) {
            //                 // If sublocality is not found, default to the most granular available
            //                 finalValue =
            //                     allValues['relForeignKeyMapExtraRelLocality']
            //             } else if (
            //                 placeField.flag ===
            //                 'relForeignKeyMapExtraRelAdminArea2'
            //             ) {
            //                 // If administrative_area_level_2 is not found, duplicate it from administrative_area_level_1
            //                 finalValue =
            //                     allValues['relForeignKeyMapExtraRelAdminArea1']
            //             } else if (
            //                 placeField.flag ===
            //                 'relForeignKeyMapExtraRelLocality'
            //             ) {
            //                 // If locality is not found, set to "Unknown"
            //                 finalValue = 'Unknown'
            //             } else {
            //                 finalValue = null
            //             }
            //         }
            //         allValues[placeField.flag] = finalValue
            //
            //         if (flagToModel[placeField.flag]) {
            //             // Extract the data for this entity from the example data.
            //             let data = {
            //                 name: finalValue, // Set the data.
            //             }
            //             if (
            //                 placeField.flag !==
            //                 'relForeignKeyMapExtraRelCountry'
            //             ) {
            //                 data.parent_id = parent_id // Set the parent id.
            //             }
            //             // Perform the Upsert operation.
            //             const responce = await flagToModel[
            //                 placeField.flag
            //             ].Upsert(data)
            //             // Extract the id from the result for use as parent_id in the next iteration.
            //             parent_id = responce.response.data[0].id
            //             result[placeField.flag] = parent_id
            //         }
            //     }
            // }
            // return result
        },
        async searchGooglePlace(arg) {
          // todo: fix the below
            // this.loading = true
            // const entitiesIds = await this.upsertAndGetEntityIds(arg)
            // for (const placeField of this.placeFieldsWithFieldNames) {
            //     if (placeField.googleType === 'simple') {
            //         this.itemData[placeField.fieldNames] =
            //             arg[placeField.googleName]
            //     } else if (placeField.googleType === 'mapGeoLoc') {
            //         if (arg.geometry?.location?.[placeField.googleName]) {
            //             this.itemData[placeField.fieldNames] =
            //                 arg.geometry.location[placeField.googleName]()
            //         }
            //     } else if (placeField.googleType === 'components') {
            //         this.itemData[placeField.fieldNames] =
            //             entitiesIds[placeField.flag]
            //     }
            // }
            // this.loading = false
        },
    },
    mounted() {
        this.itemData = this.modelValue

        const creatorKey = this.superOptions.modelFields.find((field) => {
            return field.usageType == 'relForeignKeyCreatorType'
        })
        // if (creatorKey) {
        //     this.itemData[creatorKey.name] = this.loginSession.user.person[0].id
        // }
        // this.itemData[creatorKey] = this.loginSession.user.person[0].id

        // const ownerProviderTypeKey = this.superOptions.modelFields.find((field) => {
        //     return field.usageType == 'relForeignKeyOwnerProviderType'
        // })
        // if (ownerProviderTypeKey) {
        //     this.itemData[ownerProviderTypeKey.name] =
        //         this.loginSession?.enabled_provider_group_id
        // }
    },
    watch: {
        // itemData: {
        //     handler(newValue) {
        //         this.$emit('update:modelValue', newValue)
        //     },
        //     deep: true,
        // },
    },
}
</script>

<style scoped></style>
