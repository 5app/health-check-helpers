const systemQueues = [
	'completeCount',
	'failedCount',
	'inactiveCount',
	'activeCount',
	'delayedCount'
];

function getQueueValue({queue, kueInstance}) {

	return new Promise((resolve, reject) => {

		kueInstance[queue]((error, data) => {

			if (error) {

				reject(error);

			}
			else {

				resolve(data);

			}

		});

	});

}

export default async function kueStats(kueInstance) {

	const systemQueueStats = systemQueues.map(queue => getQueueValue({queue, kueInstance}));
	const values = await Promise.all(systemQueueStats);
	const stats = systemQueues.reduce((map, stat, index) => {

		map[stat] = values[index];

		return map;

	}, {});

	return stats;

}
