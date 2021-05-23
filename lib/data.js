const fs = require('fs')
const path = require('path')
const helpers = require('./helpers.js')

const lib = {}

lib.baseDir = path.join(__dirname, './../data/')

lib.create = function (dir, file, data, callback) {
	fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data)
			fs.writeFile(fileDescriptor, stringData, err => {
				if (!err) {
					fs.close(fileDescriptor, err => {
						if (!err) {
							callback(false)
						} else {
							callback('Error closing new file')
						}
					})
				} else {
					callback('Error writing to new file')
				}
			})
		} else {
			callback('Could not create new file, it may already exist')
		}
	})
}

lib.read = function (dir, file, callback) {
	fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err, data) => {
		if (!err && data) {
			const parseData = helpers.parseJsonToObject(data)
			callback(false, parseData)
		} else {
			callback(err, data)
		}
	})
}

lib.update = function (dir, file, data, callback) {
	fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data)
			fs.ftruncate(fileDescriptor, err => {
				if (!err) {
					fs.writeFile(fileDescriptor, stringData, err => {
						if (!err) {
							fs.close(fileDescriptor, err => {
								if (!err) {
									callback(false)
								} else {
									callback('Error closing existing file')
								}
							})
						} else {
							callback('Error writing to existing file')
						}
					})
				} else {
					callback('Error truncating file')
				}
			})
		} else {
			callback('Could not open the file for updating, it may not exist yet')
		}
	})
}

lib.delete = function (dir, file, callback) {
	fs.unlink(`${lib.baseDir + dir}/${file}.json`, err => {
		if (!err) {
			callback(false)
		} else {
			callback('Error deleting file')
		}
	})
}

lib.exist = function (dir, file, callback) {
	if (fs.existsSync(`${lib.baseDir + dir}/${file}.json`)) {
		callback(false)
	} else {
		callback('File not exist yet')
	}
}

module.exports = lib