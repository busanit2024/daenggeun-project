import { useState, useEffect } from 'react';
import getCurrentPosition from './getCurrentPosition';

const useGeolocation = (isLoaded) => {
  const [location, setLocation] = useState({ sido: '', sigungu: '', emd: '' });

  useEffect(() => {
    const fetchGeolocation = async () => {
      if (!isLoaded) return;

      try {
        const { latitude, longitude } = await getCurrentPosition();
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              const addressComponents = results[0].address_components;
              const sido = addressComponents.find((component) => component.types.includes('administrative_area_level_1'))?.long_name;
              const sigungu = addressComponents.find((component) => component.types.includes('sublocality_level_1'))?.long_name;
              const emd = addressComponents.find((component) => component.types.includes('sublocality_level_2'))?.long_name;
              setLocation({ sido, sigungu, emd });
            } else {
              console.error('No results found');
            }
          } else {
            console.error(`Geocoder failed due to: ${status}`);
          }
        });
      } catch (error) {
        console.error('Failed to fetch geolocation:', error);
      }
    };

    fetchGeolocation();
  }, [isLoaded]);

  return location;
};

export default useGeolocation;