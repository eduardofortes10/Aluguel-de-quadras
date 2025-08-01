-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conversas`
--

DROP TABLE IF EXISTS `conversas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `locador_id` int DEFAULT NULL,
  `data_inicio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `locador_id` (`locador_id`),
  CONSTRAINT `conversas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `conversas_ibfk_2` FOREIGN KEY (`locador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversas`
--

LOCK TABLES `conversas` WRITE;
/*!40000 ALTER TABLE `conversas` DISABLE KEYS */;
INSERT INTO `conversas` VALUES (1,1,6,'2025-07-23 18:40:36'),(2,1,NULL,'2025-07-23 19:13:11'),(3,1,NULL,'2025-07-23 19:13:25'),(4,1,NULL,'2025-07-23 19:14:18'),(5,1,NULL,'2025-07-23 19:14:25'),(6,1,NULL,'2025-07-23 19:27:58'),(7,1,NULL,'2025-07-23 19:38:58'),(8,1,NULL,'2025-07-23 19:40:36'),(9,6,1,'2025-07-23 20:20:40');
/*!40000 ALTER TABLE `conversas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `quadra_id` int NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `local` varchar(255) DEFAULT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  `nota` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`quadra_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (2,1,102,'Quadra de T├¬nis Pro',200.00,'Jardins, S├úo Paulo','quadra2.png',4.9),(4,3,101,'Quadra Society Alpha',180.00,'Centro, S├úo Paulo','quadra1.png',4.7);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens_quadras`
--

DROP TABLE IF EXISTS `imagens_quadras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens_quadras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_arquivo` varchar(255) NOT NULL,
  `url_completa` varchar(255) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `local` varchar(100) DEFAULT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  `avaliacao` decimal(3,1) DEFAULT NULL,
  `dono_nome` varchar(100) DEFAULT NULL,
  `dono_foto` varchar(255) DEFAULT NULL,
  `dono_email` varchar(100) DEFAULT NULL,
  `dono_telefone` varchar(20) DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens_quadras`
--

LOCK TABLES `imagens_quadras` WRITE;
/*!40000 ALTER TABLE `imagens_quadras` DISABLE KEYS */;
INSERT INTO `imagens_quadras` VALUES (1,'quadra1.png','/quadras/quadra1.png','Society','Centro, S├úo Paulo',180.00,4.7,'Carlos Almeida','https://i.imgur.com/ZvWYkBa.png','carlos@email.com','(11) 99999-1111','2025-07-18 20:48:37'),(2,'quadra2.png','/quadras/quadra2.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(3,'quadra3.png','/quadras/quadra3.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(4,'quadra4.png','/quadras/quadra4.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(5,'quadra5.png','/quadras/quadra5.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(6,'quadra6.png','/quadras/quadra6.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(7,'quadra7.png','/quadras/quadra7.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(8,'quadra8.png','/quadras/quadra8.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(9,'quadra9.png','/quadras/quadra9.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(10,'quadra10.png','/quadras/quadra10.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(11,'quadra11.png','/quadras/quadra11.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(12,'quadra12.png','/quadras/quadra12.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(13,'quadra13.png','/quadras/quadra13.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(14,'quadra14.png','/quadras/quadra14.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(15,'quadra15.png','/quadras/quadra15.png','T├¬nis','Jardins, S├úo Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-18 20:48:37'),(16,'quadras4.png','/quadras/quadras4.png','Quadra de basquete , Futsal e V├┤lei','Engenheiro Coelho, R. S├úo Bento, 328',150.00,4.6,'Paulo Scholl','https://i.imgur.com/XZ0yU1w.png','paulo@email.com','(47) 99999-9999','2025-07-18 20:48:37'),(17,'quadras5.png','/quadras/quadras5.png','Quadra poliesportiva','Fortaleza, Blumenau',240.00,4.1,'Dono Gen├®rico','https://i.imgur.com/ZvWYkBa.png','dono@email.com','(47) 98888-8888','2025-07-18 20:48:37'),(18,'imagem11.png','/quadras/imagem11.png','Quadra poliesportiva','Fortaleza, Blumenau',240.00,4.1,'Dono Gen├®rico','https://i.imgur.com/ZvWYkBa.png','dono@email.com','(47) 98888-8888','2025-07-18 20:48:37'),(19,'quadras2.png','/quadras/quadras2.png','Quadra poliesportiva','Fortaleza, Blumenau',240.00,4.1,'Dono Gen├®rico','https://i.imgur.com/ZvWYkBa.png','dono@email.com','(47) 98888-8888','2025-07-18 20:48:37'),(20,'quadras10.png','/quadras/quadras10.png','Quadra poliesportiva','Fortaleza, Blumenau',240.00,4.1,'Dono Gen├®rico','https://i.imgur.com/ZvWYkBa.png','dono@email.com','(47) 98888-8888','2025-07-18 20:48:37'),(21,'quadras3.png','/quadras/quadras3.png','Quadra de areia para v├┤lei ou futev├┤lei','Itoupava, Blumenau',140.00,4.2,'Dono Gen├®rico','https://i.imgur.com/ZvWYkBa.png','dono@email.com','(47) 98888-8888','2025-07-18 20:48:37');
/*!40000 ALTER TABLE `imagens_quadras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagens`
--

DROP TABLE IF EXISTS `mensagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversa_id` int DEFAULT NULL,
  `autor_id` int DEFAULT NULL,
  `mensagem` text,
  `data_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `conversa_id` (`conversa_id`),
  KEY `autor_id` (`autor_id`),
  CONSTRAINT `mensagens_ibfk_1` FOREIGN KEY (`conversa_id`) REFERENCES `conversas` (`id`),
  CONSTRAINT `mensagens_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens`
--

LOCK TABLES `mensagens` WRITE;
/*!40000 ALTER TABLE `mensagens` DISABLE KEYS */;
INSERT INTO `mensagens` VALUES (2,2,1,'ola tudo bem?','2025-07-23 19:13:11'),(3,3,1,'ola teste','2025-07-23 19:13:25'),(4,4,1,'ola ','2025-07-23 19:14:18'),(5,5,1,'????????????','2025-07-23 19:14:25'),(6,6,1,'ola','2025-07-23 19:27:58'),(7,7,1,'ola','2025-07-23 19:38:58'),(8,8,1,'ola','2025-07-23 19:40:36'),(14,1,6,'top','2025-07-23 20:25:06'),(15,1,6,'legal','2025-07-23 20:26:49'),(16,1,6,'top','2025-07-23 20:29:15'),(18,1,6,'oalaalala','2025-07-24 21:13:49');
/*!40000 ALTER TABLE `mensagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quadras`
--

DROP TABLE IF EXISTS `quadras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quadras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `local` varchar(150) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  `avaliacao` decimal(3,1) DEFAULT NULL,
  `dono_id` int NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` varchar(100) DEFAULT NULL,
  `dono_nome` varchar(100) DEFAULT NULL,
  `dono_foto` varchar(255) DEFAULT NULL,
  `dono_email` varchar(100) DEFAULT NULL,
  `dono_telefone` varchar(20) DEFAULT NULL,
  `imagem_id` int DEFAULT NULL,
  `descricao` text,
  `nota` decimal(2,1) DEFAULT '0.0',
  PRIMARY KEY (`id`),
  KEY `dono_id` (`dono_id`),
  KEY `imagem_id` (`imagem_id`),
  CONSTRAINT `quadras_ibfk_1` FOREIGN KEY (`dono_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quadras_ibfk_2` FOREIGN KEY (`imagem_id`) REFERENCES `imagens_quadras` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadras`
--

LOCK TABLES `quadras` WRITE;
/*!40000 ALTER TABLE `quadras` DISABLE KEYS */;
INSERT INTO `quadras` VALUES (101,'Quadra Society Alpha','Centro, S├úo Paulo',180.00,NULL,4.7,1,'2025-07-18 22:47:12','Society',NULL,NULL,NULL,NULL,1,NULL,0.0),(102,'Quadra de T├¬nis Pro','Jardins, S├úo Paulo',200.00,NULL,4.9,1,'2025-07-18 22:47:12','T├¬nis',NULL,NULL,NULL,NULL,2,NULL,0.0),(103,'Quadra Coberta Elite','Mooca, S├úo Paulo',120.00,NULL,4.5,1,'2025-07-18 22:47:12','Futsal',NULL,NULL,NULL,NULL,3,NULL,0.0),(104,'Quadra Beach Vibe','Guaruj├í, S├úo Paulo',150.00,NULL,4.6,1,'2025-07-18 22:47:12','Beach Tennis',NULL,NULL,NULL,NULL,4,NULL,0.0),(105,'Arena Basquete Top','Barra Funda, S├úo Paulo',170.00,NULL,4.8,1,'2025-07-18 22:47:12','Basquete',NULL,NULL,NULL,NULL,5,NULL,0.0),(106,'Quadra V├┤lei Master','Santana, S├úo Paulo',140.00,NULL,4.3,1,'2025-07-18 22:47:12','V├┤lei',NULL,NULL,NULL,NULL,6,NULL,0.0),(107,'Quadra Arena 7','Pinheiros, S├úo Paulo',160.00,NULL,4.5,1,'2025-07-18 22:47:12','Society',NULL,NULL,NULL,NULL,7,NULL,0.0),(108,'Quadra Fast Play','Aclima├º├úo, S├úo Paulo',110.00,NULL,4.2,1,'2025-07-18 22:47:12','Futsal',NULL,NULL,NULL,NULL,8,NULL,0.0),(109,'Quadra Rio Beach','Copacabana, Rio de Janeiro',160.00,NULL,4.6,1,'2025-07-18 22:47:12','Beach Tennis',NULL,NULL,NULL,NULL,9,NULL,0.0),(110,'Arena do Sul','Florian├│polis, SC',130.00,NULL,4.1,1,'2025-07-18 22:47:12','Basquete',NULL,NULL,NULL,NULL,10,NULL,0.0),(111,'Quadra Master Top','Campo Limpo, S├úo Paulo',150.00,NULL,4.4,1,'2025-07-18 22:47:12','Society',NULL,NULL,NULL,NULL,11,NULL,0.0),(112,'Quadra de T├¬nis Pro','Jardins, S├úo Paulo',200.00,NULL,4.9,1,'2025-07-18 22:43:18','T├¬nis',NULL,NULL,NULL,NULL,2,NULL,0.0),(113,'Quadra da Lagoa','Lagoa, Rio de Janeiro',210.00,NULL,4.9,1,'2025-07-18 22:47:12','T├¬nis',NULL,NULL,NULL,NULL,12,NULL,0.0),(114,'Arena Sport 360','Campinas, S├úo Paulo',125.00,NULL,4.7,1,'2025-07-18 22:47:12','Futsal',NULL,NULL,NULL,NULL,13,NULL,0.0),(115,'Quadra Sol & Areia','Ilhabela, SP',170.00,NULL,4.8,1,'2025-07-18 22:47:12','Beach Tennis',NULL,NULL,NULL,NULL,14,NULL,0.0),(116,'Arena Basketball ZN','Zona Norte, S├úo Paulo',155.00,NULL,4.2,1,'2025-07-18 22:47:12','Basquete',NULL,NULL,NULL,NULL,15,NULL,0.0),(117,'Quadra Pro Society','S├úo Caetano, S├úo Paulo',165.00,NULL,4.6,1,'2025-07-18 22:47:12','Society',NULL,NULL,NULL,NULL,16,NULL,0.0),(118,'Quadra Futsal Roots','Osasco, S├úo Paulo',115.00,NULL,4.3,1,'2025-07-18 22:47:12','Futsal',NULL,NULL,NULL,NULL,17,NULL,0.0),(119,'Beach Tennis Arena RJ','Leblon, Rio de Janeiro',175.00,NULL,4.9,1,'2025-07-18 22:47:12','Beach Tennis',NULL,NULL,NULL,NULL,18,NULL,0.0),(120,'Quadra Elite Hoops','Bela Vista, S├úo Paulo',145.00,NULL,4.5,1,'2025-07-18 22:47:12','Basquete',NULL,NULL,NULL,NULL,19,NULL,0.0),(121,'T├¬nis Clube Pro','Itaim Bibi, S├úo Paulo',220.00,NULL,4.9,1,'2025-07-18 22:47:12','T├¬nis',NULL,NULL,NULL,NULL,20,NULL,0.0),(129,'quadra ','Eng city',180.00,'[\"/uploads/1753403123912-teste6.jpg\",\"/uploads/1753403123925-teste5.jpg\",\"/uploads/1753403123961-teste4.jpeg\"]',NULL,2,'2025-07-25 00:25:23','Basquete',NULL,NULL,NULL,NULL,NULL,'Quadra',0.0);
/*!40000 ALTER TABLE `quadras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` enum('cliente','locador') NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'joao silva','joao@gmail.com','$2b$10$bDM0g.7whkxjj7Png.DXvOn8hWbGsdxwJ.79S1JUXYnkewOOWmxvy','cliente','2025-07-18 05:41:40'),(2,'vasco Silva','vasco1@gmail.com','$2b$10$YoNHSSlLoWyLR6M5kSaCWeqemro9zOykfCnKrA2mYgC2y/IUloTUu','locador','2025-07-18 05:57:02'),(3,'roberto cartola','robertin@gmail.com','$2b$10$h03aMbhbrLM3HuyyV12foekQS1ONbM5G3cD30kKRZaBHXl7t1yfp2','cliente','2025-07-18 22:50:40'),(6,'luciana  silva','luciana@email.com','$2b$10$MWtU/zEglUeei9da7jGKHOl8DIghc26HAr2atmgkK0ugwr34v/d/K','locador','2025-07-19 17:15:54');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-27 14:04:41
