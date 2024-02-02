/* 

turso db shell my-db

turso db create my-db
turso db show my-db
turso db tokens create my-db

turso auth login
turso db locations

*/

CREATE TABLE users (
    userid INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    username TEXT NOT NULL,
    created DATE DEFAULT CURRENT_DATE
);

-- INSERT INTO users (userid, email, password, username, created) VALUES
-- (1, 'demo1@example.com', 'password_hash', 'Demo User 1', CURRENT_DATE),
-- (2, 'demo2@example.com', 'password_hash', 'Demo User 2', CURRENT_DATE),
-- (3, 'demo3@example.com', 'password_hash', 'Demo User 3', CURRENT_DATE);


CREATE TABLE bits (
    userid INTEGER,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    text TEXT,
    url TEXT,
    FOREIGN KEY(userid) REFERENCES users(userid)
);
