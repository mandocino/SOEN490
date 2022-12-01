import '@testing-library/jest-dom';
import axios from 'axios';
import {generateNewScores} from '../backend/utils/scoring.js';

import * as moduleApi from '../backend/utils/scoring.js';

// Somewhere in your test case or test suite
const mockSaveScores = jest.spyOn(moduleApi, 'saveScores').mockImplementation(jest.fn());


describe("Score generation", () => {
    test("generateNewScores", () => {
        
        // Act
        generateNewScores(null, null, null);

        // Assert
        expect(mockSaveScores).toBeCalled();
    });
});