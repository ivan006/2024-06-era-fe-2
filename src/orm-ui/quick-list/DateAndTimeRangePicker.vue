<template>
    <div>
        <!-- Initial Text Area Input -->
        <v-textarea
            label="Select Date Range"
            readonly
            @click="showDialog = true"
            :modelValue="formattedValue"
            rows="2"
        >
            <template v-slot:append>
                <v-icon>mdi-calendar</v-icon>
            </template>
        </v-textarea>

        <!-- The Main Modal -->
        <v-dialog v-model="showDialog" max-width="500px">
            <v-card class="pa-4">
                <!-- Start Section -->
                <div>
                    <h3>Start</h3>

                    <!-- Start Date -->
                    <v-text-field
                        label="Start Date"
                        v-model="formattedStartDate"
                        readonly
                        @click="showStartDatePicker = true"
                        variant="underlined"
                    ></v-text-field>

                    <!-- Start Date Picker Modal -->
                    <v-dialog v-model="showStartDatePicker" max-width="290px">
                        <v-date-picker
                            v-model="startDate"
                            @update:modelValue="setDefaultStartTime"
                        ></v-date-picker>
                    </v-dialog>

                    <!-- Start Time -->
                    <v-text-field
                        label="Start Time"
                        v-model="formattedStartTime"
                        readonly
                        @click="showStartTimePicker = true"
                        variant="underlined"
                    ></v-text-field>

                    <!-- Start Time Picker Modal -->
                    <v-dialog v-model="showStartTimePicker" max-width="290px">
                        <v-time-picker v-model="startTime"></v-time-picker>
                    </v-dialog>
                </div>

                <!-- End Section -->
                <div>
                    <h3>End</h3>

                    <!-- End Date -->
                    <v-text-field
                        label="End Date"
                        v-model="formattedEndDate"
                        readonly
                        @click="showEndDatePicker = true"
                        variant="underlined"
                    ></v-text-field>

                    <!-- End Date Picker Modal -->
                    <v-dialog v-model="showEndDatePicker" max-width="290px">
                        <v-date-picker v-model="endDate"></v-date-picker>
                    </v-dialog>

                    <!-- End Time -->
                    <v-text-field
                        label="End Time"
                        v-model="formattedEndTime"
                        readonly
                        @click="showEndTimePicker = true"
                        variant="underlined"
                    ></v-text-field>

                    <!-- End Time Picker Modal -->
                    <v-dialog v-model="showEndTimePicker" max-width="290px">
                        <v-time-picker
                            v-model="endTime"
                            @update:modelValue="manuallyChangedEndTime"
                        ></v-time-picker>
                    </v-dialog>
                </div>

                <!-- OK Button -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="finalizeDateTimeRange"
                        >OK</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import 'moment-timezone'
import { String } from '@vuex-orm/core'

