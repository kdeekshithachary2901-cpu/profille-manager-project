/*! For license information please see supabase.js.LICENSE.txt */
// Robust Local Mock Supabase Client to ensure compatibility with all button actions
window.supabase = {
    createClient: function(url, key) {
        console.log("Supabase initialized locally with Project URL:", url);
        
        if (!window.localStorage.getItem('mock_db')) {
            window.localStorage.setItem('mock_db', JSON.stringify({}));
        }

        return {
            from: function(tableName) {
                return {
                    upsert: function(payload) {
                        const db = JSON.parse(window.localStorage.getItem('mock_db'));
                        db[payload.id] = payload;
                        window.localStorage.setItem('mock_db', JSON.stringify(db));
                        
                        return {
                            select: function() {
                                return Promise.resolve({ data: [payload], error: null });
                            }
                        };
                    },
                    select: function(columns) {
                        return {
                            eq: function(columnName, value) {
                                const db = JSON.parse(window.localStorage.getItem('mock_db'));
                                const record = db[value];
                                if (record) {
                                    return Promise.resolve({ data: [record], error: null });
                                }
                                return Promise.resolve({ data: [], error: null });
                            }
                        };
                    },
                    delete: function() {
                        return {
                            eq: function(columnName, value) {
                                const db = JSON.parse(window.localStorage.getItem('mock_db'));
                                if (db[value]) {
                                    delete db[value];
                                    window.localStorage.setItem('mock_db', JSON.stringify(db));
                                }
                                return Promise.resolve({ error: null });
                            }
                        };
                    }
                };
            }
        };
    }
};