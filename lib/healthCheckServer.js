const http = require('node:http');

const {
	HEALTHCHECK_PORT = 9999,
} = process.env;

function respond({response, statusCode = 200, data = {}}) {
	response.statusCode = statusCode;
	response.setHeader('Content-Type', 'application/json');
	response.end(JSON.stringify(data));
}

/**
 * A dependency of the service
 * @typedef {object} Dependency
 * @property {string} name - Name of the dependency
 * @property {Function} check - Sync or Async function that will return the status of the dependency. If this check throws an error (or returns a rejected promise) then that will make the health check fail and that error message will be returned in the server response.
 */

/**
 * Check if a service healthy
 * @param {Dependency} dependency - Service dependency details
 * @returns {Promise<object>} Dependency status
 */
async function checkDependency({name, check}) {
	try {
		const details = await Promise.resolve().then(check); // Support both sync and async check functions

		return {
			name,
			ok: true,
			details,
		};
	}
	catch (error) {
		return {
			name,
			ok: false,
			error: {
				message: error.message,
				code: error.code,
			},
		};
	}
}

/**
 * Create a simple health check server
 * @param {object} settings - port and checks to make
 * @param {number} settings.port - port to be used by the server, it defaults to the `HEALTHCHECK_PORT` environment variable if it is specified, otherwise to 9999
 * @param {Array<Dependency>} settings.dependencies - List of dependencies that will be checked every time we received a health check request.
 */
function healthCheckServer({port = HEALTHCHECK_PORT, dependencies = []}) {
	const server = http.createServer(async (_, response) => {
		const checks = await Promise.all(dependencies.map(checkDependency));
		const healthy = checks.every(check => check.ok);

		if (healthy) {
			respond({response, data: {
				ok: true,
				checks,
			}});

			return;
		}

		respond({response, statusCode: 500, data: {
			ok: false,
			checks,
		}});
	});

	server.listen(port);
}

module.exports = healthCheckServer;
