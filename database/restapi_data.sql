-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2025 at 11:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restapi_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `banner_name` varchar(255) NOT NULL,
  `banner_image` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `banner_name`, `banner_image`, `description`) VALUES
(1, 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(2, 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(3, 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(4, 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(5, 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(6, 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_code` varchar(20) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_icon` varchar(255) DEFAULT NULL,
  `service_tariff` bigint(20) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`service_code`, `service_name`, `service_icon`, `service_tariff`) VALUES
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_history`
--

CREATE TABLE `transaction_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') NOT NULL,
  `total_amount` bigint(20) UNSIGNED NOT NULL,
  `service_code` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_history`
--

INSERT INTO `transaction_history` (`id`, `user_id`, `invoice_number`, `transaction_type`, `total_amount`, `service_code`, `created_at`) VALUES
(1, 1, 'INV1764227662273467', 'TOPUP', 99999, NULL, '2025-11-27 14:14:22'),
(2, 1, 'INV1764229156790818', 'PAYMENT', 40000, 'PDAM', '2025-11-27 14:39:16'),
(3, 1, 'INV1764229288977615', 'TOPUP', 50000, NULL, '2025-11-27 14:41:28'),
(4, 1, 'INV1764229295436650', 'PAYMENT', 40000, 'PDAM', '2025-11-27 14:41:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `saldo` bigint(20) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `profile_image`, `saldo`) VALUES
(1, 'jacob@mail.com', 'jacob', 'frye', '$2b$10$TRH/rpSyje33U8evAgLDpeu5Oc2TVJQ6UU4kA3huVDPH6yeLxvmLO', 'http://localhost:3003/profile/1764174947407.png', 10000),
(2, 'altair@mail.com', 'Altair', 'Jasim', '$2b$10$dwsoBn6IQJLXM4ldWcB7OeSGLNwX.h.Da7OZfoNhquJiPKAg0Z6r6', 'http://localhost:3003/profile/1764233357347.jpg', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_code`);

--
-- Indexes for table `transaction_history`
--
ALTER TABLE `transaction_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_code` (`service_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaction_history`
--
ALTER TABLE `transaction_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaction_history`
--
ALTER TABLE `transaction_history`
  ADD CONSTRAINT `transaction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_history_ibfk_2` FOREIGN KEY (`service_code`) REFERENCES `service` (`service_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
