-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
  `telefone` varchar(20) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'joao Fortes','joao@gmail.com','$2b$10$bDM0g.7whkxjj7Png.DXvOn8hWbGsdxwJ.79S1JUXYnkewOOWmxvy','cliente','2025-07-18 05:41:40','19999387274','2008-06-11'),(2,'vasco Silva','vasco1@gmail.com','$2b$10$YoNHSSlLoWyLR6M5kSaCWeqemro9zOykfCnKrA2mYgC2y/IUloTUu','locador','2025-07-18 05:57:02','(11) 91234-5678','2006-08-02'),(3,'roberto cartola','robertin@gmail.com','$2b$10$h03aMbhbrLM3HuyyV12foekQS1ONbM5G3cD30kKRZaBHXl7t1yfp2','cliente','2025-07-18 22:50:40','(11) 91234-5678','2006-08-02'),(6,'luciana  silva','luciana@email.com','$2b$10$MWtU/zEglUeei9da7jGKHOl8DIghc26HAr2atmgkK0ugwr34v/d/K','locador','2025-07-19 17:15:54','(11) 91234-5678','2006-08-02');
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

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fotos_perfil`
--

DROP TABLE IF EXISTS `fotos_perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fotos_perfil` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `imagem_url` varchar(255) NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fotos_perfil_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fotos_perfil`
--

