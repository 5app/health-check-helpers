const os = require('node:os');

function toMegabytes(bytes) {

	const megabytes = Number(bytes / (1024 * 1024)).toFixed(3);

	return `${megabytes} MB`;

}

function uptimeAsDate(seconds) {

	return new Date(Date.now() - seconds * 1000);

}

function processMetadata() {

	return {
		platform: {
			type: os.platform(),
			freeMemory: toMegabytes(os.freemem()),
			totalMemory: toMegabytes(os.totalmem()),
			startedOn: uptimeAsDate(os.uptime())
		},
		process: {
			pid: process.pid,
			cpuUsage: process.cpuUsage(), // Values in microseconds
			startedOn: uptimeAsDate(process.uptime())
		}
	};

}

module.exports = processMetadata;
