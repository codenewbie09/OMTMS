-- Seed admin user
INSERT INTO user_t (name, email, phone, address, password, role)
VALUES ('Admin', 'admin@omtms.com', '1234567890', 'Admin Office', '$2a$10$YourEncodedPasswordHere', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Get the user_id for the admin and insert into admin table
DO $$
DECLARE
    admin_user_id BIGINT;
BEGIN
    SELECT user_id INTO admin_user_id FROM user_t WHERE email = 'admin@omtms.com';
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO admin_t (user_id, created_at)
        VALUES (admin_user_id, NOW())
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;
