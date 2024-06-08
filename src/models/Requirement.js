import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';

export default class Requirement extends MyBaseModel {
    static entity = 'requirement';
    static entityUrl = '/api/requirements';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/requirements/:rId',
        params: {
          rId: pKey,
        },
      })
    }

    static parentWithables = [

    ];

    static rules = {
        readables: (user) => true,
        readable: (user, item) => true,
        editable: (user, item) => true,
    };

    static fieldsMetadata = {
        'Id': {},
            'Service': {},
            'Category': {},
            'Code': {},
            'Name': {},
            'Required': {},
            'Path': {},
            'Display': {},
            'SystemCodeContext': {},
            'SystemCodeField': {},
            'ValueType': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'Service': this.attr(''),
            'Category': this.attr(''),
            'Code': this.attr(''),
            'Name': this.attr(''),
            'Required': this.attr(''),
            'Path': this.attr(''),
            'Display': this.attr(''),
            'SystemCodeContext': this.attr(''),
            'SystemCodeField': this.attr(''),
            'ValueType': this.attr(''),

        };
    }

    static displayMapSummary = {
        // Define displayMapSummary
    };

    static displayMapFull = {
        // Define displayMapFull
    };

    static FetchAll(relationships = [], flags = {}, moreHeaders = {}, options = { page: 1, limit: 15, filters: {}, clearPrimaryModelOnly: false }) {
        return this.customSupabaseApiFetchAll(
            `${this.baseUrl}${this.entityUrl}`,
            [...this.parentWithables, ...relationships],
            flags,
            this.mergeHeaders(moreHeaders),
            options,
            this.adapator
        );
    }

    static FetchById(id, relationships = [], flags = {}, moreHeaders = {}) {
        return this.customSupabaseApiFetchById(
            `${this.baseUrl}${this.entityUrl}`,
            id,
            [...this.parentWithables, ...relationships],
            flags,
            this.mergeHeaders(moreHeaders),
            this.adapator
        );
    }

    static Store(entity, relationships = [], flags = {}, moreHeaders = {}) {
        return this.customSupabaseApiStore(
            `${this.baseUrl}${this.entityUrl}`,
            entity,
            [...this.parentWithables, ...relationships],
            flags,
            this.mergeHeaders(moreHeaders),
            this.adapator
        );
    }

    static Update(entity, relationships = [], flags = {}, moreHeaders = {}) {
        return this.customSupabaseApiUpdate(
            `${this.baseUrl}${this.entityUrl}`,
            entity,
            [...this.parentWithables, ...relationships],
            flags,
            this.mergeHeaders(moreHeaders),
            this.adapator
        );
    }

    static Delete(entityId, options = { flags: {}, moreHeaders: {} }) {
        return this.customSupabaseApiDelete(
            `${this.baseUrl}${this.entityUrl}`,
            entityId,
            this.adapator
        );
    }
}
