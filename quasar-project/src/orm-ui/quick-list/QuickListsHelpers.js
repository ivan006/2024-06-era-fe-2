import DBCrudCacheSet from './DBCrudCacheSet'
// import Helpers from '../utils/Helpers.js'

class QuickListsHelpers {
    static quickListsIsMobile() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            return true
        } else {
            return false
        }
    }

    static mapPlaceFields() {
        return [
            // {
            //     flag: 'mapName',
            //     googleType: 'simple',
            //     googleName: 'mapName',
            // },
            {
                flag: 'mapExtraFormattedAddress',
                googleType: 'simple',
                googleName: 'formatted_address',
            },
            {
                flag: 'mapExtraPlaceID',
                googleType: 'simple',
                googleName: 'place_id',
            },
            {
                flag: 'mapExtraGeoLocLong',
                googleType: 'mapGeoLoc',
                googleName: 'lng',
            },
            {
                flag: 'mapExtraGeoLocLat',
                googleType: 'mapGeoLoc',
                googleName: 'lat',
            },
            {
                flag: 'relForeignKeyMapExtraRelCountry',
                googleType: 'components',
                googleName: 'country',
            },
            {
                flag: 'relForeignKeyMapExtraRelAdminArea1',
                googleType: 'components',
                googleName: 'administrative_area_level_1',
            },
            {
                flag: 'relForeignKeyMapExtraRelAdminArea2',
                googleType: 'components',
                googleName: 'administrative_area_level_2',
            },
            {
                flag: 'relForeignKeyMapExtraRelLocality',
                googleType: 'components',
                googleName: 'locality',
            },
            // {
            //     flag: 'mapExtraRelSublocality1',
            //     googleType: 'components',
            //     googleName: 'sublocality_level_1',
            // },
            // {
            //     flag: 'mapExtraRelSublocality2',
            //     googleType: 'components',
            //     googleName: 'sublocality_level_2',
            // },
            {
                flag: 'relForeignKeyMapExtraRelSublocality',
                googleType: 'components',
                googleName: ['sublocality_level_1', 'sublocality_level_2'], // Search for both sublocality levels
            },
        ]
    }

    static quickListsGetIfMatchesAllChecks(item, filters) {
        for (const [key, filter] of Object.entries(filters)) {
            // todo: note the below logic was to support time range filters
            if (
                typeof filter === 'object' &&
                !Array.isArray(filter) &&
                filter !== null
            ) {
                if (filter?.value) {
                    if (filter.usageType === 'timeRangeStart') {
                        if (filter.value.range.start) {
                            const startDate = new Date(filter.value.range.start)
                            const endDate = new Date(filter.value.range.end)
                            const itemDate = new Date(item[key])
                            return startDate < itemDate && itemDate < endDate
                        }
                    }
                }
            } else if (filter !== null) {
                return item[key] == filter
            }
        }

        return true
    }

    static computedAttrs(model, excludedCols = []) {
        let crudCache = DBCrudCacheSet.find(model.entity)
        if (!crudCache) {
            DBCrudCacheSet.Generate(model)
            crudCache = DBCrudCacheSet.find(model.entity)
        }
        const result = this.computedAttrs2(crudCache.fields, excludedCols)
        return result
    }

    static computedAttrs2(fields, excludedCols = []) {
        let lookupKeys = [] // To keep track of foreign keys

        let result = []

        for (const field of fields) {
            // if (!excludedCols.includes(field.name)) {
            //     if (field.usageType.startsWith('relForeignKey')) {
            //         if (!excludedCols.includes(field.meta.foreignKey)) {
            //             result.push(field)
            //             lookupKeys.push(field)
            //         }
            //     } else {
            //         result.push(field)
            //     }
            // }

            excludedCols
            if (field.usageType.startsWith('relForeignKey')) {
                result.push(field)
                lookupKeys.push(field)
            } else {
                result.push(field)
            }
        }

        return result
    }

    static SupaerTableHeaders(
        model,
        excludedCols = [],
        canEdit,
        displayMapField = false
    ) {
        let result = []
        const computedAttrs = this.computedAttrs(model, excludedCols)

        for (const computedAttr of computedAttrs) {
            if (
                // !computedAttr.dataType.startsWith('mapExtra') &&
                // computedAttr.dataType !== 'foreignKey'
                computedAttr.usageType.startsWith('relForeignKey')
            ) {
                // do nothing
            } else if (computedAttr.usageType.startsWith('relLookup')) {
                const relatedAttrs = this.computedAttrs(
                    computedAttr.meta.relatedModel,
                    excludedCols
                )
                let headerChildren = []
                for (const relatedAttr of relatedAttrs) {
                    if (relatedAttr.important == true) {
                        if (relatedAttr.usageType.startsWith('relForeignKey')) {
                            // do nothing
                        } else {
                            headerChildren.push({
                                title: relatedAttr.label,
                                key: relatedAttr.name,
                                usageType: relatedAttr.usageType,
                                dataType: relatedAttr.dataType,
                                meta: relatedAttr.meta,
                                sortable: true,
                            })
                        }
                    }
                }

                result.push({
                    title: computedAttr.label,
                    key: computedAttr.name,
                    usageType: computedAttr.usageType,
                    dataType: computedAttr.dataType,
                    meta: computedAttr.meta,
                    headerChildren: headerChildren,
                    sortable: true,
                })
            } else {
                result.push({
                    title: computedAttr.label,
                    key: computedAttr.name,
                    usageType: computedAttr.usageType,
                    dataType: computedAttr.dataType,
                    meta: computedAttr.meta,
                    sortable: true,
                })
            }
        }
        if (canEdit) {
            result.push({
                title: 'Actions',
                key: 'actions',
                usageType: 'actions',
                dataType: 'actions',
            })
        }

        result = result.filter((item) => {
            if (displayMapField) {
                if (!item.usageType.startsWith('relForeignKey')) {
                    return true
                }
            } else {
                return (
                    !item.usageType.startsWith('relForeignKey') &&
                    !item.usageType.startsWith('relLookupMapExtra') &&
                    !item.usageType.startsWith('mapExtra')
                )
            }
        })
        // console.log(result)

        return result
    }

    static preparePayload(input, modelFields) {
        let result = []
        for (const attr of modelFields) {
            if (typeof input?.[attr.name] !== 'undefined') {
                if (attr.usageType.startsWith('relForeignKey')) {
                    result[attr.meta.foreignKey] = input[attr.meta.foreignKey]
                } else if (attr.usageType.startsWith('relLookup')) {
                    // do nothing
                } else if (attr.usageType.startsWith('relChildren')) {
                    // do nothing
                } else if (
                    [
                        'timestampType',
                        'readOnlyTimestampType',
                        'timeRangeStart',
                        'timeRangeEnd',
                    ].includes(attr.usageType)
                ) {
                    if (input[attr.name]) {
                        result[attr.name] = input[attr.name]
                    }
                } else {
                    result[attr.name] = input[attr.name]
                }
            }
        }
        delete result.$id
        return result
    }
}

export default QuickListsHelpers