LOCK TABLES `fotos_perfil` WRITE;
/*!40000 ALTER TABLE `fotos_perfil` DISABLE KEYS */;
INSERT INTO `fotos_perfil` VALUES (1,1,'user_1754155267278.png','2025-08-02 17:21:07'),(2,1,'user_1754155271621.png','2025-08-02 17:21:11'),(3,1,'user_1754155422820.png','2025-08-02 17:23:42'),(4,1,'user_1754155596248.png','2025-08-02 17:26:36'),(5,1,'user_1754155658952.png','2025-08-02 17:27:39'),(6,3,'user_1754155833951.png','2025-08-02 17:30:33'),(7,6,'user_1754156206769.png','2025-08-02 17:36:46');
/*!40000 ALTER TABLE `fotos_perfil` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
  `imagem_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens_quadras`
--

LOCK TABLES `imagens_quadras` WRITE;
/*!40000 ALTER TABLE `imagens_quadras` DISABLE KEYS */;
INSERT INTO `imagens_quadras` VALUES (27,'quadra1.png','/quadras/quadra1.png','Society','Centro, São Paulo',180.00,4.7,'Carlos Almeida','https://i.imgur.com/ZvWYkBa.png','carlos@email.com','(11) 99999-1111','2025-07-27 18:11:07',NULL),(28,'quadra2.png','/quadras/quadra2.png','Futsal','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(29,'quadra3.png','/quadras/quadra3.png','Society','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(30,'quadra4.png','/quadras/quadra4.png','Futsal','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(31,'quadra5.png','/quadras/quadra5.png','Golfe','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(32,'quadra6.png','/quadras/quadra6.png','Golfe','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(33,'quadra7.png','/quadras/quadra7.png','Futebol','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(34,'quadra8.png','/quadras/quadra8.png','Futebol','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(35,'quadra9.png','/quadras/quadra9.png','tênis','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(36,'quadra10.png','/quadras/quadra10.png','Poliesportiva','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(37,'quadra11.png','/quadras/quadra11.png','tênis','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(38,'quadra12.png','/quadras/quadra12.png','tênis','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(39,'quadra13.png','/quadras/quadra13.png','Society','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(40,'quadra14.png','/quadras/quadra14.png','tênis','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(41,'quadra15.png','/quadras/quadra15.png','tênis','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(42,'quadra16.png','/quadras/quadra16.png','Vôlei','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(43,'quadra17.png','/quadras/quadra17.png','Vôlei','Canal 3 , Santos',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(44,'quadra18.png','/quadras/quadra18.png','Vôlei','Canal 1 , Santos',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(45,'quadra19.png','/quadras/quadra19.png','Basquete','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(46,'quadra20.png','/quadras/quadra20.png','Basquete','Jardins, São Paulo',200.00,4.9,'Luciana Prado','https://i.imgur.com/XZ0yU1w.png','luciana@email.com','(11) 98888-2222','2025-07-27 18:11:07',NULL),(47,'quadras4.png','/quadras/quadras4.png','Poliesportiva','Engenheiro Coelho, R. São Bento, 328',150.00,4.6,'Paulo Scholl','https://i.imgur.com/XZ0yU1w.png','paulo@email.com','(47) 99999-9999','2025-07-27 18:11:07',NULL);
/*!40000 ALTER TABLE `imagens_quadras` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
  `imagens` text,
  PRIMARY KEY (`id`),
  KEY `dono_id` (`dono_id`),
  KEY `imagem_id` (`imagem_id`),
  CONSTRAINT `quadras_ibfk_1` FOREIGN KEY (`dono_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quadras_ibfk_2` FOREIGN KEY (`imagem_id`) REFERENCES `imagens_quadras` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadras`
--

LOCK TABLES `quadras` WRITE;
/*!40000 ALTER TABLE `quadras` DISABLE KEYS */;
INSERT INTO `quadras` VALUES (143,'Quadra de Basquete ','Canal 5 , Santos,SP',190.00,NULL,2,'2025-07-27 21:14:53','Futebol',NULL,NULL,NULL,NULL,NULL,'Quadra de basquete com vestiários e banheiros ',0.0,'[\"/uploads/1753650893485-quadra18.png\",\"/uploads/1753650893485-quadra19.png\",\"/uploads/1753650893493-quadra20.png\"]');
/*!40000 ALTER TABLE `quadras` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (2,1,102,'Quadra de Tênis Pro',200.00,'Jardins, São Paulo','quadra2.png',4.9),(4,3,101,'Quadra Society Alpha',180.00,'Centro, São Paulo','quadra1.png',4.7),(5,1,117,'Quadra de Vôlei Pro',200.00,'Canal 3 , Santos','quadra17.png',4.9),(6,1,107,'Campo de futebol',200.00,'Jardins, São Paulo','quadra7.png',4.9),(7,1,103,'Quadra de Scociety',200.00,'Jardins, São Paulo','quadra3.png',4.9);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notificacoes`
--

DROP TABLE IF EXISTS `notificacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `mensagem` text NOT NULL,
  `lida` tinyint(1) DEFAULT '0',
  `data` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notificacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacoes`
--

LOCK TABLES `notificacoes` WRITE;
/*!40000 ALTER TABLE `notificacoes` DISABLE KEYS */;
INSERT INTO `notificacoes` VALUES (24,1,'aluguel','Você alugou a quadra Quadra de Futsal',0,'2025-08-01 22:00:21'),(25,1,'aluguel','Você alugou a quadra Quadra de Futsal',0,'2025-08-01 22:27:50'),(26,3,'aluguel','Você alugou a quadra Quadra de Scociety',0,'2025-08-01 22:46:26'),(27,1,'aluguel','Você alugou a quadra Quadra de Futsal',0,'2025-08-02 13:34:43'),(31,6,'mensagem','Você recebeu uma nova mensagem.',0,'2025-08-02 14:48:41'),(32,2,'mensagem','Você recebeu uma nova mensagem.',0,'2025-08-02 16:51:12'),(33,6,'mensagem','Você recebeu uma nova mensagem.',0,'2025-08-02 16:51:36');
/*!40000 ALTER TABLE `notificacoes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversas`
--

LOCK TABLES `conversas` WRITE;
/*!40000 ALTER TABLE `conversas` DISABLE KEYS */;
INSERT INTO `conversas` VALUES (1,1,6,'2025-07-23 18:40:36'),(2,1,NULL,'2025-07-23 19:13:11'),(3,1,NULL,'2025-07-23 19:13:25'),(4,1,NULL,'2025-07-23 19:14:18'),(5,1,NULL,'2025-07-23 19:14:25'),(6,1,NULL,'2025-07-23 19:27:58'),(7,1,NULL,'2025-07-23 19:38:58'),(8,1,NULL,'2025-07-23 19:40:36'),(10,3,2,'2025-08-02 16:51:12'),(11,3,6,'2025-08-02 16:51:36');
/*!40000 ALTER TABLE `conversas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:35


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens`
--

LOCK TABLES `mensagens` WRITE;
/*!40000 ALTER TABLE `mensagens` DISABLE KEYS */;
INSERT INTO `mensagens` VALUES (2,2,1,'ola tudo bem?','2025-07-23 19:13:11'),(3,3,1,'ola teste','2025-07-23 19:13:25'),(4,4,1,'ola ','2025-07-23 19:14:18'),(5,5,1,'????????????','2025-07-23 19:14:25'),(6,6,1,'ola','2025-07-23 19:27:58'),(7,7,1,'ola','2025-07-23 19:38:58'),(8,8,1,'ola','2025-07-23 19:40:36'),(14,1,6,'top','2025-07-23 20:25:06'),(15,1,6,'legal','2025-07-23 20:26:49'),(16,1,6,'top','2025-07-23 20:29:15'),(18,1,6,'oalaalala','2025-07-24 21:13:49'),(19,1,6,'teste','2025-07-31 19:05:04'),(20,1,6,'teste 2','2025-07-31 19:10:04'),(21,1,1,'ola ','2025-08-02 14:48:41'),(22,10,3,'Olá, gostaria de saber mais sobre o aluguel.','2025-08-02 16:51:12'),(23,11,3,'Olá, gostaria de saber mais sobre o aluguel.','2025-08-02 16:51:36');
/*!40000 ALTER TABLE `mensagens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:35


-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aluguel_quadras
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alugueis`
--

DROP TABLE IF EXISTS `alugueis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alugueis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `quadra_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fim` time DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagem_url` varchar(255) DEFAULT NULL,
  `observacoes` text,
  `valor_pago` decimal(10,2) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`cliente_id`),
  KEY `fk_aluguel_imagem` (`quadra_id`),
  CONSTRAINT `alugueis_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alugueis`
--

LOCK TABLES `alugueis` WRITE;
/*!40000 ALTER TABLE `alugueis` DISABLE KEYS */;
INSERT INTO `alugueis` VALUES (10,1,102,'2025-08-11','14:00:00','16:00:00','2025-08-02 16:52:13','quadra2.png',NULL,400.00,'Quadra de Futsal'),(11,1,101,'2025-08-11','13:00:00','15:00:00','2025-08-02 17:01:49','quadra1.png','quero uma bola de futsal ',360.00,'Quadra Society Alpha');
/*!40000 ALTER TABLE `alugueis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-02 18:05:36


