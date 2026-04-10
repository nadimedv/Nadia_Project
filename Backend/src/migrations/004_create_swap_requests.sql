CREATE TABLE IF NOT EXISTS SwapRequests (
                                            id INTEGER PRIMARY KEY,
                                            shiftId INTEGER NOT NULL,
                                            requestedBy TEXT NOT NULL,
                                            targetUser TEXT NOT NULL,
                                            status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    FOREIGN KEY (shiftId) REFERENCES Shifts(id) ON DELETE CASCADE
    );