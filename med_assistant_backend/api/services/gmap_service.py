import os
import googlemaps
from dotenv import load_dotenv

# Load env variables
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Initialize Google Maps client
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

def find_nearby_doctors(user_location, doctor_specialty):
    """
    Finds nearby doctors using Google Maps API.
    
    :param user_location: String (address or city)
    :param doctor_specialty: String (e.g., 'Cardiologist', 'General Physician')
    :return: List of nearby doctors with name, address, and rating
    """
    try:
        # 1️⃣ Geocode the user location to get coordinates
        geocode_result = gmaps.geocode(user_location)
        if not geocode_result:
            return []

        lat = geocode_result[0]["geometry"]["location"]["lat"]
        lng = geocode_result[0]["geometry"]["location"]["lng"]

        # 2️⃣ Search for nearby doctors
        search_query = f"{doctor_specialty} near me"
        places_result = gmaps.places_nearby(
            location=(lat, lng),
            radius=5000,  # in meters (5km)
            keyword=doctor_specialty
        )

        # 3️⃣ Extract useful info
        doctors_list = []
        for place in places_result.get("results", []):
            doctors_list.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("user_ratings_total"),
                "location": place.get("geometry", {}).get("location", {})
            })

        return doctors_list

    except Exception as e:
        print(f"Error in find_nearby_doctors: {e}")
        return []
