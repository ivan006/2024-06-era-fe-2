<template>
    <div>
        <!--        <GmapMap-->
        <!--            :center="{ lat: -32.900024, lng: 18.774893 }"-->
        <!--            :zoom="8"-->
        <!--            style="width: 100%; height: 500px"-->
        <!--            class="GmapMap"-->
        <!--        >-->

        <!--        </GmapMap>-->
        <v-text-field
            :label="configs.label"
            :modelValue="modelValue"
            @click="showDialog = true"
            readonly
            variant="underlined"
        ></v-text-field>

        <v-dialog v-model="showDialog" max-width="500px" class="xxxxxx">
            <v-card class="pa-4">
                <h3>Search Place</h3>

                <!-- Date -->
                <!--                <v-text-field-->
                <!--                    label="Date"-->
                <!--                    v-model="formattedDate"-->
                <!--                    readonly-->
                <!--                    @click="showDatePicker = true"-->
                <!--                ></v-text-field>-->

                <v-text-field
                    class="CustomPlaceSearch"
                    label="Place"
                    :modelValue="modelValue"
                    ref="autocompleteInput"
                    variant="underlined"
                ></v-text-field>

                <!-- OK Button -->
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showDialog = false"
                        >OK</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div style="display: none">
            <GMapAutocomplete
              placeholder="This is a placeholder"
              @place_changed="$emit('change', place)"
            />
        </div>
    </div>
</template>

<script>
// import { gmapApi } from 'vue2-google-maps'

export default {
    name: 'SearchGooglePlace',
    props: {
        modelValue: {
            type: String,
            default() {
                return null
            },
        },
        configs: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            showDialog: false,
            retries: 0,
            place: 0,
        }
    },
    computed: {
        // google() {
        //     const result = gmapApi
        //     return gmapApi()
        // },
    },
    methods: {
        // initAutocomplete() {
        //     const input = this.$refs.autocompleteInput.$refs.input
        //     const autocomplete = new window.google.maps.places.Autocomplete(
        //         input
        //     )
        //
        //     autocomplete.addListener('place_changed', () => {
        //         const place = autocomplete.getPlace()
        //
        //         this.$emit('change', place)
        //         this.place = place
        //         if (place.geometry) {
        //             this.input(place.name)
        //         }
        //     })
        // },
        // tryInit() {
        //     if (
        //         this.$refs.autocompleteInput &&
        //         window.google &&
        //         window.google.maps &&
        //         window.google.maps.places
        //     ) {
        //         this.initAutocomplete()
        //     } else if (this.retries < 5) {
        //         this.retries++
        //         setTimeout(this.tryInit, 1000) // Retry after 1 second
        //     } else {
        //         console.error(
        //             'Failed to load Google Maps API after multiple attempts.'
        //         )
        //     }
        // },
        // input(e) {
        //     this.$emit('update:modelValue', e)
        // },
    },
    watch: {
        // showDialog(e) {
        //     if (e == true) {
        //         this.tryInit()
        //     }
        //     // this.$emit('update:modelValue', e)
        // },
    },
    mounted() {},
}
</script>

<style>
.CustomPlaceSearch.v-text-field input[placeholder]::placeholder {
    opacity: 0;
}
</style>
