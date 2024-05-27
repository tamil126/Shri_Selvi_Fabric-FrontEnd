-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2024 at 05:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shri_selvi_fabric`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `design`
--

CREATE TABLE `design` (
  `id` int(11) NOT NULL,
  `loomName` varchar(255) NOT NULL,
  `loomNumber` int(11) NOT NULL,
  `designName` varchar(255) NOT NULL,
  `designBy` varchar(255) NOT NULL,
  `planSheet` varchar(255) NOT NULL,
  `design` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loom`
--

CREATE TABLE `loom` (
  `id` int(11) NOT NULL,
  `loomName` varchar(255) NOT NULL,
  `loomNumber` int(11) NOT NULL,
  `loomType` varchar(255) NOT NULL,
  `jaquardType` varchar(255) NOT NULL,
  `jaquardName` varchar(255) DEFAULT NULL,
  `hooks` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sareedesign`
--

CREATE TABLE `sareedesign` (
  `id` int(11) NOT NULL,
  `weaverId` int(11) NOT NULL,
  `loomNumber` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sareedesign`
--

INSERT INTO `sareedesign` (`id`, `weaverId`, `loomNumber`, `image`, `created_at`) VALUES
(1, 1, 'Loom 6', 'example_image.jpg', '2024-05-13 16:04:45'),
(2, 1, 'Loom 6', '1715228276139.png', '2024-05-14 04:09:52'),
(3, 1, 'Loom 6', '1715228276139.png', '2024-05-14 04:10:12'),
(4, 2, 'Loom 2', 'logow-removebg.png', '2024-05-14 04:18:26'),
(5, 2, 'Loom 4', '1715228276139 (5).ico', '2024-05-14 04:19:20'),
(6, 1, 'Loom 4', 'logow-removebg.png', '2024-05-14 05:34:32'),
(7, 4, 'Loom 3', 'IMG_20240330_085826.jpg', '2024-05-15 15:28:53'),
(8, 5, 'Loom 2', '1715228276139.png', '2024-05-15 15:37:13'),
(9, 7, 'Loom 8', '1708490814266 (1).jpg', '2024-05-15 15:46:25');

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `type` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `subCategory` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `date`, `type`, `amount`, `category`, `subCategory`, `description`, `file`) VALUES
(1, '2024-05-03', 'expense', 2000.00, 'asd', 'asd', 'asd', 'Ragaventhran.pdf'),
(2, '2024-05-03', 'expense', 2000.00, 'asd', 'asd', 'asd', 'Ragaventhran.pdf'),
(3, '2024-05-02', 'expense', 2000.00, 'asd', 'asd', 'asd', 'Ragaventhran.pdf'),
(4, '2024-05-21', 'income', 1000.00, 'sdfgh', 'sdfg', 'xcvb', 'IMG_20240330_085826.jpg'),
(5, '2024-05-08', 'income', 3000.00, 'rtyh', 'dfgh', 'fvbnm', '????\0JFIF\0\0\0\0\0\0??\0C\0\n\n\n		\n\Z%\Z# , #&\')*)-0-(0%()(??\0C\n\n\n\n(\Z\Z((((((((((((((((((((((((((((((((((((((((((((((((((??\0R?\"\0??\0\0\0\0\0\0\0\0\0\0\0	\n??\0?\0\0\0}\0!1AQa\"q2???'),
(6, '2024-05-10', 'income', 5000.00, 'Food', 'Groceries', 'Grocery shopping', '1715228601990.jpg'),
(7, '2024-05-13', 'expense', 50.00, 'Food', 'Groceries', 'Grocery', '1715228276139 (4).ico'),
(8, '2024-04-13', 'expense', 50.00, 'Food', 'Groceries', 'Weekly grocery shopping', NULL),
(9, '2024-04-13', 'expense', 50.00, 'Food', 'Groceries', 'Weekly grocery shopping', NULL),
(10, '2024-05-20', 'expense', 500.00, 'Food', 'Groceries', 'Weekly shopping', 'logow-removebg.png'),
(11, '2024-05-13', 'income', 500.00, 'Food', 'Groceries', 'Shopping', 'Ragaventhran.pdf'),
(12, '2024-05-16', 'expense', 250.00, 'Fd', 'food', 'Food', '1715228601990.jpg'),
(13, '2024-05-18', 'income', 1000.00, 'access', 'shopping', 'food', 'Ragaventhran.pdf'),
(14, '2024-06-26', 'income', 1500.00, 'Shopping', 'Food', 'Food', 'Ragaventhran.pdf'),
(15, '2024-06-30', 'expense', 3000.00, 'Food', 'Food', 'Food', '1715228601990 (1).png'),
(16, '2024-05-28', 'income', 2000.00, 'Food', 'Groceries', 'FD', 'rootkey.csv'),
(17, '2024-05-30', 'expense', 1000.00, 'Food', 'Food', 'Food', 'transactions (4).csv'),
(18, '2024-05-28', 'income', 1000.00, 'fd', 'fd', 'food', '1715228276139 (4).ico');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Admin@126', '2024-05-02 06:05:41', '2024-05-02 06:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `weavers`
--

