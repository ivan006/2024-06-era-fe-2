<template>
    <div>
        <v-sheet tile height="54" class="d-flex">
            <v-select
                v-model="type"
                :items="types"
                density="compact"
                variant="outlined"
                hide-details
                class="ma-2"
                label="Type"
            ></v-select>

            <v-select
                v-model="mode"
                :items="modes"
                density="compact"
                variant="outlined"
                hide-details
                label="Event Overlap Mode"
                class="ma-2"
            ></v-select>

            <!--<v-select-->
            <!--    v-model="weekday"-->
            <!--    :items="weekdays"-->
            <!--    density="compact"-->
            <!--    variant="outlined"-->
            <!--    hide-details-->
            <!--    label="Weekdays"-->
            <!--    class="ma-2"-->
            <!--&gt;</v-select>-->
        </v-sheet>
        <!--<v-sheet tile height="54" class="d-flex">-->
        <!--    <v-btn icon class="ma-2" @click="$refs.calendar.prev()">-->
        <!--        <v-icon>mdi-chevron-left</v-icon>-->
        <!--    </v-btn>-->

        <!--    <v-spacer></v-spacer>-->
        <!--    <v-btn icon class="ma-2" @click="$refs.calendar.next()">-->
        <!--        <v-icon>mdi-chevron-right</v-icon>-->
        <!--    </v-btn>-->
        <!--</v-sheet>-->
        <v-sheet height="800">


          <vue-cal
            view="month"
            :events="myEvents"
            :editable-events="false"
            :indicators="true"
            @event-click="showEvent"
            :time-from="8 * 60"
            :time-to="22 * 60"
          />



        </v-sheet>
      <v-sheet height="800">

            <v-calendar
                ref="calendar"
                v-model="value"
                :weekdays="weekday"
                :view-mode="type"
                :events="events"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
                :event-color="getEventColor"
                @change="updateTimeWindow"
                :interval-start="8"
                :interval-duration="60"
                :intervals="14"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
            >


              <!--<template #event="{ event }">-->
              <!--  <div @click="showEvent(event)" style="cursor: pointer;">-->
              <!--    {{ event.name }}ddd-->
              <!--  </div>-->
              <!--  -->
              <!--</template>-->

              <template v-slot:day="{ date, day }">
                <div @click="showEvent(date)" class="day-cell">
                  {{ day }}
                </div>
              </template>
            </v-calendar>



        </v-sheet>

        <v-dialog v-model="viewItemData.showModal" max-width="800px">
            <v-card class="pt-4">
                <!--                <v-card-title> View item </v-card-title>-->
                <!--              <pre>{{superOptions.headers}}</pre>-->
                <v-card-text>
                    <RecordOverview
                        :item="viewItemData.data"
                        :superOptions="superOptions"
                    />
                </v-card-text>

                <v-card-actions>
                    <v-btn @click="clickRow(viewItemData.data)">Open</v-btn>
                    <v-btn @click="viewItemData.showModal = false"
                        >Cancel</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import moment from 'moment'

import QuickListsHelpers from './QuickListsHelpers'
import RecordOverview from './RecordOverview.vue'

import VueCal from 'vue-cal'
// import 'vue-cal/dist/vue-cal.css'
import 'vue-cal/dist/vuecal.css'

