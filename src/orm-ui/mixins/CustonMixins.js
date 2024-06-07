import moment from 'moment'

export default {
    methods: {

        // goto(path) {
        //     router.push(path)
        // },
        VITE_API_URL() {
            return import.meta.env.VITE_API_URL
        },
        getHumanReadableDate(theMoment) {
            let value = null
            const updateMoment = moment(new Date(theMoment))
            const currMoment = moment()
            const diff = moment.duration(updateMoment.diff(currMoment))
            if (diff.asWeeks() > -1) {
                value = updateMoment.fromNow()
            } else {
                value = updateMoment.format('llll')
            }
            value = value.charAt(0).toUpperCase() + value.slice(1)
            return value
        },
    },
}
