CREATE DATABASE 'ChicagoCommunity';
USE 'ChicagoCommunity';
CREATE TABLE `ChicagoCommunity`.`Users` (
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `dateofbirth` DATE NOT NULL,
    PRIMARY KEY (`email`)
) ENGINE = InnoDB;