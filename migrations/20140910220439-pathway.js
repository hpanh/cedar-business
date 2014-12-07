var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `pathwayCategory` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "name                   NVARCHAR(255) NOT NULL,"
            + "description            NVARCHAR(1023)"
            + ") ENGINE=InnoDB;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `pathway` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   NVARCHAR(255) NOT NULL,"
            + "name                   NVARCHAR(255) NOT NULL,"
            + "description            NVARCHAR(1023),"
            + "type                   ENUM('order', 'disorder') NOT NULL,"
            + "status                 ENUM('draft', 'published', 'archived') NOT NULL,"
            + "picture                VARCHAR(255),"
            + "pathwayCategoryId      BIGINT,"
            + "systemSlug             NVARCHAR(255) NULL,"
            + "issuerSlug             NVARCHAR(255) NULL,"
            + "programSlug            NVARCHAR(255) NULL,"
            + "totalBadge             BIGINT DEFAULT 0,"
            + "created                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastUpdated            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
            + "INDEX `pathway_slug_fi` (slug),"
            + "INDEX `pathwaycategory_id_fi` (pathwayCategoryId),"
            + "CONSTRAINT `account_fk` FOREIGN KEY (pathwayCategoryId) REFERENCES `pathwayCategory`(id)"
            + ") ENGINE=InnoDB;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `pathwayInstance` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "slug                   NVARCHAR(255) NOT NULL,"
            + "pathwayId              BIGINT,"
            + "userId                 NVARCHAR(255) NOT NULL,"
            + "completedBadgeCount    BIGINT default 0,"
            + "status                 ENUM('dropped', 'completed', 'in-progress'),"
            + "created                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastUpdated            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
            + "INDEX `pathwayInstance_slug` (slug),"
            + "CONSTRAINT `pathwayinstance_pathway` FOREIGN KEY (pathwayId) REFERENCES `pathway` (id)"
            + ") ENGINE=InnoDB;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `pathwayBadge` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "pathwayId              BIGINT,"
            + "badgeSlug              NVARCHAR(255) NOT NULL,"
            + "parentBadgeSlug        NVARCHAR(255) NULL,"
            + "`group`                BIGINT default 0,"
            + "`level`                BIGINT default 0,"
            + "CONSTRAINT `pathwaybadge_pathway` FOREIGN KEY (pathwayid) REFERENCES `pathway` (id)"
            + ") ENGINE=InnoDB;"),
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `pathwayPerformance` ("
            + "id                     BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "badgeCount             BIGINT default 0,"
            + "followerCount          BIGINT default 0,"
            + "viewCount              BIGINT default 0,"
            + "dropCount              BIGINT default 0,"
            + "inprogressCount        BIGINT default 0,"
            + "completedCount         BIGINT default 0,"
            + "shareCount             BIGINT default 0,"
            + "created                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
            + "lastUpdated            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
            + "CONSTRAINT `pathwayperformance_pathway` FOREIGN KEY (id) REFERENCES `pathway` (id)"
            + ") ENGINE=InnoDB;"),
        //Source http://www.experience.com/entry-level-jobs/news/top-10-jobs-in-information-technology/
        db.runSql.bind(db,
            "INSERT INTO `pathwayCategory` (`name`, `description`) VALUES"
            + "('IT consultant', 'Evaluate the systems and do the research to figure out the cheapest and fastest ways to run computers better'),"
            + "('Cloud architect', 'Organized and given an architecture for cloud computing systems.'),"
            + "('Computer forensic investigator', 'Computer forensic investigators search for, identify and evaluate information from computer systems.'),"
            + "('Mobile application developer', 'Developers will create programs for future iOS and Android devices.'),"
            + "('Web developer', 'Create web pages, web applications and web content. Understanding of what makes a good operating system, what the average surfer finds visually stimulating and how to optimize sites for mobile tech. They also need proficiency in Web languages, like HTML and Javascript'),"
            + "('Software engineer', 'Software engineers are behind all the programs run on mobile devices and personal computers – and there is a very wide range of niche fields you can work in.'),"
            + "('Information technology vendor manager', 'Vendor managers oversee supply when it comes to software and hardware.'),"
            + "('Geospatial professionals', 'Uses geographic data to evaluate and communicate trends and patterns in visually stylish and comprehensive ways.'),"
            + "('Data Modeler', 'Create data designs and define relationships between data fields.');")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `pathwayPerformance`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `pathwayBadge`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `pathwayInstance`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `pathway`;"),
        db.runSql.bind(db, "DROP TABLE IF EXISTS `pathwayCategory`;")
        ], callback);
};
