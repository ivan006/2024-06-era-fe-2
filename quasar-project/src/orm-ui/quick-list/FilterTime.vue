<template>
    <div>
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
                    <!--                  label="Time Period"-->
                    <v-text-field
                        label="Time Filter"
                        type="text"
                        :modelValue="displayDate"
                        readonly
                        density="compact"
                        variant="outlined"
                    />
                </div>
            </template>

            <v-card>
                <v-card-text>
                    <v-select
                        :items="years"
                        v-model="selectedYear"
                        label="Year"
                        item-title="label"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                    ></v-select>

                    <v-select
                        :items="months"
                        v-model="selectedMonth"
                        label="Month"
                        :disabled="!selectedYear"
                        item-title="label"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                    ></v-select>

                    <v-select
                        :items="weeks"
                        v-model="selectedWeek"
                        label="Week"
                        :disabled="!selectedMonth"
                        item-title="label"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                    ></v-select>

                    <v-select
                        :items="days"
                        v-model="selectedDay"
                        label="Day"
                        :disabled="!selectedWeek"
                        item-title="label"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                    ></v-select>

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
import moment from 'moment'

export default {
    name: 'FilterTime',
    props: {
        modelField: {
            type: Object,
            default() {
                return {}
            },
        },
        modelValue: {
            type: Object,
            default: () => ({
                year: null,
                month: null,
                week: null,
                day: null,
                range: {
                    start: null,
                    end: null,
                },
            }),
        },
    },
    data() {
        return {
            years: this.generateYears(),
            months: [],
            weeks: [],
            days: [],
            menu: false,
        }
    },
    computed: {
        displayDate() {
            if (this.selectedDay) {
                return moment(this.selectedDay).format('ddd, MMM D, YYYY')
            }
            if (this.selectedWeek) {
                const startOfWeek = moment()
                    .year(this.selectedYear)
                    .month(this.selectedMonth - 1)
                    .isoWeek(this.selectedWeek)
                    .startOf('isoWeek')
                const endOfWeek = startOfWeek.clone().endOf('isoWeek')

                if (startOfWeek.month() === endOfWeek.month()) {
                    return `${startOfWeek.format('ddd D')} - ${endOfWeek.format(
                        'ddd D, MMM, YYYY'
                    )}`
                } else {
                    return `${startOfWeek.format(
                        'ddd D, MMM'
                    )} - ${endOfWeek.format('ddd D, MMM, YYYY')}`
                }
            }
            if (this.selectedMonth) {
                return moment(
                    `${this.selectedYear}-${this.selectedMonth}-01`
                ).format('MMM, YYYY')
            }
            if (this.selectedYear) {
                return this.selectedYear.toString()
            }
            return '' // Default case if nothing is selected
        },
        selectedYear: {
            get() {
                return this.modelValue?.year ? this.modelValue?.year : null
            },
            set(val) {
                const updatedValues = {
                    ...this.modelValue,
                    year: val,
                    month: null,
                    week: null,
                    day: null,
                }
                this.$emit('update:modelValue', {
                    ...updatedValues,
                    range: this.computeRange(updatedValues),
                })
                this.months = this.generateMonths()
            },
        },
        selectedMonth: {
            get() {
                return this.modelValue?.month ? this.modelValue?.month : null
            },
            set(val) {
                const updatedValues = {
                    ...this.modelValue,
                    month: val,
                    week: null,
                    day: null,
                }
                this.$emit('update:modelValue', {
                    ...updatedValues,
                    range: this.computeRange(updatedValues),
                })

                this.weeks = this.generateWeeks(this.selectedYear, val)
            },
        },
        selectedWeek: {
            get() {
                return this.modelValue?.week ? this.modelValue?.week : null
            },
            set(val) {
                const updatedValues = { ...this.modelValue, week: val, day: null }
                this.$emit('update:modelValue', {
                    ...updatedValues,
                    range: this.computeRange(updatedValues),
                })

                this.days = this.generateDays(
                    this.selectedYear,
                    this.selectedMonth,
                    val
                )
            },
        },
        selectedDay: {
            get() {
                return this.modelValue?.day ? this.modelValue?.day : null
            },
            set(val) {
                const updatedValues = { ...this.modelValue, day: val }
                this.$emit('update:modelValue', {
                    ...updatedValues,
                    range: this.computeRange(updatedValues),
                })
            },
        },
    },
    methods: {
        computeRange(values) {
            let startDate, endDate
            if (values.day) {
                startDate = endDate = moment(values.day)
            } else if (values.week) {
                startDate = moment()
                    .year(values.year)
                    .isoWeek(values.week)
                    .isoWeekday(1)
                endDate = startDate.clone().endOf('isoWeek')
            } else if (values.month) {
                startDate = moment(
                    `${values.year}-${values.month}-01`,
                    'YYYY-MM-DD'
                )
                endDate = startDate.clone().endOf('month')
            } else if (values.year) {
                startDate = moment(`${values.year}-01-01`, 'YYYY-MM-DD')
                endDate = moment(`${values.year}-12-31`, 'YYYY-MM-DD')
            }
            return {
                start: startDate ? startDate.format('YYYY-MM-DD') : null,
                end: endDate ? endDate.format('YYYY-MM-DD') : null,
            }
        },
        generateYears() {
            const currentYear = moment().year()
            // let result = Array.from({ length: 10 }, (_, i) => currentYear - i)

            const result = []

            result.push({
                label: 'All',
                value: null,
            })

            // Loop through 12 months (0 to 11).
            for (let yearsBack = 0; yearsBack < 10; yearsBack++) {
                result.push({
                    label: currentYear - yearsBack,
                    value: currentYear - yearsBack,
                })
            }

            return result
        },
        generateMonths() {
            const result = []

            result.push({
                label: 'All',
                value: null,
            })

            // Loop through 12 months (0 to 11).
            for (let month = 0; month < 12; month++) {
                result.push({
                    label: moment().month(month).format('MMMM'),
                    value: +moment().month(month).format('MM'),
                })
            }
            return result
        },
        generateWeeks(year, month) {
            const startOfMonth = moment(
                `${year}-${month}-01`,
                'YYYY-MM-DD'
            ).startOf('month')
            const endOfMonth = startOfMonth.clone().endOf('month')
            const result = []

            result.push({
                label: 'All',
                value: null,
            })

            while (startOfMonth <= endOfMonth) {
                const startOfWeek = startOfMonth.clone().startOf('isoWeek') // Set Monday as the start of the week
                const endOfWeek = startOfWeek.clone().endOf('isoWeek')
                let label

                if (startOfWeek.month() === endOfWeek.month()) {
                    label = `${startOfWeek.format('D')} - ${endOfWeek.format(
                        'D MMM'
                    )}`
                } else {
                    label = `${startOfWeek.format(
                        'D MMM'
                    )} - ${endOfWeek.format('D MMM')}`
                }

                result.push({
                    label: label,
                    value: startOfWeek.week(),
                })

                startOfMonth.add(1, 'week')
            }

            return result
        },
        generateDays(year, month, week) {
            const weekNumber = week
            const start = moment().year(year).isoWeek(weekNumber).isoWeekday(1) // Set Monday as the start of the week

            const end = start.clone().endOf('isoWeek')
            const days = []

            while (start <= end) {
                days.push({
                    label: start.format('Do'),
                    value: start.format('YYYY-MM-DD'),
                })
                start.add(1, 'day')
            }

            const filteredDays = days.filter(
                (day) => +moment(day.value).format('MM') === month
            )

            const result = [
                {
                    label: 'All',
                    value: null,
                },
                ...filteredDays,
            ]
            return result
        },
    },
}
</script>

<style scoped></style>
