import MyBaseModel from '@/models/non-quicklist/MyBaseModel';
import router from '@/router';
import Communication from '@/models/Communication';
import DomainUser from '@/models/DomainUser';
import EntityAudit from '@/models/EntityAudit';
import ServiceRequest from '@/models/ServiceRequest';
import ServiceRequestReport from '@/models/ServiceRequestReport';
import UserAccess from '@/models/UserAccess';
import UserConfiguration from '@/models/UserConfiguration';
import UserDevice from '@/models/UserDevice';

export default class SystemUser extends MyBaseModel {
    static entity = 'systemuser';
    static entityUrl = '/api/system-users';
    static primaryKey = 'Id';
    static openRecord(pKey){
      router.push({
        name: '/lists/system-users/:rId',
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
            'Entity': {},
            'Username': {},
            'Active': {},
            'LastSeen': {},
            'LoginCount': {},
            'FailedLoginAttempts': {},
            'LockedSince': {},
            'Secret': {},
            'Email': {},
            'Phone': {},
            'CreatedOn': {},
            'CreatedBy': {},
            'ChangedOn': {},
            'ChangedBy': {},
            'FbId': {}
    };

    static fields() {
        return {
            'Id': this.attr(''),
            'Entity': this.attr(''),
            'Username': this.attr(''),
            'Active': this.attr(''),
            'LastSeen': this.attr(''),
            'LoginCount': this.attr(''),
            'FailedLoginAttempts': this.attr(''),
            'LockedSince': this.attr(''),
            'Secret': this.attr(''),
            'Email': this.attr(''),
            'Phone': this.attr(''),
            'CreatedOn': this.attr(''),
            'CreatedBy': this.attr(''),
            'ChangedOn': this.attr(''),
            'ChangedBy': this.attr(''),
            'FbId': this.attr(''),
            'communications': this.hasMany(Communication, 'SentBy'),
            'domainusers': this.hasMany(DomainUser, 'SystemUser'),
            'entityaudits': this.hasMany(EntityAudit, 'SystemUser'),
            'servicerequests': this.hasMany(ServiceRequest, 'CreatedBy'),
            'servicerequestreports': this.hasMany(ServiceRequestReport, 'CreatedBy'),
            'useraccesses': this.hasMany(UserAccess, 'SystemUser'),
            'userconfigurations': this.hasMany(UserConfiguration, 'SystemUser'),
            'userdevices': this.hasMany(UserDevice, 'SystemUser')
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
