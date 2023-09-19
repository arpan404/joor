import sys
import matplotlib.pyplot as plt

def plot_stats(entity_names, avg_times, max_times, min_times):
    x = range(len(entity_names))

    plt.figure(figsize=(10, 6))

    # Plot average times
    plt.bar(x, avg_times, width=0.2, align='center', label='Average Time', color='blue')

    # Plot maximum times
    plt.bar(x, max_times, width=0.2, align='edge', label='Maximum Time', color='green')

    # Plot minimum times
    plt.bar(x, min_times, width=0.2, align='edge', label='Minimum Time', color='red', alpha=0.5)

    plt.xlabel('Entities')
    plt.ylabel('Time (ms)')
    plt.title('Time Statistics for Different Entities')
    plt.xticks(x, entity_names)
    plt.legend()
    plt.show()

if __name__ == '__main__':
    # Check if at least 15 arguments (5 entities with avg, max, min times each) were provided
    if len(sys.argv) != 16:
        print("Usage: python script.py entity1_avg entity1_max entity1_min entity2_avg entity2_max entity2_min ...")
        sys.exit(1)

    entity_names = ['Entity 1', 'Entity 2', 'Entity 3', 'Entity 4', 'Entity 5']

    avg_times = [float(sys.argv[i]) for i in range(1, 16, 3)]
    max_times = [float(sys.argv[i]) for i in range(2, 16, 3)]
    min_times = [float(sys.argv[i]) for i in range(3, 16, 3)]

    # Plot the statistics
    plot_stats(entity_names, avg_times, max_times, min_times)