export default {
    data() {
        return {
            showDialog: false,
            showStartDatePicker: false,
            showEndDatePicker: false,
            showStartTimePicker: false,
            showEndTimePicker: false,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            selectedTimezone: 'Africa/Johannesburg', // default timezone
            duration: 120,
        }
    },
    props: {
        modelValue: {
            type: String,
            default: null,
        },
    },
    computed: {
        formattedValue() {
            let result = ''

            if (
                this.formattedStartDate &&
                this.formattedStartTime &&
                this.formattedEndTime
            ) {
                if (this.startDate === this.endDate) {
                    // Single day event
                    result = `${this.formattedStartDate} \n${this.formattedStartTime} - ${this.formattedEndTime} (${this.selectedTimezone})`
                } else {
                    // Multi-day event
                    result = `${this.formattedStartDate} ${this.formattedStartTime} -\n${this.formattedEndDate} ${this.formattedEndTime} (${this.selectedTimezone})`
                }
            }

            return result
        },
        formattedStartDate() {
            return this.startDate
                ? moment
                      .tz(this.startDate, this.selectedTimezone)
                      .format('dddd, MMMM D, YYYY')
                : ''
        },
        formattedEndDate() {
            return this.endDate
                ? moment
                      .tz(this.endDate, this.selectedTimezone)
                      .format('dddd, MMMM D, YYYY')
                : ''
        },
        formattedStartTime() {
            return this.startTime
                ? moment
                      .tz(this.startTime, 'HH:mm:ss', this.selectedTimezone)
                      .format('h:mm A')
                : ''
        },
        formattedEndTime() {
            return this.endTime
                ? moment
                      .tz(this.endTime, 'HH:mm:ss', this.selectedTimezone)
                      .format('h:mm A')
                : ''
        },

        dateTimeRange() {
            if (
                this.formattedStartDate &&
                this.formattedStartTime &&
                this.formattedEndTime
            ) {
                return `${this.formattedStartDate} \n ${this.formattedStartTime} - ${this.formattedEndTime} (Africa/Johannesburg)`
            }
            return null
        },
        pgDateTimeRange() {
            const startDateTime = moment(
                `${this.startDate} ${this.startTime}`
            ).format('YYYY-MM-DD HH:mm:ssZZ')
            const endDateTime = moment(
                `${this.endDate} ${this.endTime}`
            ).format('YYYY-MM-DD HH:mm:ssZZ')
            return `"[${startDateTime},${endDateTime}]"`
        },
    },
    methods: {
        parseTstzrange(value) {
            // [2023-09-16 20:00:00+02,2023-09-16 22:00:00+02]
            const matches = value.match(/\[(.*?),(.*)\]/)
            if (matches) {
                const startDateTime = moment.tz(
                    matches[1],
                    this.selectedTimezone
                )
                const endDateTime = moment.tz(matches[2], this.selectedTimezone)

                this.detectDuration(
                    startDateTime.format('HH:mm:ss'),
                    endDateTime.format('HH:mm:ss')
                )
                this.startDate = startDateTime.format('YYYY-MM-DD')
                this.startTime = startDateTime.format('HH:mm:ss')

                this.endDate = endDateTime.format('YYYY-MM-DD')
                this.endTime = endDateTime.format('HH:mm:ss')
            }
        },
        // updateValue(event) {
        //     // Emit the input event to inform the parent of the change.
        //     this.$emit('update:modelValue', event.target.value)
        // },
        setDefaultStartTime() {
            this.showStartDatePicker = false
            const now = moment.tz(this.selectedTimezone)

            // Set minutes, seconds, and milliseconds to 0 and add 1 hour
            now.minutes(0).seconds(0).milliseconds(0).add(1, 'hours')

            this.startTime = now.format('HH:mm:ss')

            this.endDate = this.startDate
        },
        getTimestampsForDatabase() {
            const startDateTime = moment
                .tz(
                    `${this.startDate} ${this.startTime}`,
                    this.selectedTimezone
                )
                .toISOString()
            const endDateTime = moment
                .tz(`${this.endDate} ${this.endTime}`, this.selectedTimezone)
                .toISOString()
            return `[${startDateTime}, ${endDateTime}]`
        },
        finalizeDateTimeRange() {
            const dateTimeRangeForDB = this.getTimestampsForDatabase()
            // Emit the value or use as needed
            this.$emit('update:modelValue', dateTimeRangeForDB)
            this.showDialog = false
        },
        manuallyChangedEndTime(input) {
            this.detectDuration(this.startTime, input)
        },
        detectDuration(startTime, endTime) {
            this.duration = moment(endTime, 'HH:mm:ss').diff(
                moment(startTime, 'HH:mm:ss'),
                'minutes'
            )
        },
    },
    watch: {
        startTime(newStartTime) {
            // Set the endTime based on the new startTime + duration
            this.endTime = moment(newStartTime, 'HH:mm:ss')
                .add(this.duration, 'minutes')
                .format('HH:mm:ss')
        },
    },
    mounted() {
        this.parseTstzrange(this.modelValue)
    },
}
</script>
