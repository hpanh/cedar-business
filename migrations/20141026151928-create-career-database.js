var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `hollandCode` ("
            + "id                     INT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   VARCHAR(100) NOT NULL,"
            + "code1                  VARCHAR(1) NOT NULL,"
            + "code2                  VARCHAR(1) NULL,"
            + "code3                  VARCHAR(1) NULL,"
            + "createdDate            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastEdited             TIMESTAMP NULL DEFAULT NULL,"
            + "INDEX `hollandCode_slug` (slug)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `job` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   VARCHAR(100) NOT NULL,"
            + "name                   VARCHAR(100) NOT NULL UNIQUE,"
            + "shortDescription       VARCHAR(1000) NULL,"
            + "description            VARCHAR(10000) NOT NULL,"
            + "salary                 VARCHAR(100) NULL," // this will be a range with currency and numbers
            + "requirement            VARCHAR(10000) NULL,"
            + "hollandCodeId          INT NULL,"
            + "createdDate            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastEdited             TIMESTAMP NULL DEFAULT NULL,"
            + "createdBy              VARCHAR(100) NOT NULL,"
            + "deleted                TIMESTAMP NULL,"
            + "INDEX `job_id` (id),"
            + "INDEX `job_slug` (slug),"
            + "INDEX `job_salary` (salary),"
            + "INDEX `job_hollandCode` (hollandCodeId),"
            + "CONSTRAINT `hollandCode_job_id` FOREIGN KEY (hollandCodeId) REFERENCES `hollandCode` (id)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `major` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   VARCHAR(100) NOT NULL,"
            + "externalId             VARCHAR(20) NULL," //code của Bộ Giáo Dục
            + "name                   VARCHAR(100) NOT NULL,"
            + "description            LONGTEXT NOT NULL,"
            + "curriculum             VARCHAR(10000) NOT NULL,"
            + "goal                   LONGTEXT NULL,"
            + "jobOpportunities       VARCHAR(10000) NOT NULL,"
            + "hollandCodeId          INT NULL,"
            + "createdDate            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastEdited             TIMESTAMP NULL DEFAULT NULL,"
            + "createdBy              VARCHAR(100) NOT NULL,"
            + "deleted                TIMESTAMP NULL,"
            + "INDEX `major_slug` (slug),"
            + "INDEX `major_name` (name),"
            + "CONSTRAINT `hollandCode_major_id` FOREIGN KEY (hollandCodeId) REFERENCES `hollandCode` (id)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `job_major` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "jobId                  BIGINT NOT NULL,"
            + "majorId                BIGINT NOT NULL,"
            + "CONSTRAINT `job_job_major_id` FOREIGN KEY (jobId) REFERENCES `job` (id),"
            + "CONSTRAINT `major_job_major_id` FOREIGN KEY (majorId) REFERENCES `major` (id)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `school` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   VARCHAR(100) NOT NULL,"
            + "name                   VARCHAR(100) NOT NULL,"
            + "location               VARCHAR(50) NOT NULL," //at least must have city, province...'
            + "createdDate            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastEdited             TIMESTAMP NULL DEFAULT NULL,"
            + "deleted                TIMESTAMP NULL,"
            + "INDEX `school_name` (name),"
            + "INDEX `school_slug` (slug),"
            + "INDEX `school_location` (location)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `majorListing` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "majorId                BIGINT NOT NULL,"
            + "parentId               BIGINT NULL," //reference majorId in majorListing
            + "schoolId               BIGINT NULL,"
            + "displayName            VARCHAR(100) NOT NULL,"
            + "curriculum             VARCHAR(10000) NULL,"
            + "programs               INT NOT NULL," //1: college, 2: university...
            + "source                 VARCHAR(100) NULL,"
            + "createdDate            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastEdited             TIMESTAMP NULL DEFAULT NULL,"
            + "deleted                TIMESTAMP NULL,"
            + "INDEX `majorListing_displayName` (displayName),"
            + "CONSTRAINT `major_majorListing_id` FOREIGN KEY (majorId) REFERENCES `major` (id),"
            + "CONSTRAINT `school_majorListing_id` FOREIGN KEY (schoolId) REFERENCES `school` (id)"
            + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;")
        ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `majorListing`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `school`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `job_major`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `major`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `job`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `hollandCode`;")
        ], callback);
};
