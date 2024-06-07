<template>
    <div>
        <v-select
            :menu-props="{ offsetY: true }"
            :modelValue="modelValue"
            @update:modelValue="
                (e) => {
                    $emit('update:modelValue', e)
                }
            "
            :variant="variant"
            :density="density"
            :items="items"
            :label="modelField.label"
            :item-title="title.value"
            item-value="id"
            :disabled="disabledComp"
            :loading="loading"
            :readonly="readonly"
        >
            <template v-slot:prepend-item>
                <v-text-field
                    v-model="search"
                    label="Search"
                    density="compact"
                    variant="outlined"
                    single-line
                    hide-details
                    class="ma-2 mt-0 pa-0"
                ></v-text-field>
                <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:append-item>
                <div
                    v-if="showMoreButtonVisible"
                    @click="showMore"
                    class="text-center pa-2"
                >
                    Show More
                </div>
            </template>
        </v-select>
    </div>
</template>

<script>
import QuickListsHelpers from './QuickListsHelpers'

export default {
    name: 'SuperSelect',
    components: {},
    props: {
        modelValue: {
            type: [Number, Object],
            default() {
                return null
            },
        },
        filters: {
            type: String,
            default() {
                return '{}'
            },
        },
        model: {
            type: [Object, Function],
            required: true,
        },
        disabled: {
            type: Boolean,
            default() {
                return false
            },
        },
        modelField: {
            type: Object,
            default() {
                return {}
            },
        },
        displayMapField: {
            type: Boolean,
            default() {
                return false
            },
        },
        excludedCols: {
            type: Array,
            default() {
                return []
            },
        },
        readonly: {
            type: Boolean,
            default() {
                return false
            },
        },
        variant: {
            type: String,
            default() {
                return "outlined"
            },
        },
        density: {
            type: String,
            default() {
                return "compact"
            },
        },
        allowAll: {
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
            search: '',
            // filteredItems: [],
            pagination: {
                page: 1,
                limit: 5,
            },
            loading: false,
            noMoreShowMore: false,
            fetchedItems: [],
        }
    },
    computed: {
        disabledComp() {
            if (this.disabled || this.readonly) {
                return true
            } else {
                return false
            }
        },
        showMoreButtonVisible() {
            let result = true
            if (
                this.pagination.limit >= this.items.length ||
                this.noMoreShowMore
            ) {
                result = false
            }
            return result
        },
        quickListsIsMobile() {
            return QuickListsHelpers.quickListsIsMobile()
        },
        title() {
            const result = this.headers.find((header) => header.key !== 'id')
            return result
        },
        headers() {
            return QuickListsHelpers.SupaerTableHeaders(
                this.model,
                this.excludedCols,
                false,
                this.displayMapField
            )
        },
        items() {
            let result = []
            if (!this.disabled) {
                if (this.allowAll) {
                    result.push({
                        [this.title.value]: `All`,
                        id: null,
                    })
                }
                // const data = this.model
                //     .query()
                //     .where((item) => {
                //         return this.quickListsGetIfMatchesAllChecks(
                //             item,
                //             this.filtersComp
                //         )
                //     })
                //     .withAll()
                //     .get()
              const data = this.fetchedItems
                result = [...result, ...data]
            }
            return result
        },
        // displayedItems() {
        //     let itemsFilteredBySearch = this.items
        //     if (this.search) {
        //         itemsFilteredBySearch = itemsFilteredBySearch.filter((item) =>
        //             item[this.title.value]
        //                 .toLowerCase()
        //                 .includes(this.search.toLowerCase())
        //         )
        //     }
        //     return itemsFilteredBySearch.filter((item) =>
        //         this.quickListsGetIfMatchesAllChecks(item, JSON.parse(this.filters))
        //     )
        // },
        filtersComp() {
            const filters = JSON.parse(this.filters)
            let result = filters
            if (this.title.value && this.search) {
                result = {
                    ...filters,
                    [this.title.value]: this.search,
                }
            }
            return result
        },
    },
    methods: {
        showMore() {
            this.pagination.page = this.pagination.page + 1
            this.fetchData()
        },
        quickListsGetIfMatchesAllChecks(item, filters) {
            return QuickListsHelpers.quickListsGetIfMatchesAllChecks(item, filters)
        },
        async fetchData() {

            let linkables = []
            if (this.modelField.fieldExtras?.relationRules?.linkables){
              linkables = this.modelField.fieldExtras.relationRules.linkables(this.user)
            }

            this.loading = true

            const response = await this.model.FetchAll([], {
                  ...linkables,
                  order: 'id.desc',
              }, {
                  Prefer: 'count=exact',
              }, {
              page: this.pagination.page,
              limit: this.pagination.limit,
              filters: this.filtersComp,
              clearPrimaryModelOnly: false
            })
            if (response.response.data.length == 0) {
                this.noMoreShowMore = true
            }
            this.fetchedItems = response.response.data.data
            // this.pagination.totalItems = response.total // Assuming your API returns a total count
            this.loading = false
        },
        // filterItems() {
        //     this.filteredItems = this.displayedItems
        // },
    },
    watch: {
        // items: {
        //     immediate: true,
        //     handler() {
        //         this.filteredItems = this.items
        //     },
        // },
        filters() {
            if (!this.disabled) {
                this.fetchData()
            }
        },
        search() {
            if (!this.disabled) {
                this.fetchData()
            }
        },
    },
    mounted() {
        if (!this.disabled) {
            this.fetchData()
        }
    },
}
</script>

<style></style>
