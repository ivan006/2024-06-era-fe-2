<template>
    <div>
        <!--        <v-card class="pa-2">-->
        <!--            <v-row no-gutters>-->
        <!--                <v-col cols="12" sm="8" class="ma-n2">-->
        <!--                    -->
        <!--                </v-col>-->
        <!--                <v-col cols="12" sm="4" class="pa-4">-->
        <!--                    <template v-if="Object.keys(markers).length !== 0">-->
        <!--                        <v-card>-->
        <!--                            <v-card-text>-->
        <!--                                <div>-->
        <!--                                    <h3 class="headline mb-0">-->
        <!--                                        {{ this.viewItemData.data?.text }}-->
        <!--                                    </h3>-->

        <!--                                    &lt;!&ndash;            <img&ndash;&gt;-->
        <!--                                    &lt;!&ndash;              :src="'http://' + VITE_API_URL() + item.Image[0].url"&ndash;&gt;-->
        <!--                                    &lt;!&ndash;              width="100px"&ndash;&gt;-->
        <!--                                    &lt;!&ndash;            />&ndash;&gt;-->
        <!--                                </div>-->
        <!--                            </v-card-text>-->
        <!--                        </v-card>-->
        <!--                    </template>-->
        <!--                    <template v-else> Please select a marker. </template>-->
        <!--                </v-col>-->
        <!--            </v-row>-->

        <!--            &lt;!&ndash;          <pre>{{markers}}</pre>&ndash;&gt;-->
        <!--        </v-card>-->



      <MyGoogleMap
        :markers="markers"
        v-model="center"
        :zoom="zoom"
        @clickMarker="clickedMarker"

      />


        <v-dialog v-model="viewItemData.showModal" max-width="800px">
            <v-card class="pt-4">
                <!--                <v-card-title> View item </v-card-title>-->
                <!--              <pre>{{headers}}</pre>-->
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
// import place from '@/models/place'
// import Upload from '@/models/Upload'
import RecordOverview from './RecordOverview.vue'
import MyGoogleMap from "./MyGoogleMap.vue";
import {useGeolocation} from "@vueuse/core";
export default {
    name: 'SuperTableMap',
    components: {
      MyGoogleMap,
      RecordOverview,
    },
    props: {
        items: {
            type: Array,
            default() {
                return []
            },
        },
        mapHeaders: {
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
    data() {
        const geolocation = useGeolocation();
        return {
            locationHasBeenGranted: false,
            zoom: 2,
            geolocation: geolocation,
            center: { lat: 0, lng: 0 },
            // zoom: 2,
            geoLocate: {},
            selectedPlaceIndex: null,
            clusterStyle: {
                textColor: 'white',
                // textSize: 16,
                url: '/mapIconCluster.svg',
                anchorText: [1.5, 1],
                // anchorIcon: [1.5, 1]
            },
            viewItemData: {
                showModal: false,
                data: {},
            },
        }
    },
    computed: {
        clusterStyles() {
            return [
                { ...this.clusterStyle, height: 40, width: 40 },
                { ...this.clusterStyle, height: 40, width: 40 },
                { ...this.clusterStyle, height: 40, width: 40 },
                { ...this.clusterStyle, height: 40, width: 40 },
                { ...this.clusterStyle, height: 40, width: 40 },
            ]
        },
        markers() {
            let result = []
            let longField = this.mapHeaders.find((field) => {
                return field.usageType == 'mapExtraGeoLocLong'
            })
            let latField = this.mapHeaders.find((field) => {
                return field.usageType == 'mapExtraGeoLocLat'
            })
            if (latField && longField) {
                for (const item of this.items) {
                  if (item[latField.value] !== null){

                    result.push({
                      position: {
                        lat: item[latField.value],
                        lng: item[longField.value],
                      },
                      keys: {
                        long: longField.value,
                        lat: latField.value,
                      },
                      meta: item,
                    })
                  }
                }
            } else {
                let mapHeaderParent = ''
                for (const mapHeader of this.mapHeaders) {
                    mapHeaderParent = mapHeader.key
                    if (mapHeader.headerChildren) {
                        longField = mapHeader.headerChildren.find((field) => {
                            return field.usageType == 'mapExtraGeoLocLong'
                        })
                        latField = mapHeader.headerChildren.find((field) => {
                            return field.usageType == 'mapExtraGeoLocLat'
                        })

                        if (latField && longField) {
                            break
                        }
                    }
                }

                for (const item of this.items) {

                  if (item[latField.value] !== null){
                    result.push({
                      position: {
                        lat: item[mapHeaderParent][latField.value],
                        lng: item[mapHeaderParent][longField.value],
                      },
                      keys: {
                        long: longField.value,
                        lat: latField.value,
                      },
                      meta: item,
                    })
                  }
                }
            }
            // placeField.flag === 'mapExtraRelSublocality'
            // this.items

            return result
        },
    },
    methods: {
        // zoomIntoCluster(cluster) {
        //     const markerIds = []
        //     const gmapMarkers = cluster.getMarkers()
        //     gmapMarkers.forEach((m) => {
        //         let iconData = m.getIcon()
        //         if (iconData && iconData.id) {
        //             markerIds.push(iconData.id)
        //         }
        //     })
        //     // todo: i now have markerIds if i want to use it
        //
        //     const center = {
        //         lat: cluster.getCenter().lat(),
        //         lng: cluster.getCenter().lng(),
        //     }
        //     this.$refs.mapRef.$mapObject.setCenter(center)
        //     this.$refs.mapRef.$mapObject.setZoom(
        //         this.$refs.mapRef.$mapObject.getZoom() + 1
        //     )
        // },
        deleteItem(e) {
            this.$emit('deleteItem', e)
        },
        editItem(e) {
            this.$emit('editItem', e)
        },
        clickRow(e) {
            this.viewItemData.showModal = false
            this.$emit('clickRow', e)
        },
        position(m) {
            return { lng: Number(m.lng), lat: Number(m.lat) }
        },
        positionString(m) {
            return m.lat + ', ' + m.lng
        },
        markerOptionsMethod(m, index) {
            const result =
                index == this.selectedPlaceIndex
                    ? this.selectedMarkerOptions(m, index)
                    : this.markerOptions(m, index)
            return result
        },
        clickedMarker(m, index) {
            // this.center = this.position(m);

            this.viewItemData.showModal = true
            this.viewItemData.data = m.meta

            this.selectedPlaceIndex = index
        },

        markerOptions(m) {
            return {
                id: m.meta.id,
                url: '/mapIconPin.svg',
                size: { width: 30, height: 30, f: 'px', b: 'px' },
                scaledSize: { width: 30, height: 30, f: 'px', b: 'px' },
            }
        },
        selectedMarkerOptions(m) {
            return {
                id: m.meta.id,
                url: '/mapIconPin.svg',
                size: { width: 40, height: 40, f: 'px', b: 'px' },
                scaledSize: { width: 40, height: 40, f: 'px', b: 'px' },
            }
        },
    },
    mounted() {
        // Upload.deleteAll()

    },
    watch: {
      'geolocation.coords.latitude'(){
        if (!this.locationHasBeenGranted){
          this.locationHasBeenGranted = true

          this.center = {
            lng: this.geolocation.coords.longitude,
            lat: this.geolocation.coords.latitude,
          };

          let result = 2;
          if (this.geolocation.coords.accuracy <= 100 || this.geolocation.coords.altitude) {
            // High accuracy (typically GPS-based)
            result = 9
          } else if (this.geolocation.coords.accuracy <= 1000) {
            // Moderate accuracy
            result = 8
          } else {
            // Low accuracy (e.g., IP-based)
            result = 7
          }
          this.zoom = result
        }
      }
    }
}
</script>

<style>
.GmapMap .vue-map {
    border-radius: 4px !important;
}
</style>
