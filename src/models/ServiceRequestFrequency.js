import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import ServiceRequest from '@/models/ServiceRequest';
import SystemCode from '@/models/SystemCode';

export default class ServiceRequestFrequency extends MyBaseModel {
    static entity = 'servicerequestfrequency';
    static entityUrl = '/api/service-request-frequencies';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/service-request-frequencies/:rId',
        params: {
          rId: pKey,
        },
      })
    }

    static parentWithables = [
        'serviceRequestRel',
        'reportFrequencyRel'
    ];

    static rules = {
        readables: (user) => true,
        readable: (user, item) => true,
        editable: (user, item) => true,
    };

    static fieldsMetadata = {
        'Id': {},
            'ServiceRequest': { relationRules: { linkables: (user) => { return {} } } },
            'ReportFrequency': { relationRules: { linkables: (user) => { return {} } } },
            'Active': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'ServiceRequest': this.attr(''),
            'ReportFrequency': this.attr(''),
            'Active': this.attr(''),
            'serviceRequestRel': this.belongsTo(ServiceRequest, 'ServiceRequest'),
            'reportFrequencyRel': this.belongsTo(SystemCode, 'ReportFrequency')
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