export default {
    name: 'SuperTableCalendar',
    components: {
      RecordOverview,
      VueCal,
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
    data: () => ({
        // test: {},
        type: 'week',
        types: ['month', 'week', 'day', '4day'],
        mode: 'stack',
        modes: ['stack', 'column'],
        weekday: [1, 2, 3, 4, 5, 6, 0],
        weekdays: [
            { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
            { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
            { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
            { title: 'Mon, Wed, Fri', value: [1, 3, 5] },
        ],
        value: [new Date()],
        // events: [
        //     {
        //         name: 'Meeting',
        //         start: new Date('2023-09-18T06:30:00.000Z'),
        //         end: new Date('2023-09-18T08:00:00.000Z'),
        //         color: 'deep-purple',
        //         timed: true,
        //     },
        // ],
        colors: [
            'blue',
            'indigo',
            'deep-purple',
            'cyan',
            'green',
            'orange',
            'grey darken-1',
        ],
        viewItemData: {
            showModal: false,
            data: {},
        },
    }),
    computed: {
        firstNonIdKey() {
            const key = Object.keys(this.superOptions.headers).find(
                (field) => this.superOptions.headers[field].value !== 'id'
            )
            const result = this.superOptions.headers[key].value
            return result
        },
        startFieldName() {
            let timeRangeStartField = this.superOptions.headers.find((field) => {
                return field.usageType == 'timeRangeStart'
            })
            if (!timeRangeStartField) {
                for (const modelField of this.superOptions.headers) {
                    if (modelField.headerChildren) {
                        timeRangeStartField = modelField.headerChildren.find(
                            (field) => {
                                return field.usageType == 'timeRangeStart'
                            }
                        )
                        timeRangeStartField = {
                            ...timeRangeStartField,
                            isChildOf: modelField,
                        }
                        break
                    }
                }
            }
            return timeRangeStartField
        },
        endFieldName() {
            let timeRangeEndField = this.superOptions.headers.find((field) => {
                return field.usageType == 'timeRangeEnd'
            })
            if (!timeRangeEndField) {
                for (const modelField of this.superOptions.headers) {
                    if (modelField.headerChildren) {
                        timeRangeEndField = modelField.headerChildren.find(
                            (field) => {
                                return field.usageType == 'timeRangeEnd'
                            }
                        )
                        timeRangeEndField = {
                            ...timeRangeEndField,
                            isChildOf: modelField,
                        }
                        break
                    }
                }
            }
            return timeRangeEndField
        },
        events() {
            let result = []
            if (this.startFieldName?.value) {
                for (const item of this.items) {
                    if (this.startFieldName.isChildOf) {
                        result.push({
                            title: item[this.firstNonIdKey],
                            start: new Date(
                                item[this.startFieldName.isChildOf.value][
                                    this.startFieldName.value
                                ]
                            ),
                            end: new Date(
                                item[this.startFieldName.isChildOf.value][
                                    this.endFieldName.value
                                ]
                            ),
                            color: 'deep-purple',
                            timed: true,
                            meta: item,
                        })
                    } else {
                        result.push({
                            title: item[this.firstNonIdKey],
                            start: new Date(item[this.startFieldName.value]),
                            end: new Date(item[this.endFieldName.value]),
                            color: 'deep-purple',
                            timed: true,
                            meta: item,
                        })
                    }
                }
            }
            return result
        },
        myEvents() {
            let result = []
            if (this.startFieldName?.value) {
                for (const item of this.items) {
                    if (this.startFieldName.isChildOf) {
                        result.push({
                            title: item[this.firstNonIdKey],
                            start: new Date(
                                item[this.startFieldName.isChildOf.value][
                                    this.startFieldName.value
                                ]
                            ),
                            end: new Date(
                                item[this.startFieldName.isChildOf.value][
                                    this.endFieldName.value
                                ]
                            ),
                            color: 'deep-purple',
                            timed: true,
                            meta: item,
                        })
                    } else {
                        result.push({
                            title: item[this.firstNonIdKey],
                            start: new Date(item[this.startFieldName.value]),
                            end: new Date(item[this.endFieldName.value]),
                            color: 'deep-purple',
                            timed: true,
                            meta: item,
                        })
                    }
                }
            }
            return result
        },
    },
    methods: {
        clickRow(e) {
          this.viewItemData.showModal = false
          this.$emit('clickRow', e)
        },
        updateTimeWindow() {},
        getEventColor(event) {
            return event.color
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        showEvent(m) {
            this.viewItemData.showModal = true
            this.viewItemData.data = m.meta
        },
        viewDay({ date }) {
            this.modelValue = date
            this.type = 'day'
        },
    },
    mounted() {
        if (QuickListsHelpers.quickListsIsMobile()) {
            this.type = 'day'
        }
    },
}
</script>

<style scoped></style>
