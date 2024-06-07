<template>
    <div>
        <!-- Initial Text Area Input -->
        <v-textarea
            :label="label"
            readonly
            @click="click"
            :modelValue="formattedValue"
            rows="1"
            :disabled="disabled"
            variant="underlined"
        >
            <template v-slot:append>
                <v-icon>mdi-calendar</v-icon>
            </template>
        </v-textarea>

        <!-- The Main Modal -->
        <v-dialog v-model="showDialog" max-width="500px">
            <v-card class="pa-4">
                <h3>Select Date & Time</h3>

                <!-- Date -->
                <v-text-field
                    label="Date"
                    v-model="formattedDate"
                    readonly
                    @click="showDatePicker = true"
                    variant="underlined"
                ></v-text-field>

                <!-- Date Picker Modal -->
                <v-dialog v-model="showDatePicker" max-width="290px">
                    <v-card class="">
                        <v-date-picker
                            v-model="selectedDate"
                            @update:modelValue="setDefaultStartTime"
                        />
                        <div class="pa-4" style="text-align: right">
                            <v-btn
                                color="primary"
                                @click="showDatePicker = false"
                                >OK</v-btn
                            >
                        </div>
                    </v-card>
                </v-dialog>

                <!-- Time -->
                <v-text-field
                    label="Time"
                    v-model="formattedTime"
                    readonly
                    @click="showTimePicker = true"
                    variant="underlined"
                ></v-text-field>

                <!-- Time Picker Modal -->
                <v-dialog v-model="showTimePicker" max-width="290px">
                    <v-card class="">
                        <v-time-picker v-model="selectedTime"></v-time-picker>
                        <div class="pa-4" style="text-align: right">
                            <v-btn
                                color="primary"
                                @click="showTimePicker = false"
                                >OK</v-btn
                            >
                        </div>
                    </v-card>
                </v-dialog>

                <!-- OK Button -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="finalizeDateTime">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moment from 'moment'
import 'moment-timezone'

export default {
    name: 'DateAndTimePicker',
    data() {
        return {
            showDialog: false,
            showDatePicker: false,
            showTimePicker: false,
            selectedDate: null,
            selectedTime: null,
            selectedTimezone: 'Africa/Johannesburg', // default timezone
        }
    },
    props: {
        modelValue: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        formattedValue() {
            if (this.formattedDate && this.formattedTime) {
                return `${this.formattedDate} ${this.formattedTime} (${this.selectedTimezone})`
            }
            return ''
        },
        formattedDate() {
            const result = this.selectedDate
                ? moment
                      .tz(this.selectedDate, this.selectedTimezone)
                      .format('dddd, MMMM D, YYYY')
                : ''
          return result
        },
        formattedTime() {
            return this.selectedTime
                ? moment
                      .tz(this.selectedTime, 'HH:mm:ss', this.selectedTimezone)
                      .format('h:mm A')
                : ''
        },
    },
    methods: {
        click() {
            if (!this.disabled) {
                this.showDialog = true
            }
        },
        setDefaultStartTime() {
            const now = moment.tz(this.selectedTimezone)

            // Set minutes, seconds, and milliseconds to 0 and add 1 hour
            now.minutes(0).seconds(0).milliseconds(0).add(1, 'hours')

            this.selectedTime = now.format('HH:mm:ss')

            // this.endDate = this.startDate
        },
        parseTimestamptz(value) {
            if (value) {
                const dateTime = moment.tz(value, this.selectedTimezone)
                this.selectedDate = dateTime.format('YYYY-MM-DD')
                this.selectedTime = dateTime.format('HH:mm:ss')
            }
        },
        getTimestampForDatabase() {
            return moment
                .tz(
                    `${this.selectedDate} ${this.selectedTime}`,
                    this.selectedTimezone
                )
                .toISOString()
        },
        finalizeDateTime() {
            const dateTimeForDB = this.getTimestampForDatabase()
            this.$emit('update:modelValue', dateTimeForDB)
            this.showDialog = false
        },
    },
    watch: {
        modelValue() {
            this.parseTimestamptz(this.modelValue)
        },
    },
    // mounted() {
    //     this.parseTimestamptz(this.modelValue)
    // },
}
</script>

<style scoped></style>
