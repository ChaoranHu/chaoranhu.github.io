-- One time update (October 2026) for a database created before the region column existed:
-- adds the state or province code and fills it in for the cities counted so far.
ALTER TABLE cities ADD COLUMN region TEXT NOT NULL DEFAULT '';
UPDATE cities SET region = 'MI' WHERE country = 'US' AND city = 'Detroit';
UPDATE cities SET region = 'IN' WHERE country = 'US' AND city = 'Carmel';
UPDATE cities SET region = 'OH' WHERE country = 'US' AND city = 'Columbus';
UPDATE cities SET region = 'NJ' WHERE country = 'US' AND city = 'Linden';
UPDATE cities SET region = 'IL' WHERE country = 'US' AND city = 'Frankfort';
UPDATE cities SET region = 'LA' WHERE country = 'US' AND city = 'Mandeville';
UPDATE cities SET region = 'TX' WHERE country = 'US' AND city = 'Houston';
UPDATE cities SET region = 'MA' WHERE country = 'US' AND city = 'Cambridge';
UPDATE cities SET region = 'IL' WHERE country = 'US' AND city = 'Chicago';
UPDATE cities SET region = 'NY' WHERE country = 'US' AND city = 'New York City';