CREATE TABLE `weavers` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `weaverName` varchar(255) NOT NULL,
  `loomName` varchar(255) DEFAULT NULL,
  `loomNumber` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `mobileNumber1` varchar(15) NOT NULL,
  `mobileNumber2` varchar(15) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `weavers`
--

INSERT INTO `weavers` (`id`, `date`, `weaverName`, `loomName`, `loomNumber`, `address`, `mobileNumber1`, `mobileNumber2`, `reference`, `document`) VALUES
(1, '2024-05-15', 'Tamil', 'Tamil', '6', 'dfghj', '8956238956', '5623895623', 'sdfghj', 'Ragaventhran.pdf'),
(2, '2024-05-26', 'Rahul', 'Rahul', '5', 'ertyui', '8956238956', '7845127845', 'dfghjkl', '1715228276139.ico'),
(3, '2024-05-04', 'sdfghj', 'dfghnj', '5', 'dfgvbhnjm', '5623895623', '2389562389', 'fgbhnjmk', '????\0JFIF\0\0\0\0\0\0??\0C\0\n\n\n		\n\Z%\Z# , #&\')*)-0-(0%()(??\0C\n\n\n\n(\Z\Z((((((((((((((((((((((((((((((((((((((((((((((((((??\0@@\"\0??\0\0\0\0\0\0\0\0\0\0\0	\n??\0?\0\0\0}\0!1AQa\"q2???'),
(4, '2024-05-26', 'Saran', 'Saran Loom', '4', 'sxdcfvgbhnjmk', '8945612345', '', 'sdfghjkxcv', 'IMG_20240330_085826.jpg'),
(5, '2024-05-17', 'Santhosh', 'Vs kumar Industry', '2', 'abcd', '4561237894', '4561238529', 'san', 'Ragaventhran.pdf'),
(6, '2024-05-16', 'Vs', 'vasan', '3', 'abcdg', '4561238529', '4561239632', 'Saran', 'Ragaventhran.pdf'),
(7, '2024-05-17', 'Priyan', 'Sk industry', '8', 'Saghj', '8529637415', '9638524563', 'saran', 'Ragaventhran.pdf');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `design`
--
ALTER TABLE `design`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loom`
--
ALTER TABLE `loom`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sareedesign`
--
ALTER TABLE `sareedesign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `weaverId` (`weaverId`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `weavers`
--
ALTER TABLE `weavers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `design`
--
ALTER TABLE `design`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loom`
--
ALTER TABLE `loom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sareedesign`
--
ALTER TABLE `sareedesign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `weavers`
--
ALTER TABLE `weavers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sareedesign`
--
ALTER TABLE `sareedesign`
  ADD CONSTRAINT `sareedesign_ibfk_1` FOREIGN KEY (`weaverId`) REFERENCES `weavers` (`id`);

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
