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