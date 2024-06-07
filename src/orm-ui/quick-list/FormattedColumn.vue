<template>
    <div>
        <template v-if="header.usageType.startsWith('relChildren')"> </template>
        <template
            v-else-if="
                header.usageType == 'readOnlyTimestampType' ||
                header.usageType == 'timestampType' ||
                header.usageType == 'timeRangeStart' ||
                header.usageType == 'timeRangeEnd'
            "
        >
            {{ formatTimestamp(item[header.key]) }}
        </template>
        <template v-else-if="header.usageType == 'actions'">
          <div @click.stop :style="disabled() ? 'cursor: default;': ''">
            <v-btn
              @click.stop="editItem(item)"
              :disabled="disabled()"
              color="grey"
              icon="mdi-pencil"
              variant="plain"
              height="36px"
              width="36px"
            />
            <v-btn
              @click.stop="deleteItem(item)"
              :disabled="disabled()"
              color="grey"
              icon="mdi-delete"
              variant="plain"
              height="36px"
              width="36px"
            />
          </div>

            <template v-if="superOptions.canEdit">
                <v-dialog v-model="editItemData.showModal" max-width="800px" scrollable>
                    <CreateEditForm
                        title="Edit Item"
                        v-if="editItemData.showModal"
                        v-model="editItemData.data"
                        @submit="editItemSubmit"
                        @cancel="editItemData.showModal = false"
                        :superOptions="superOptions"
                    />
                </v-dialog>

                <v-dialog v-model="deleteItemData.showModal" max-width="600px">
                    <v-card>
                        <v-card-title> Delete Item </v-card-title>
                        <v-card-text> Delete item? </v-card-text>

                        <v-card-actions>
                            <v-btn @click="deleteItemData.showModal = false"
                                >Cancel</v-btn
                            >
                            <v-btn @click="deleteItemSubmit">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>
        </template>
        <template v-else-if="header.usageType.startsWith('relLookup')">
            <div style="min-height: 32px">
                <!--                {{header.key}}-->
                <!--                <pre>{{item}}</pre>-->
                <v-chip
                    v-if="
                        item?.[header.key]?.[header.meta.lookupDisplayField]
                    "
                    @click.stop="clickParent(item?.[header.key], header)"
                >
                    {{ item?.[header.key]?.[header.meta.lookupDisplayField] }}
                </v-chip>
            </div>
        </template>
        <template v-else>
            <template v-if="isTag">
              <v-chip v-if="isTag" @click.stop="clickParent(item)">
                {{ item[header.key] }}
              </v-chip>
            </template>
            <template v-else>
                <div :title="item[header.key]">
                  {{ truncateStr(item[header.key]) }}
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import moment from 'moment';
import 'moment-timezone';
// import LoginSession from '@/models/LoginSession'
import QuickListsHelpers from './QuickListsHelpers'
import CreateEditForm from './CreateEditForm.vue'

export default {
    name: 'FormattedColumn',
    components: { CreateEditForm },
    props: {
        isTag: {
            type: Boolean,
            default() {
                return false
            },
        },
        header: {
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
            deleteItemData: {
                showModal: false,
                data: null,
            },
            editItemData: {
                showModal: false,
                data: null,
            },
        }
    },
    computed: {
        // treatAsRealation() {
        //     let result = ['relationship']
        //     if (this.superOptions.displayMapField) {
        //         result.push('mapRelation')
        //     }
        //     return result
        // },
        // loginSession() {
        //     return LoginSession.query().withAllRecursive().first()
        // },
    },

    methods: {
      clickParent(item, header) {
        const model = header.meta.relatedModel
        model.openRecord(item[model.primaryKey])
      },
      truncateStr(str){
        let truncatedStr = ""
        if (str){
          const maxLength = 40;
          truncatedStr = str.length>maxLength ? str.substring(0, maxLength) + "..." : str;
        }
        return truncatedStr
      },
        disabled() {
          let result = false

          if (this.superOptions.model.rules?.editable){
            result = this.superOptions.model.rules.editable(
              this.superOptions.user,
              this.item
            )
          }
          return !result
        },
        // hasGroupBeingAppliedToEditPermissions() {
        //     // relForeignKeyOwnerCustomerType
        //     let result = false
        //     if (this.loginSession) {
        //         const providerKey = this.superOptions.modelFields.find((field) => {
        //             return (
        //                 field.usageType ==
        //                 'relForeignKeyOwnerAppliedToProviderType'
        //             )
        //         })
        //         if (providerKey) {
        //             result = this.providerGroupsTheyOwn.includes(
        //                 this.item[providerKey.name]
        //             )
        //
        //             const theirGroupThatOwnsRecord =
        //                 this.providerGroupsTheyOwn.find((item) => {
        //                     return item.id == this.item[providerKey.name]
        //                 })
        //             result = !!theirGroupThatOwnsRecord
        //         }
        //     }
        //     return result
        // },

        deleteItem(item) {
            this.deleteItemData.data = item
            this.deleteItemData.showModal = true
        },
        deleteItemSubmit() {
            this.superOptions.model.Delete(this.deleteItemData.data.id).then(() => {
                // Remove item from items array or refetch data
                this.fetchData()
            })
            this.deleteItemData.showModal = false
        },
        editItem(item) {
            this.editItemData.data = { ...item }
            this.editItemData.showModal = true
        },
        editItemSubmit() {
            const payload = QuickListsHelpers.preparePayload(
                this.editItemData.data,
                this.superOptions.modelFields
            )
            this.superOptions.model.Update(payload).then(() => {
                this.fetchData()
            })
            this.editItemData.showModal = false
        },
        formatTimestamp(timestamp) {
            if (timestamp) {
                const timezone = 'Africa/Johannesburg' // replace with desired timezone
                const formattedDateInTimeZone = moment
                    .tz(timestamp, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ', 'UTC')
                    .tz(timezone)
                    .format('dddd, MMMM D, YYYY h:mm A')
                return formattedDateInTimeZone
            } else {
                return null
            }
        },
    },
}
</script>

<style scoped></style>
