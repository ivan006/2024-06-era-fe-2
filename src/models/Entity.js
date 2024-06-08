import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import EntityGood from '@/models/EntityGood';
import EntityGoodApproval from '@/models/EntityGoodApproval';
import Good from '@/models/Good';
import ServiceRequest from '@/models/ServiceRequest';
import ServiceRequestReport from '@/models/ServiceRequestReport';
import SystemCode from '@/models/SystemCode';

export default class Entity extends MyBaseModel {
    static entity = 'entity';
    static entityUrl = '/api/entities';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/entities/:rId',
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
            'ExternalNo': {},
            'Level': {},
            'Type': {},
            'Title': {},
            'Name': {},
            'Surname': {},
            'Identity': {},
            'BirthDate': {},
            'Gender': {},
            'Language': {},
            'Status': {},
            'Note': {},
            'Passport': {},
            'HasPhoto': {},
            'IsPaid': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'ExternalNo': this.attr(''),
            'Level': this.attr(''),
            'Type': this.attr(''),
            'Title': this.attr(''),
            'Name': this.attr(''),
            'Surname': this.attr(''),
            'Identity': this.attr(''),
            'BirthDate': this.attr(''),
            'Gender': this.attr(''),
            'Language': this.attr(''),
            'Status': this.attr(''),
            'Note': this.attr(''),
            'Passport': this.attr(''),
            'HasPhoto': this.attr(''),
            'IsPaid': this.attr(''),
            'entitygoods': this.hasMany(EntityGood, 'Entity'),
            'entitygoodapprovals': this.hasMany(EntityGoodApproval, 'ApprovedBy'),
            'entitygoodapprovals': this.hasMany(EntityGoodApproval, 'InvoiceApprovedBy'),
            'entitygoodapprovals': this.hasMany(EntityGoodApproval, 'Entity'),
            'goods': this.hasMany(Good, 'Sector'),
            'servicerequests': this.hasMany(ServiceRequest, 'ServiceProvider'),
            'servicerequestreports': this.hasMany(ServiceRequestReport, 'ServiceProvider'),
            'systemcodes': this.hasMany(SystemCode, 'Entity')
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
