const url = 'http://localhost:8000'; // Replace with the actual URL of your backend
const numRequests = 10000; // Total number of requests to send
const concurrency = 100; // Number of parallel requests

let completedRequests = 0;
let totalTime = 0;

const sendRequest = async () => {
  const startTime = Date.now();
  try {
    await fetch(url);
    const endTime = Date.now();
    const requestTime = endTime - startTime;
    totalTime += requestTime;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    completedRequests++;
    if (completedRequests === numRequests) {
      const averageResponseTime = totalTime / numRequests;
      const averageRequestsPerSecond = numRequests / (totalTime / 1000);
      console.log('Benchmark results:');
      console.log('Total requests:', numRequests);
      console.log('Concurrent requests:', concurrency);
      console.log('Average response time (ms):', averageResponseTime);
      console.log('Average requests per second:', averageRequestsPerSecond);
      console.log('... add more metrics as needed');
    }
  }
};

for (let i = 0; i < concurrency; i++) {
  sendRequest();
}
export {};