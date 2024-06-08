import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import SystemCode from '@/models/SystemCode';

export default class Email extends MyBaseModel {
    static entity = 'email';
    static entityUrl = '/api/emails';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/emails/:rId',
        params: {
          rId: pKey,
        },
      })
    }

    static parentWithables = [
        'typeRel'
    ];

    static rules = {
        readables: (user) => true,
        readable: (user, item) => true,
        editable: (user, item) => true,
    };

    static fieldsMetadata = {
        'Id': {},
            'Address': {},
            'Type': { relationRules: { linkables: (user) => { return {} } } },
            'Person': {},
            'Preferred': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'Address': this.attr(''),
            'Type': this.attr(''),
            'Person': this.attr(''),
            'Preferred': this.attr(''),
            'typeRel': this.belongsTo(SystemCode, 'Type')
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
