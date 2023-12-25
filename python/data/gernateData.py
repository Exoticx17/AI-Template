import csv
import random

def generate_data(num_examples):
    data = []
    for _ in range(num_examples):
        # Generate random ratings
        ratings = [random.randint(1, 20) for _ in range(6)]
        
        # Calculate corresponding percentages and round to 2 decimal places
        total_votes = sum(ratings)
        output = [round(vote / total_votes, 2) for vote in ratings]
        
        data.append((ratings, output))
    return data

def write_to_csv(filepath, data):
    with open(filepath, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Ratings', 'Output'])
        for row in data:
            # Write data in list format directly without string representations
            writer.writerow([row[0], row[1]])

# Generating and writing data to a CSV file at the specified path
data_to_write = generate_data(1000)  # Change the number to generate more examples
destination_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/votingTrain.csv"
write_to_csv(destination_path, data_to_write)
