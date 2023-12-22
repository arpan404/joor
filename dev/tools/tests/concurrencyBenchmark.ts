import fetch from 'node-fetch';

const url = 'http://localhost:8003'; // Replace with the actual URL of the server endpoint
const numRequests = 1000; // Total number of requests to send
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
      printBenchmarkResults();
    }
  }
};

const printBenchmarkResults = () => {
  const averageResponseTime = totalTime / numRequests;
  const averageRequestsPerSecond = numRequests / (totalTime / 1000);
  console.log('Benchmark results:');
  console.log('Total requests:', numRequests);
  console.log('Concurrent requests:', concurrency);
  console.log('Average response time (ms):', averageResponseTime);
  console.log('Average requests per second:', averageRequestsPerSecond);
};

const startBenchmark = async () => {
  // Create an array of promises for all requests
  const requests = Array.from({ length: numRequests }, () => sendRequest());

  // Execute requests concurrently
  await Promise.all(requests);
};

// Start benchmarking
startBenchmark()
  .then(() => {
    console.log('Benchmark completed.');
  })
  .catch((err) => {
    console.error('Error during benchmark:', err);
  });
