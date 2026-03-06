-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 27 nov. 2025 à 08:39
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `osc`
--

-- --------------------------------------------------------

--
-- Structure de la table `commandant_cr`
--

CREATE TABLE `commandant_cr` (
  `matriculeCR` varchar(50) NOT NULL,
  `nomCR` varchar(255) NOT NULL,
  `passCR` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commandant_cr`
--

INSERT INTO `commandant_cr` (`matriculeCR`, `nomCR`, `passCR`) VALUES
('MZ11', 'Honoré', '$2b$12$Rz1c5S7ZTsrUJfYDMQBiuOOhoWqUest61zQzAR06vA/ZoYD9QpkyK'),
('MZ12', 'Sira', '$2b$12$hTlA/MN1eTbyHitYp/pp5.0cnoYXvGcKD7.QJIgiuOePAVQ0w9rEu');

-- --------------------------------------------------------

--
-- Structure de la table `courrier`
--

CREATE TABLE `courrier` (
  `numero_ordre` int(11) NOT NULL,
  `objet` varchar(255) NOT NULL,
  `nombre_piece` int(11) DEFAULT 0,
  `contenu` text NOT NULL,
  `confirmation` tinyint(1) DEFAULT NULL,
  `idTransmetteur` int(11) NOT NULL,
  `idRecepteur` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_validation_cr` timestamp NULL DEFAULT NULL COMMENT 'Date validation par CR',
  `date_confirmation` timestamp NULL DEFAULT NULL COMMENT 'Date confirmation par récepteur',
  `etat` enum('en_instance','a_classer','a_traiter','en_cours','termine') DEFAULT NULL COMMENT 'État de traitement (activé après confirmation)',
  `date_envoi` timestamp NULL DEFAULT NULL COMMENT 'Date envoi par émetteur'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `courrier`
--

INSERT INTO `courrier` (`numero_ordre`, `objet`, `nombre_piece`, `contenu`, `confirmation`, `idTransmetteur`, `idRecepteur`, `created_at`, `updated_at`, `date_validation_cr`, `date_confirmation`, `etat`, `date_envoi`) VALUES
(1, 'demade de conger ', 1, 'vilam matum psika bum', 1, 3, 4, '2025-10-22 04:13:53', '2025-11-03 05:20:33', '2025-10-22 10:31:27', '2025-10-22 10:32:53', NULL, '2025-10-22 04:13:53'),
(2, 'test', 2, 'test', 1, 3, 5, '2025-10-22 04:14:37', '2025-11-03 05:20:33', '2025-10-22 10:30:51', '2025-10-22 15:04:02', NULL, '2025-10-22 04:14:37'),
(3, 'ping', 1, 'test', 1, 4, 3, '2025-10-22 10:34:02', '2025-11-03 05:20:33', '2025-10-22 10:35:35', '2025-10-22 10:35:50', NULL, '2025-10-22 10:34:02'),
(7, '1 message non lu', 1, '\n© - Hanta +261 34 68 414 55\nBsr. Miamp)y iandray ny nareo\n\nLundi 16h : Anglais 1G Gp2 salle 012\nMardi 16h : Anglais 1G Gp1 salle 106\nVendredi 8h : Anglais 1G.Gp2 salle 106\nVendredi 14h : Anglais 1G Gp1 salle 102\nAmpitao azafd\n\nMisaotra\n\n[(e] Message [0] (0) O', 1, 3, 5, '2025-10-23 19:13:25', '2025-11-06 06:58:42', '2025-10-27 05:50:49', '2025-11-04 07:18:48', 'termine', '2025-10-23 19:13:25'),
(11, 'Evaluation devhunt 5.0', 1, 'Bonsoir,\nVoici la détails de l\'évaluation selon les critères suivants:\n. Innovation: 2/3\nD technique: 2/2\nQualité: 5/5\nPrésentation: 4.75 /5\nTotal: 15.75 / 20\nRang: 4\nOn vous encourage à toujours participer à des compétitions. une bonne continuation\nCordialement\nMerci pour vos encouragements. || Bienreçu, mercibeaucoup. || MERCI BEAUCOUI', 1, 3, 5, '2025-10-24 05:52:58', '2025-11-03 05:45:42', '2025-10-27 05:50:44', '2025-11-03 05:45:39', 'a_classer', '2025-10-24 05:52:58'),
(15, 'test ', 1, 'test', 0, 5, 3, '2025-10-27 05:39:18', '2025-11-03 05:20:33', '2025-10-27 05:50:39', NULL, NULL, '2025-10-27 05:39:18'),
(16, 'Evaluation Devhunt 5.0', 0, 'Bonsoir,\nVoici la détails de l\'évaluation selon les critères suivants:\n. Innovation: 2 3\nD technique: 2/2\no 213\n52517\nPrésentation: 45 /5 +\n+ Total: 15.75 / 20\nRang: 4\nOn vous encourage à toujours participer à des compét une bonne continuation\nCordialement\nMerci pour vos encouragements. || Bienreçu, mercibeaucoup. || MERCI BEAUCOUI\ne r ù v', 0, 5, 3, '2025-10-27 05:40:21', '2025-11-03 05:20:33', '2025-10-27 05:41:32', NULL, NULL, '2025-10-27 05:40:21'),
(17, 'Informations personnelles enregistrées', 0, 'Bonjour Stephano Sido,\nVoici vos informations enregistrées :\nNB : Le format de la date à utiliser est j/MM/aaaa. Par exemple, le 30 janvier 2002 s\'écrit : 30/01/2002\nMatricule : 1611H-F\nNom(s) : RANDRIANANTENAINA\nPrénom(s): Stephano Sido\nDate de naissance : 12/04/2003\nLieu de naissance : Antananarivo\nN° Téléphone : +261 34 10 781 73\nE-Mail : randrianantenainastephano1611@gmail. com\nAdresse éxacte : Residence Com CR\nN° CIN: 216 011 031 776\nLieu de délivrance CIN : IHOSY\nDate de délivrance CIN : 03/03/2022\nMerci de bien vouloir vérifier les informations et les confirmer. En cas de réclamation, n\'hésitez pas à contacter votre délégué.\nCordialement Zaho-Moi-Meme.', 1, 5, 5, '2025-10-27 05:47:07', '2025-11-03 05:45:34', '2025-10-27 05:48:27', '2025-11-03 05:45:12', 'termine', '2025-10-27 05:47:07'),
(18, 'Rapport de gestion de projet', 0, 'Rapport gestion de projet\n\nYour response has been recorded.\n\nSubmit another response\n\n‘This content is neïther created nor endorsed by Google. - Contact form owner - Terms of Service - Privacy Policy\nDoes this form look suspicious? Report\n\nGoogle Forms', 0, 5, 3, '2025-10-27 05:50:02', '2025-11-03 05:20:33', '2025-10-27 05:50:31', NULL, NULL, '2025-10-27 05:50:02'),
(22, 'Résultats de l\'évaluation Devhunt 5.0', 0, 'Bonsoir,\nVoici les détails de l\'évaluation selon les critères suivants:\n\nInnovation: 2/3\nTechnique: 2/2\nQualité: 5.25/7\nPrésentation: 4.5/5\nTotal: 15.75/20\nRang: 4\n\nOn vous encourage à toujours participer à des compétitions. Bonne continuation.\n\nCordialement\n\nMerci pour vos encouragements. || Bien reçu, merci beaucoup. || MERCI BEAUCOUP', NULL, 5, 6, '2025-11-27 06:11:49', '2025-11-27 06:11:49', NULL, NULL, NULL, '2025-11-27 06:11:49');

-- --------------------------------------------------------

--
-- Structure de la table `responsable_cab`
--

CREATE TABLE `responsable_cab` (
  `matriculeResponsable` varchar(50) NOT NULL,
  `nomResponsable` varchar(255) NOT NULL,
  `passResponsable` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `responsable_cab`
--

INSERT INTO `responsable_cab` (`matriculeResponsable`, `nomResponsable`, `passResponsable`) VALUES
('1', 'sido', '$2b$12$CEIoVguCxqzeIb1OBDP3Iu22IuyJxSLjX2nqfYMYShhpiPzo5ZkTW'),
('2', 'admin', '$2b$12$qzhn6lPK7XWVcZCTi3F5u.Fx105WhRyZTS7F6NkXSlU2Is9pdY0GC');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `matriculeUtilisateur` int(11) NOT NULL,
  `nomUtilisateur` varchar(100) NOT NULL,
  `PassUtilisateur` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`matriculeUtilisateur`, `nomUtilisateur`, `PassUtilisateur`) VALUES
(3, 'sido', '$2b$12$FoNRVORTpIYV3NWqJIsp3ekZY0Sn/TNlK/OPeEfsnZ.Oz1tQLLpSq'),
(4, 'steven', '$2b$12$6iMx8ZCDvt9CMvVN9CcsP.X0YX30nbeWXmuZoGkinPqNh/oh8MV02'),
(5, 'steffy', '$2b$12$gdAWUjKmsa12.lTxvRgA0uD3QG/zfwEVvrUKTbNGnubdH6gMYDi7K'),
(6, 'Black Ops', '$2b$12$P2K1O/rZSLfkQH9qmdvxVOLXKaRC/ouFiE3E79OYwVPeYrrMaQWua'),
(7, 'fin', '$2b$12$4n8e2FLmj/wL9EYXaTSCpejjCZ4de5liNRLnZOrOMWsIS3.bzP.VS');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commandant_cr`
--
ALTER TABLE `commandant_cr`
  ADD PRIMARY KEY (`matriculeCR`);

--
-- Index pour la table `courrier`
--
ALTER TABLE `courrier`
  ADD PRIMARY KEY (`numero_ordre`),
  ADD KEY `idx_transmetteur` (`idTransmetteur`),
  ADD KEY `idx_recepteur` (`idRecepteur`),
  ADD KEY `idx_confirmation` (`confirmation`);

--
-- Index pour la table `responsable_cab`
--
ALTER TABLE `responsable_cab`
  ADD PRIMARY KEY (`matriculeResponsable`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`matriculeUtilisateur`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `courrier`
--
ALTER TABLE `courrier`
  MODIFY `numero_ordre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `matriculeUtilisateur` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `courrier`
--
ALTER TABLE `courrier`
  ADD CONSTRAINT `courrier_ibfk_1` FOREIGN KEY (`idTransmetteur`) REFERENCES `utilisateur` (`matriculeUtilisateur`) ON DELETE CASCADE,
  ADD CONSTRAINT `courrier_ibfk_2` FOREIGN KEY (`idRecepteur`) REFERENCES `utilisateur` (`matriculeUtilisateur`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
