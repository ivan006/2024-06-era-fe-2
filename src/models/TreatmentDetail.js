import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import ServiceRequestReport from '@/models/ServiceRequestReport';

export default class TreatmentDetail extends MyBaseModel {
    static entity = 'treatmentdetail';
    static entityUrl = '/api/treatment-details';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/treatment-details/:rId',
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
            'ServiceRequestReport': { relationRules: { linkables: (user) => { return {} } } },
            'OpeningBalance': {},
            'Refurbished': {},
            'Recovered': {},
            'Export': {},
            'Energy': {},
            'Landfill': {},
            'LocalSecondaryProducts': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'ServiceRequestReport': this.attr(''),
            'OpeningBalance': this.attr(''),
            'Refurbished': this.attr(''),
            'Recovered': this.attr(''),
            'Export': this.attr(''),
            'Energy': this.attr(''),
            'Landfill': this.attr(''),
            'LocalSecondaryProducts': this.attr(''),
            'serviceRequestReportRel': this.belongsTo(ServiceRequestReport, 'ServiceRequestReport'),
            'servicerequestreports': this.hasMany(ServiceRequestReport, 'TreatmentDetails')
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
