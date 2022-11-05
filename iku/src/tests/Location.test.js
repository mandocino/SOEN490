import '@testing-library/jest-dom';
import axios from 'axios';

jest.setTimeout(10000);

describe("Google Geocoding API tests", () => {
    // // Test geocoding with valid coordinates
    test("Get address from coordinates", async() => {

        const concordiaLatitude = 45.497109;
        const concordiaLongitude = -73.578734;
        const geocodedAddress = await axios.get('http://localhost:5000/address', {
            params:{
              lat: concordiaLatitude,
              lng: concordiaLongitude
            }
        });
        const address = geocodedAddress.data.address;
        expect(address).toContain("1455");
        expect(address).toContain("Maisonneuve");
    });

});