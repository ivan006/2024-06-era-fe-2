import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import ServiceRequestReport from '@/models/ServiceRequestReport';

export default class ExternalProducer extends MyBaseModel {
    static entity = 'externalproducer';
    static entityUrl = '/api/external-producers';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/external-producers/:rId',
        params: {
          rId: pKey,
        },
      })
    }

    static parentWithables = [
        'serviceRequestReportRel'
    ];

    static rules = {
        readables: (user) => true,
        readable: (user, item) => true,
        editable: (user, item) => true,
    };

    static fieldsMetadata = {
        'Id': {},
            'Name': {},
            'ServiceRequestReport': { relationRules: { linkables: (user) => { return {} } } }
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'Name': this.attr(''),
            'ServiceRequestReport': this.attr(''),
            'serviceRequestReportRel': this.belongsTo(ServiceRequestReport, 'ServiceRequestReport')
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
