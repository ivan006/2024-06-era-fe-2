<template>
    <div>
        <template v-if="destroy">
            <slot></slot>
        </template>
        <template v-else>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <template v-slot:default> {{ title }} </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <slot></slot>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
export default {
    name: 'DestructableExpansionPanels',
    props: {
        destroy: {
            type: Boolean,
            default() {
                return false
            },
        },
        title: {
            type: String,
            default() {
                return ''
            },
        },
    },
}
</script>

<style scoped></style>
