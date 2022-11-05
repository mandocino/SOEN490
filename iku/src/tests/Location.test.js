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

    // Test geocoding with valid address
    test("Get coordinates from a valid address", async() => {
        const address = 'Concordia University, Boulevard de Maisonneuve Ouest';
        const geocodedCoordinates = await axios.get('http://localhost:5000/coordinates', {
            params: {
                address: address
            }
        });
        const coordinates = geocodedCoordinates.data.coordinates;
        expect(coordinates.lat).toBe(45.4948363);
        expect(coordinates.lng).toBe(-73.5779128);
    })

});


describe("Google Places Autocomplete API test", () => {

    // Test to check that an Non empty array is returned
    test("Get suggestions for a given input", async () => {
        const input = 'montreal';
        const suggestionsResponse = await axios.get('http://localhost:5000/suggestions', {
            params: {
                input: input
            }
        });
        const suggestions = suggestionsResponse.data.predictions;
        expect(suggestionsResponse.status).toBe(200); // 200 --> successful request
        expect(suggestions[0]).toBe("Montreal, QC, Canada");
    })
});