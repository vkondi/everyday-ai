import requests
from config import logger

class IpLocationService:
    def __init__(self):
        logger.info("IP Location Service initialized")
        pass
        

    def get_location(self, ip_address: str, request_id: str) -> str:
        
        """
        Get location information based on IP address.
        If not IP address, then use India as default.
        """
        
        if not ip_address:
            logger.warning(f"[{request_id}][get_location] >> No IP address provided, defaulting to India")
            return "India"
        
        try:
            url = f"https://http://ip-api.com/json/{ip_address}"
            response = requests.get(url, timeout=5)
            response.raise_for_status()  # Raise an error for bad responses
            data = response.json()
            
            return data.get('country', 'India')
        except Exception as e:
            logger.error(f"[{request_id}][get_location] >> Error fetching location for IP {ip_address}: {e}")
            return "India"
        