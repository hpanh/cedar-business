const getDb = require('../lib/db').getDb;

module.exports = function getMajorListing(key) {
      var db = getDb(key);
      return db.table('majorListing', {
            fields: ['id',
                  'majorId',
                  'parentId',
                  'schoolId',
                  'displayName',
                  'curriculum',
                  'programs',
                  'source',
                  'createdDate',
                  'lastEdited',
                  'deleted'
            ],
            relationships: {
                  school: {
                        type: 'hasOne',
                        local: 'schoolId',
                        foreign: { table: 'school', key: 'id' }
                  },
                  major: {
                        type: 'hasOne',
                        local: 'majorId',
                        foreign: { table: 'major', key: 'id'}
                  }
            } 
      });
};