import '@testing-library/jest-dom';
import axios from "axios";

import * as module from '../backend/utils/scoring.js';


describe("saveScores", () => {
    jest.spyOn(axios, "post");

    it("should post the saved scores", () => {
        // Arrange
        const mockOrigin = {_id: 0};
        const mockDestination = {_id: 1};
        const mockScores = {
            overall: 0,
            rushHour: 1,
            offPeak: 2,
            weekend: 3,
            overnight: 4
        }
        const mockDate = null;

        const expectedURI = 'http://localhost:5000/editSavedScore/0/1';
        const expectedParams = {
            origin: mockOrigin,
            destination: mockDestination,
            generatedTime: mockDate,
            overall: mockScores.overall,
            rushHour: mockScores.rushHour,
            offPeak:mockScores.offPeak,
            weekend:mockScores.weekend,
            overnight:mockScores.overnight
        };

        // Act
        module.saveScores(mockOrigin, mockDestination, mockScores, mockDate);

        // Assert
        expect(axios.post).toBeCalledWith(expectedURI, expectedParams);
    })
})

describe("generateNewScores", () => {
    jest.spyOn(module, "saveScores");
    it("should call saveScores when complete", () => {
        // Arrange
        const mockOrigin = {_id: 0};
        const mockDestination = {_id: 1};

        // Act
        module.generateNewScores(mockOrigin, mockDestination);

        // Assert
        expect(module.saveScores).toBeCalled();
    });
});

describe("getScores", () => {
    const mockOrigin = {_id: 0};
    const mockDestination = {_id: 1};

    it("should make the get call to axios", () => {
        // Arrange
        jest.spyOn(axios, "get");

        const expectedURI = `http://localhost:5000/savedScores/${mockOrigin._id}/${mockDestination._id}`;
        const expectedParams = {
            params:
                {
                    origin: mockOrigin,
                    destination: mockDestination,
                }
        }

        // Act
        module.getScores(mockOrigin, mockDestination);

        // Assert
        expect(axios.get).toHaveBeenCalledWith(expectedURI, expectedParams);
    })

    it("should return the scores", async () => {
        // Arrange
        const mockScores = {
            overall: 0,
            rushHour: 1,
            offPeak: 2,
            weekend: 3,
            overnight: 4
        };
        jest.spyOn(axios, "get").mockResolvedValue({ data: mockScores });

        // Act
        const result = await module.getScores(mockOrigin, mockDestination);

        // Assert
        expect(result).toStrictEqual(mockScores);
    })
})

describe("loadScores", () => {
    const mockOrigin = {_id: 0};
    const mockDestination = {_id: 1};
    const mockUserID = 1;

    beforeEach(() => {
        jest.spyOn(module, "getScores").mockResolvedValue({
            generatedTime: new Date(2021, 1, 1),
            overall: 0,
            rushHour: 1,
            offPeak: 2,
            weekend: 3,
            overnight: 4
        });
        jest.clearAllMocks();
    });


    it("should make the get calls to axios", async () => {
        // Arrange
        const expectedTimeURI = 'http://localhost:5000/global/';
        const expectedUserURI = `http://localhost:5000/userByID/${mockUserID}`;

        const mockAlgoUpdatedTime = {
            data: { lastAlgoUpdateTime: new Date(2020, 1, 1) }
        };

        const mockUserData = {
            data: [
                { lastPrefChangeTime: new Date(2020, 1, 1) },
                null
            ]
        };

        jest.spyOn(axios, "get")
            .mockResolvedValueOnce(mockAlgoUpdatedTime)
            .mockResolvedValueOnce(mockUserData);

        // Act
        await module.loadScores(mockOrigin, mockDestination, mockUserID);

        // Assert
        expect(axios.get).toHaveBeenCalledWith(expectedTimeURI);
        expect(axios.get).toHaveBeenCalledWith(expectedUserURI);
    });

    it("should fetch scores for the origin and destination", async () => {
        // Arrange
        const mockScores = {
            destination: mockDestination,
            overall: 0,
            rushHour: 1,
            offPeak: 2,
            weekend: 3,
            overnight: 4
        };

        const mockAlgoUpdatedTime = {
            data: [
                { lastAlgoUpdateTime: new Date(2020, 1, 1) },
                null
            ]
        };

        const mockUserData = {
            data: [
                { lastPrefChangeTime: new Date(2020, 1, 1) },
                null
            ]
        };

        jest.spyOn(axios, "get")
            .mockResolvedValueOnce(mockAlgoUpdatedTime)
            .mockResolvedValueOnce(mockUserData);

        // Act
        const result = await module.loadScores(mockOrigin, mockDestination, mockUserID);

        // Assert
        expect(module.getScores).toHaveBeenCalledWith(mockOrigin, mockDestination);
        expect(result).toStrictEqual(mockScores);
    });

    it("should regenerate and re-fetch the scores if the user lastPrefChangeTime is newer than the scores", async () => {

        // Arrange
        const mockAlgoUpdatedTime = {
            data: { lastAlgoUpdateTime: new Date(2020, 1, 1) }
        };

        const mockUserData = {
            data: [
                { lastPrefChangeTime: new Date(2022, 1, 1) },
                null
            ]
        };

        jest.spyOn(axios, "get")
            .mockResolvedValueOnce(mockAlgoUpdatedTime)
            .mockResolvedValueOnce(mockUserData);

        jest.spyOn(module, "generateNewScores")
            .mockResolvedValueOnce(null);

        // Act
        const result = await module.loadScores(mockOrigin, mockDestination, mockUserID);

        // Assert
        expect(module.getScores).toHaveBeenCalledTimes(2);
        expect(module.generateNewScores).toHaveBeenCalled();
    });

    it("should regenerate and re-fetch the scores if lastAlgoUpdateTime is newer than the scores", async () => {

        // Arrange
        const mockAlgoUpdatedTime = {
            data: { lastAlgoUpdateTime: new Date(2022, 1, 1) }
        }
        const mockUserData = {
            data: [
                { lastPrefChangeTime: new Date(2020, 1, 1) },
                null
            ]
        }

        jest.spyOn(axios, "get")
            .mockResolvedValueOnce(mockAlgoUpdatedTime)
            .mockResolvedValueOnce(mockUserData);

        jest.spyOn(module, "generateNewScores")
            .mockResolvedValueOnce(null);

        // Act
        const result = await module.loadScores(mockOrigin, mockDestination, mockUserID);

        // Assert
        expect(module.getScores).toHaveBeenCalledTimes(2);
        expect(module.generateNewScores).toHaveBeenCalled();
    });

    it("should not regenerate and re-fetch the scores if they're newer than lastPrefChangeTime and lastAlgoUpdateTime", async () => {

        // Arrange
        const mockAlgoUpdatedTime = {
            data: [
                { lastAlgoUpdateTime: new Date(2020, 1, 1) },
                null
            ]
        }
        const mockUserData = {
            data: [
                { lastPrefChangeTime: new Date(2020, 1, 1) },
                null
            ]
        }

        jest.spyOn(axios, "get")
            .mockResolvedValueOnce(mockAlgoUpdatedTime)
            .mockResolvedValueOnce(mockUserData);

        jest.spyOn(module, "generateNewScores");

        // Act
        const result = await module.loadScores(mockOrigin, mockDestination, mockUserID);

        // Assert
        expect(module.getScores).toHaveBeenCalledTimes(1);
        expect(module.generateNewScores).not.toHaveBeenCalled();
    });
})