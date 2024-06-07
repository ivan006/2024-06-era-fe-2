class Helpers {

    static snakeToTitle(string) {
        return string
            .split('_')
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(' ')
    }

    static getIfMatchesAllChecks(item, filters) {
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

    static prepareFiltersForSupabase(obj) {
        let result = []
        for (const [key, filter] of Object.entries(obj)) {
            // todo: note the below logic was to support time range filters
            if (
                typeof filter === 'object' &&
                !Array.isArray(filter) &&
                filter !== null
            ) {
                if (filter?.value) {
                    if (filter.usageType === 'timeRangeStart') {
                        if (filter.value.range.start) {
                            result.push(
                                `${key}=gte.${filter.value.range.start}`
                            )
                            result.push(`${key}=lte.${filter.value.range.end}`)
                        }
                    }
                }
            } else if (filter !== null) {
                // result[key] = `eq.${item.value}`;
                result.push(`${key}=eq.${filter}`)
            }
        }
        // return result;
        return result.join('&')
    }

    static prepareFiltersForLaravel(obj) {
        let result = [];
        for (const [key, filter] of Object.entries(obj)) {
            // Handle time range filters
            if (typeof filter === 'object' && !Array.isArray(filter) && filter !== null) {
                if (filter?.value) {
                    if (filter.usageType === 'timeRangeStart') {
                        if (filter.value.range.start) {
                            result.push(`filter[${key}]=gte,${filter.value.range.start}`);
                            result.push(`filter[${key}]=lte,${filter.value.range.end}`);
                        }
                    }
                }
            } else if (filter !== null) {
                // Handle simple equality filters
                result.push(`filter[${key}]=${filter}`);
            }
        }
        return result.join('&');
    }


    static prepareRelationsForSupabase(arr) {
        let select = ['*']
        for (const value of arr) {
            select.push(`${value}(*)`)
        }

        // *,event_type_id(*),provider_that_owns_this_id(*),event_type:venue_country_id(*),venue_state_id(*),venue_substate_id(*),venue_town_id(*),venue_suburb_id(*)
        const result = select.join(',')

        return {
            select: result,
        }
    }
    static prepareRelationsForLaravel(arr) {
        let includes = [];
        for (const value of arr) {
            includes.push(value);
        }

        // Join the relations with commas
        const result = includes.join(',');

        return {
            include: result,
        };
    }



    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

}

export default Helpers
