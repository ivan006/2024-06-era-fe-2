<template>
    <div>
        <v-card class="pa-4 mt-4">
            <SuperTable
                :user="user"
                :showMap="true"
                :model="superTableModel"
                @update:modelValue="openRecord"
                :displayMapField="false"
            />
        </v-card>
    </div>
</template>

<script>
import { SuperTable } from 'quicklists-vue-orm-ui'
import UserAccess from '@/models/UserAccess'
import router from '@/router'

export default {
    name: 'UserAccess-list',
    components: {
        SuperTable,
    },

    computed: {
        superTableModel() {
            return UserAccess
        },
        user() {
          let result = {}
          // if (this.$store.getters['entities/login-sessions/all']()?.[0]){
          //   const id = this.$store.getters['entities/login-sessions/all']()?.[0]?.$id
          //   result = this.$store.state.entities['login-sessions'].data[id]?.user
          // }
          return result
        },
    },
    methods: {
        openRecord(e) {
            //router.push({
            //    name: '/lists/user-accesses/:rId',
            //    params: {
            //        rId: e.id,
            //    },
            //})
        },
    },
}
</script>