-- POINT+ Seed Data for Games and Products
-- All 7 Official Games and Products

INSERT INTO games (id, slug, name, description, logo, banner, active, has_server_id, player_label, server_label)
VALUES 
(1, 'mobile-legends', 'Mobile Legends: Bang Bang', 'Top up Diamonds & Weekly Diamond Pass Mobile Legends resmi dan terpercaya. Pengiriman cepat langsung masuk ke akun Anda.', '/images/games/mobile-legends/logo.webp', '/images/games/mobile-legends/banner.webp', true, true, 'User ID', 'Zone ID'),
(2, 'free-fire', 'Free Fire', 'Beli Diamonds Free Fire resmi Garena. Proses instan 24 jam dengan harga termurah dan verifikasi QRIS otomatis.', '/images/games/free-fire/logo.webp', '/images/games/free-fire/banner.webp', true, false, 'Player ID', NULL),
(3, 'pubg-mobile', 'PUBG Mobile', 'Isi Unknown Cash (UC) PUBG Mobile resmi Tencent VNG. Buka Royale Pass dan upgrade skin senjata impianmu.', '/images/games/pubg-mobile/logo.webp', '/images/games/pubg-mobile/banner.webp', true, false, 'Player ID', NULL),
(4, 'valorant', 'VALORANT', 'Beli Valorant Points (VP) resmi Riot Games. Beli skin bundle favoritmu dan raih rank Radiant.', '/images/games/valorant/logo.webp', '/images/games/valorant/banner.webp', true, false, 'Riot ID (Nama#Tag)', NULL),
(5, 'honor-of-kings', 'Honor of Kings', 'Top up Tokens Honor of Kings resmi Level Infinite. Dapatkan hero dan skin spektakuler di Arena Gorge.', '/images/games/honor-of-kings/logo.webp', '/images/games/honor-of-kings/banner.webp', true, false, 'Player ID', NULL),
(6, 'genshin-impact', 'Genshin Impact', 'Beli Genesis Crystals resmi Genshin Impact HoYoverse. Gacha karakter bintang 5 impianmu di Teyvat.', '/images/games/genshin-impact/logo.webp', '/images/games/genshin-impact/banner.webp', true, true, 'UID', 'Server (Asia/America/Europe/TW)'),
(7, 'roblox', 'Roblox', 'Beli Robux resmi Roblox. Nikmati jutaan game karya komunitas dengan outfit dan avatar terkeren.', '/images/games/roblox/logo.webp', '/images/games/roblox/banner.webp', true, false, 'Roblox Username', NULL)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    logo = EXCLUDED.logo,
    banner = EXCLUDED.banner,
    has_server_id = EXCLUDED.has_server_id;

-- Products for Mobile Legends
INSERT INTO products (game_id, name, amount, price, active) VALUES
(1, '86 Diamonds', '86', 21000, true),
(1, '172 Diamonds', '172', 42000, true),
(1, '257 Diamonds', '257', 63000, true),
(1, '344 Diamonds', '344', 84000, true),
(1, '429 Diamonds', '429', 105000, true),
(1, '514 Diamonds', '514', 126000, true),
(1, '706 Diamonds', '706', 172000, true),
(1, '878 Diamonds', '878', 215000, true),
(1, '1050 Diamonds', '1050', 257000, true),
(1, 'Weekly Diamond Pass', '1 Pass', 28500, true);

-- Products for Free Fire
INSERT INTO products (game_id, name, amount, price, active) VALUES
(2, '70 Diamonds', '70', 9500, true),
(2, '140 Diamonds', '140', 19000, true),
(2, '355 Diamonds', '355', 48000, true),
(2, '720 Diamonds', '720', 95000, true),
(2, '1450 Diamonds', '1450', 190000, true),
(2, '2180 Diamonds', '2180', 285000, true),
(2, '3640 Diamonds', '3640', 475000, true);

-- Products for PUBG Mobile
INSERT INTO products (game_id, name, amount, price, active) VALUES
(3, '60 UC', '60', 14500, true),
(3, '325 UC', '325', 73000, true),
(3, '660 UC', '660', 145000, true),
(3, '1800 UC', '1800', 365000, true),
(3, '3850 UC', '3850', 73000, true),
(3, '8100 UC', '8100', 1460000, true);

-- Products for VALORANT
INSERT INTO products (game_id, name, amount, price, active) VALUES
(4, '475 VP', '475', 55000, true),
(4, '1000 VP', '1000', 110000, true),
(4, '2050 VP', '2050', 220000, true),
(4, '3650 VP', '3650', 385000, true),
(4, '5350 VP', '5350', 550000, true),
(4, '11000 VP', '11000', 1100000, true);

-- Products for Honor of Kings
INSERT INTO products (game_id, name, amount, price, active) VALUES
(5, '80 Tokens', '80', 15000, true),
(5, '240 Tokens', '240', 45000, true),
(5, '400 Tokens', '400', 75000, true),
(5, '560 Tokens', '560', 105000, true),
(5, '830 Tokens', '830', 150000, true);

-- Products for Genshin Impact
INSERT INTO products (game_id, name, amount, price, active) VALUES
(6, '60 Genesis Crystals', '60', 16000, true),
(6, '300 Genesis Crystals', '300', 79000, true),
(6, '980 Genesis Crystals', '980', 249000, true),
(6, '1980 Genesis Crystals', '1980', 479000, true),
(6, '3280 Genesis Crystals', '3280', 799000, true),
(6, '6480 Genesis Crystals', '6480', 1599000, true);

-- Products for Roblox
INSERT INTO products (game_id, name, amount, price, active) VALUES
(7, '80 Robux', '80', 15000, true),
(7, '400 Robux', '400', 75000, true),
(7, '800 Robux', '800', 150000, true),
(7, '1700 Robux', '1700', 300000, true),
(7, '4500 Robux', '4500', 750000, true);
