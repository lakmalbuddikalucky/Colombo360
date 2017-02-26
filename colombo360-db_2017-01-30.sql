-- phpMyAdmin SQL Dump
-- version 4.6.0
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 30, 2017 at 12:42 PM
-- Server version: 5.6.29
-- PHP Version: 7.0.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `colombo360`
--

-- --------------------------------------------------------

--
-- Table structure for table `photosphere`
--

CREATE TABLE `photosphere` (
  `id` int(100) NOT NULL,
  `user_id` int(100) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo_id` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `photo_location` varchar(255) NOT NULL,
  `description` varchar(512) NOT NULL,
  `likes` int(10) NOT NULL,
  `views` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `photosphere`
--

INSERT INTO `photosphere` (`id`, `user_id`, `user_name`, `name`, `photo_id`, `upload_date`, `photo_location`, `description`, `likes`, `views`) VALUES
(2, 1, 'Lakmal Buddika', 'Berlin Castle', '1485541371.jpg', '0000-00-00', 'Colombo', 'This is a castle which is near Berlin, Germany', 7, 12),
(3, 1, 'Lakmal Buddika', 'Cologne Cathedral', '1485541440.jpg', '0000-00-00', 'Colombo', 'This is the beatiful iconic place the Cologne Cathedral.', 4, 5),
(4, 1, 'Lakmal Buddika', 'Kreuzberg Monastery', '1485542685.jpg', '0000-00-00', 'Colombo', 'Another beautiful monastery in Germany.', 34, 50),
(5, 2, 'Madhawa Vidanapathirana', 'Feusisberg Lake', '1485542752.jpg', '0000-00-00', 'Colombo', 'Feusisberg Lake in Zurich Switzerland', 0, 0),
(6, 3, 'Chathusha Wijenayake', 'Baggersee Vogt', '1485542872.jpg', '0000-00-00', 'Colombo', 'Baggersee Vogt', 0, 0),
(7, 4, 'Dinuka Salwathura', 'Barcelona Finca Guell', '1485542924.jpg', '0000-00-00', 'Colombo', 'Barcelona Finca Guell', 0, 0),
(8, 5, 'Mahinda Rajapaksha', 'Barcelona Cathedral', '1485543066.jpg', '0000-00-00', 'Colombo', 'Barcelona Cathedral', 0, 0),
(9, 6, 'Maithreepala Hitan', 'Barcelona Gotova', '1485543091.jpg', '0000-00-00', 'Colombo', 'Barcelona Gotova', 0, 0),
(10, 1, 'Lakmal Buddika', 'Munich', '1485622115.jpg', '0000-00-00', 'Colombo', 'Near my house in Munich', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `country` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilepicture` varchar(255) NOT NULL,
  `aboutme` varchar(512) NOT NULL,
  `profession` varchar(100) NOT NULL,
  `isadmin` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `country`, `email`, `password`, `profilepicture`, `aboutme`, `profession`, `isadmin`) VALUES
(1, 'Lakmal', 'Meegahapola', 'Sri Lanka', 'lakmalbuddikalucky@gmail.com', '202cb962ac59075b964b07152d234b70', '', '', '', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `photosphere`
--
ALTER TABLE `photosphere`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `photosphere`
--
ALTER TABLE `photosphere`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
