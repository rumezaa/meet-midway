import requests
import time
from concurrent.futures import ThreadPoolExecutor

class Places:
    def __init__(self, api_key, prefs):
        self.api_key = api_key
        self.base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        self.keywords = prefs

    def get_all_places_nearby(self, location, radius=3000):
        all_places = []
        seen_place_ids = set()
        threads = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            for keyword in self.keywords:
                print(f"Fetching places with keyword: {keyword}")
                threads.append(executor.submit(self._fetch_places, location, radius, keyword, all_places, seen_place_ids))

            for task in threads:
                try:
                    task.result()  # Ensure all threads complete
                except Exception as e:
                    print(f"Error occurred in thread: {e}")

        return all_places

    def _fetch_places(self, location, radius, keyword, all_places, seen_place_ids):
        params = {
            "location": f"{location[0]},{location[1]}",
            "radius": radius,
            "keyword": keyword,
            "key": self.api_key
        }

        while len(all_places) < 30:  # Continue until we have at least 1000 places
            response = self._make_request(self.base_url, params)
            if not response:
                break
            data = response.json()

            if data["status"] == "OK":
                for place in data["results"]:
                    if place["place_id"] not in seen_place_ids:
                        place_details = self.get_place_details(place["place_id"])
                        place["rating"] = place_details.get("rating")
                        place["user_ratings_total"] = place_details.get("user_ratings_total")
                        # Add latitude and longitude to the place object
                        place["lat"] = place["geometry"]["location"]["lat"]
                        place["lng"] = place["geometry"]["location"]["lng"]
                        place["img"] = place_details.get("photo_url")  # Add photo URL
                        all_places.append(place)
                        seen_place_ids.add(place["place_id"])

                        # Stop if we have reached 1000 places
                        if len(all_places) >= 30:
                            break

                # Break out of the loop if we have enough places
                if len(all_places) >= 30:
                    break

                # If there's a next page, continue fetching more results
                if "next_page_token" in data:
                    params["pagetoken"] = data["next_page_token"]
                    time.sleep(2)  # Short delay to process the next page token
                else:
                    break  # No more pages to fetch, exit the loop
            else:
                print(f"Error fetching places with keyword {keyword}: {data['status']}")
                break

    def get_place_details(self, place_id):
        details_url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "place_id": place_id,
            "key": self.api_key
        }

        response = self._make_request(details_url, params)
        if not response:
            return {}

        result = response.json().get("result", {})

        # Extract photo references and construct photo URLs
        if "photos" in result and len(result["photos"]) > 0:
            photo_reference = result["photos"][0]["photo_reference"]
            photo_url = self._construct_photo_url(photo_reference)
            result["photo_url"] = photo_url

        return result

    def _construct_photo_url(self, photo_reference, max_width=400):
        base_url = "https://maps.googleapis.com/maps/api/place/photo"
        params = {
            "photoreference": photo_reference,
            "key": self.api_key,
            "maxwidth": max_width
        }
        response = requests.get(base_url, params=params)
        return response.url

    def _make_request(self, url, params, retries=3):
        for attempt in range(retries):
            try:
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    return response
            except requests.RequestException as e:
                print(f"Request error: {e}")
            time.sleep(2)
        return None
