# health-check-helpers

> A set of functions to help determine if a service is healthy or not

## Usage
```sh
npm install --save @5app/health-check-helpers
```

Then, in your application, you can import and use any number of helpers:
```javascript
const {kueStats} = require('@5app/health-check-helpers');
const queueInstance = require('./queueInstance'); // your Kue instance

async function serviceHealth() {
  try {
    const {completeCount, failedCount} = await kueStats(queueInstance);

    return {
      healthy: true,
      kue: {
        completeCount,
        failedCount,
      },
    };
  }
  catch (error) {
    return {
      healthy: false,
      kue: {
        error: error.message,
      },
    };
  }
}
```

## Motivation

We ended up duplicating the same code multiple times between microservices, so we thought why not extracting it into modules and reuse it across multiple projects.

## Helpers

This package includes helpers to fetch some system basic stats (CPU, memory, pid), stats about [Kue](https://www.npmjs.com/package/kue), and [MySQL](https://www.npmjs.com/package/mysql2) (work in progress).

### kueStats

Provide basic stats about Kue.
This is the equivalent of the `/stats` endpoint of Kue REST API.

Example:

```javascript
{
	completeCount: 42,
	failedCount: 1,
	inactiveCount: 0,
	activeCount: 0,
	delayedCount: 0
}
```

### processMetadata

Information about the current process and platform:

Example:

```javascript
{
  platform:{
      type: 'linux',
      freeMemory: '324.320 MB',
      totalMemory: '5957.363 MB',
      startedOn: new Date('2019-04-03T18:13:37.794Z')
   },
   process:{
      pid: 16,
      cpuUsage:{
         user: 1370000,
         system: 780000
      },
      startedOn: new Date('2019-04-09T14:13:53.726Z')
   }
}
```

### healthCheckServer

Creates a basic http server to handle application health checking requirements.
This server needs to be started in the main thread of your application (e.g. your server) and by default it will allow checking if the process is responsive or not.
You can add the list of your app dependencies to this server to allow checking if these dependencies are healthy or not.

Example:

```javascript
const {healthCheckServer, bullStats} = require('@5app/health-check-helpers');

healthCheckServer({
  port: 8888, // this is optional and it will default to the value of the environement variable `HEALTHCHECK_PORT` if specified, otherwise it falls back to the port `9999` 
  dependencies: [
    {
      name: 'bull', // dependency name
      check: () => bullStats(myQueueObject),
    },
  ],
});
```

The check functions can be sync or async. They will be called by the server without parameters every time the server gets a request.

Note: currently the server provides 1 endpoint (`/`) for general health status and doesn't provide special `readiness`, `liveness`, and debug endpoints.

## Other tools

### bin/check.js

A simple script for making health check queries is available in the root of the repository.
You can use it from your Dockerfile to ping the instance of `healthCheckServer` using the following command:

```
HEALTHCHECK --retries=2 --interval=10s --timeout=5s --start-period=5s CMD node node_modules/@5app/health-check-helpers/bin/check.js
```

This can replace checks that you would traditionally make with `curl`.

You can configure the script using the following environment variables:

| Setting         | Environement variable | Default value                                           |
|-----------------|-----------------------|---------------------------------------------------------|
| server port     | HEALTHCHECK_PORT      | 9999, the same as the default port of healthCheckServer |
| server host     | HEALTHCHECK_HOST      | localhost                                               |
| request timeout | HEALTHCHECK_TIMEOUT   | 50000 milliseconds                                      |
| request path    | HEALTHCHECK_PATH      | /                                                       |

