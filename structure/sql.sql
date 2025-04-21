-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ziggla_reservation;
USE ziggla_reservation;

-- Table des utilisateurs
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255) NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    loyalty_points INT DEFAULT 0,
    preferred_language VARCHAR(10) DEFAULT 'fr',
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des propriétés
CREATE TABLE properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    surface_area INT NOT NULL,
    max_occupancy INT NOT NULL,
    bedroom_count INT NOT NULL,
    bathroom_count INT NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) DEFAULT 'Royaume-Uni',
    base_price DECIMAL(10,2) NOT NULL,
    weekly_price DECIMAL(10,2) NULL,
    biweekly_price DECIMAL(10,2) NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    adults_only BOOLEAN DEFAULT TRUE,
    min_age INT DEFAULT 18,
    has_private_entrance BOOLEAN DEFAULT FALSE,
    floor_number INT NULL
);

-- Table des images des propriétés
CREATE TABLE property_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    title VARCHAR(100) NULL,
    `order` INT DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE
);

-- Table des équipements
CREATE TABLE amenities (
    amenity_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NULL
);

-- Table de relation entre propriétés et équipements
CREATE TABLE property_amenities (
    property_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE
);

-- Table des points d'intérêt
CREATE TABLE points_of_interest (
    poi_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(255) NULL,
    description TEXT NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL
);

-- Table de relation entre propriétés et points d'intérêt
CREATE TABLE property_pois (
    property_id INT NOT NULL,
    poi_id INT NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    travel_time INT NOT NULL,
    transportation_mode VARCHAR(50) DEFAULT 'walk',
    PRIMARY KEY (property_id, poi_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (poi_id) REFERENCES points_of_interest(poi_id) ON DELETE CASCADE
);

-- Table du calendrier de disponibilité
CREATE TABLE availability_calendar (
    calendar_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    custom_price DECIMAL(10,2) NULL,
    notes TEXT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    UNIQUE KEY (property_id, date)
);

-- Table des réservations
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_refunded BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded', 'partial') DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    special_requests TEXT NULL,
    cancellation_reason TEXT NULL,
    cancellation_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- Table des avis
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visibility_date TIMESTAMP NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    owner_response TEXT NULL,
    owner_response_date TIMESTAMP NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- Table des réductions
CREATE TABLE discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('percentage', 'fixed', 'loyalty') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_stay INT DEFAULT 1,
    min_bookings INT DEFAULT 0,
    start_date DATE NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT TRUE,
    code VARCHAR(50) NULL,
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE
);

-- Table des employés
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'moderator', 'support') NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table des FAQ
CREATE TABLE faqs (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) NULL,
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table des messages
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    property_id INT NULL,
    booking_id INT NULL,
    subject VARCHAR(255) NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
);

-- Table des caractéristiques de sécurité
CREATE TABLE security_features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NULL,
    description TEXT NULL
);

-- Table de relation entre propriétés et caractéristiques de sécurité
CREATE TABLE property_security (
    property_id INT NOT NULL,
    feature_id INT NOT NULL,
    PRIMARY KEY (property_id, feature_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES security_features(feature_id) ON DELETE CASCADE
);

-- Table des langues
CREATE TABLE languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL,
    icon VARCHAR(50) NULL
);

-- Table de relation entre propriétés et langues
CREATE TABLE property_languages (
    property_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY (property_id, language_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(language_id) ON DELETE CASCADE
);

-- Table des méthodes de paiement
CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    icon VARCHAR(50) NULL,
    fees_percentage DECIMAL(5,2) DEFAULT 0
);

-- Table des réseaux sociaux
CREATE TABLE social_media (
    social_id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table de la liste de diffusion
CREATE TABLE mailing_list (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    confirmation_token VARCHAR(255) NULL,
    confirmed BOOLEAN DEFAULT FALSE
);

-- Insertion des données initiales pour les équipements
INSERT INTO amenities (name, category, icon) VALUES 
('Wi-Fi gratuit', 'Internet', 'wifi'),
('Télévision à écran plat', 'High-tech', 'tv'),
('Cuisine équipée', 'Cuisine', 'kitchen'),
('Lave-vaisselle', 'Cuisine', 'dishwasher'),
('Micro-ondes', 'Cuisine', 'microwave'),
('Réfrigérateur', 'Cuisine', 'fridge'),
('Lave-linge', 'Cuisine', 'washing-machine'),
('Sèche-linge', 'Cuisine', 'dryer'),
('Baignoire spa', 'Salle de bains', 'hot-tub'),
('Douche', 'Salle de bains', 'shower'),
('Sèche-cheveux', 'Salle de bains', 'hairdryer'),
('Canapé-lit', 'Chambre', 'sofa-bed'),
('Linge de maison', 'Chambre', 'linens'),
('Fer à repasser', 'Équipements', 'iron'),
('Détecteur de fumée', 'Sécurité', 'smoke-detector'),
('Détecteur de monoxyde de carbone', 'Sécurité', 'co-detector'),
('Extincteurs', 'Sécurité', 'fire-extinguisher'),
('Entrée privée', 'Caractéristiques', 'private-entrance'),
('Vue sur la ville', 'Vues', 'city-view');

-- Insertion des données initiales pour les langues
INSERT INTO languages (name, code, icon) VALUES 
('Français', 'fr', 'flag-fr'),
('Anglais', 'en', 'flag-gb');

-- Insertion des données initiales pour les points d'intérêt
INSERT INTO points_of_interest (name, type, description) VALUES 
('Stamford Bridge - Chelsea FC Stadium', 'stade', 'Le stade de football de Chelsea FC'),
('Fulham Football Club', 'stade', 'Le stade de football de Fulham FC'),
('Fulham Palace', 'attraction', 'Ancien palais des évêques de Londres'),
('London Heathrow Airport', 'aéroport', 'Principal aéroport de Londres'),
('The Boat Race', 'événement', 'Course d\'aviron annuelle entre Oxford et Cambridge');

-- Insertion des données initiales pour les méthodes de paiement
INSERT INTO payment_methods (name, icon) VALUES 
('PayPal', 'paypal');

-- Insertion des données initiales pour les réseaux sociaux
INSERT INTO social_media (platform, url, icon) VALUES 
('TikTok', 'https://tiktok.com/ziggla', 'tiktok'),
('Facebook', 'https://facebook.com/ziggla', 'facebook'),
('Instagram', 'https://instagram.com/ziggla', 'instagram'),
('Twitter', 'https://twitter.com/ziggla', 'twitter'),
('LinkedIn', 'https://linkedin.com/company/ziggla', 'linkedin');

-- Insertion des données initiales pour les caractéristiques de sécurité
INSERT INTO security_features (name, icon) VALUES 
('Extincteurs', 'fire-extinguisher'),
('Caméras de surveillance', 'cctv'),
('Détecteurs de fumée', 'smoke-detector'),
('Alarme de sécurité', 'alarm'),
('Clés d\'accès', 'key'),
('Détecteur de monoxyde de carbone', 'co-detector');