CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL,
  `role` enum('TOURIST','ADMIN') NOT NULL DEFAULT 'TOURIST', `tokenVersion` int NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `description` text NOT NULL,
  `city` varchar(255) NOT NULL, `category` varchar(255) NOT NULL, `meetingPoint` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL, `durationMinutes` int NOT NULL,
  `pricePerPerson` decimal(10,2) NOT NULL, `capacity` int NOT NULL, `imageUrl` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `activityId` int NOT NULL,
  `participants` int NOT NULL DEFAULT 1, `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('CONFIRMED','CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`),
  CONSTRAINT `FK_booking_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_booking_activity` FOREIGN KEY (`activityId`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
