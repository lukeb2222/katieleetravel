CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`subject` varchar(255),
	`message` text NOT NULL,
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`adminNotes` text,
	`repliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questionnaire_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`destination` text,
	`travelDates` varchar(255),
	`flexibility` varchar(100),
	`travelers` varchar(255),
	`budget` varchar(100),
	`occasion` varchar(255),
	`accommodationStyle` text,
	`interests` text,
	`dietaryNeeds` text,
	`mobilityNeeds` text,
	`additionalNotes` text,
	`status` enum('new','reviewed','in_progress','completed') NOT NULL DEFAULT 'new',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questionnaire_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`location` varchar(200),
	`rating` int NOT NULL,
	`destination` varchar(255),
	`title` varchar(255),
	`content` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
