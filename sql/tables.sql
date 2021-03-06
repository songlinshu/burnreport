CREATE TABLE "Food" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT NOT NULL,
	"manufacturer"	TEXT,
	"kcal"	REAL NOT NULL DEFAULT 0,
	"kj"	REAL NOT NULL DEFAULT 0,
	"carbohydrates"	REAL NOT NULL DEFAULT 0,
	"fiber"	REAL DEFAULT 0,
	"sugar"	REAL DEFAULT 0,
	"added_sugar"	REAL DEFAULT 0,
	"starch"	REAL DEFAULT 0,
	"fat"	REAL NOT NULL DEFAULT 0,
	"saturated"	REAL DEFAULT 0,
	"monounsaturated"	REAL DEFAULT 0,
	"trans"	REAL DEFAULT 0,
	"protein"	REAL NOT NULL DEFAULT 0,
	"salt"	REAL NOT NULL DEFAULT 0
)