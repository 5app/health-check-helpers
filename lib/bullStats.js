
export default async function bullStats(queue) {

	const [completeCount, failedCount, inactiveCount, activeCount, delayedCount] = await Promise.all([
		queue.getCompletedCount(),
		queue.getFailedCount(),
		queue.getWaitingCount(),
		queue.getActiveCount(),
		queue.getDelayedCount()
	]);

	return {completeCount, failedCount, inactiveCount, activeCount, delayedCount};

}
