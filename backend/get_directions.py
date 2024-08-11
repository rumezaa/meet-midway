import requests
from html import unescape
from bs4 import BeautifulSoup
from geopy.distance import geodesic

def get_coordinates(api_key, address):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    response = requests.get(base_url, params={"address": address, "key": api_key})
    data = response.json()

    if 'results' in data and len(data['results']) > 0:
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    else:
        raise ValueError(f"Geocoding API error: No results found for address '{address}'")

def get_distance(coord1, coord2):
    return geodesic(coord1, coord2).miles

def fetch_directions(api_key, origin, destination):
    base_url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{origin[0]},{origin[1]}",
        "destination": f"{destination[0]},{destination[1]}",
        "key": api_key
    }
    response = requests.get(base_url, params=params)
    return response.json()['routes'][0]['legs'][0]['steps']

def clean_html(html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    return unescape(soup.get_text())

def get_directions(api_key, midpoint_coord, coordinates):
    # Calculate distances from midpoint to each address and keep track of their original index
    distances = {
        index: {
            "coord": tuple(coord),
            "distance": get_distance(midpoint_coord, coord)
        }
        for index, coord in enumerate(coordinates)
    }

    # Sort by distance
    sorted_distances = sorted(distances.items(), key=lambda x: x[1]["distance"])

    # Generate directions from midpoint to each address
    directions = []
    current_origin = midpoint_coord
    for index, data in sorted_distances:
        coord = data["coord"]
        steps = fetch_directions(api_key, current_origin, coord)
        cleaned_steps = [clean_html(step['html_instructions']) for step in steps]
        directions.append({
            "original_index": index,  # Position in the original coordinates array
            "origin": current_origin,  # The origin for this segment
            "destination": coord,      # The destination for this segment
            "steps": cleaned_steps
        })
        # Update the current origin to the current destination for the next segment
        current_origin = coord

    return directions


# Example usage
# midpoint_coord = (37.33182, -122.03118)  # Example coordinates for "1 Infinite Loop, Cupertino, CA"
# coordinates = [
#     (37.422, -122.084),  # Example coordinates for "1600 Amphitheatre Parkway, Mountain View, CA"
#     (37.776, -122.394),  # Example coordinates for "500 Terry Francois Blvd, San Francisco, CA"
#     (37.779, -122.389)   # Example coordinates for "1355 Market St, San Francisco, CA"
# ]

# api_key = "AIzaSyBdKyA2xeRRyMIb-Aj7WkY7VH7RlsVt6to"
# directions = get_directions(api_key, midpoint_coord, coordinates)

# # Print directions
# for direction in directions:
#     print(f"Directions to {direction['destination']}:")
#     for step in direction['steps']:
#         print(step)
#     print(f"Welcome to {direction['destination']}! Enjoy your time.\n")
