// Inspired by https://blog.sixeyed.com/docker-healthchecks-why-not-to-use-curl-or-iwr/

const http = require('http');

const {
	HEALTHCHECK_PORT = 9999,
	HEALTHCHECK_HOST = 'localhost',
	HEALTHCHECK_TIMEOUT = 5000, // In milliseconds
} = process.env;

const options = {
	host: HEALTHCHECK_HOST,
	port: HEALTHCHECK_PORT,
	timeout: HEALTHCHECK_TIMEOUT,
};

const request = http.request(options, res => {
	if (res.statusCode === 200) {
		let body = '';

		res.setEncoding('utf8');
		res.on('data', chunk => {
			body += chunk;
		});

		res.on('end', () => {
			console.log(body); // eslint-disable-line no-console
			process.exit(0);
		});
	}
	else {
		process.exit(1);
	}
});

request.on('error', error => {
	console.log(error.message); // eslint-disable-line no-console
	process.exit(1);
});

request.end();
