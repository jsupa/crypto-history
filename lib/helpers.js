const helpers = {};

helpers.parseJsonToObject = function (string) {
	try {
		const obj = JSON.parse(string);
		return obj;
	} catch (e) {
		return {};
	}
};

helpers.GetTime = function () {
    const result = Date.now();
    return result / 1000;
};

module.exports = helpers;
