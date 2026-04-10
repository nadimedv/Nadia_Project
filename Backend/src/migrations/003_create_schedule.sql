CREATE TABLE IF NOT EXISTS Schedule (
                                        id INTEGER PRIMARY KEY,
                                        date TEXT NOT NULL,
                                        shiftId INTEGER NOT NULL,
                                        note TEXT,
                                        FOREIGN KEY (shiftId) REFERENCES Shifts(id) ON DELETE CASCADE
    );