import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from 'src/models/User'

// Initialize the database
const database = new VuexORM.Database()

// Register models
database.register(User)

// Create Vuex store
const store = createStore({
  plugins: [VuexORM.install(database)]
})

export default store
