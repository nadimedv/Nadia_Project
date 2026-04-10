CREATE TABLE IF NOT EXISTS Users (
                                     id INTEGER PRIMARY KEY,
                                     name TEXT NOT NULL,
                                     email TEXT NOT NULL UNIQUE
);