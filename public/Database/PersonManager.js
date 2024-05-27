const dbmgr = require("./dbManager")
const db = dbmgr.db

const readAllPerson = () => {
	try {
		const query = `SELECT * FROM person`
		console.log("query... ", db)
		const readQuery = db?.prepare(`SELECT * FROM person`)
		const rowList = readQuery?.all()
		console.log("rowList... ", rowList)
		return rowList
	} catch (err) {
		console.error(err)
		throw err
	}
}

const insertPerson = (name, age) => {
	console.log("name...", name)
	try {
		const insertQuery = db.prepare(
			`INSERT INTO person (name, age) VALUES ('${name}' , ${age})`
		)

		const transaction = db.transaction(() => {
			const info = insertQuery.run()
			console.log("info... ", info)
			console.log(
				`Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into person`
			)
		})
		transaction()
		
	} catch (err) {
		console.error(err)
		throw err
	}
}

module.exports = {
	readAllPerson,
	insertPerson,
}
