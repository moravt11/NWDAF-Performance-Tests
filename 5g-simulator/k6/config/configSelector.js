import { testConfig as loadTest } from './testTypes/loadTest.js';
import { testConfig as stressTest } from './testTypes/stressTest.js';
import { testConfig as soakTest } from './testTypes/soakTest.js';
import { testConfig as spikeTest } from './testTypes/spikeTest.js';

// Get the selected test type from environment variables or default to load test
function getSelectedTestConfig() {
    // K6 environment variables can be set using the -e flag in k6 or via Docker environment variables
    const testType = __ENV.TEST_TYPE ; 
    switch(testType.toUpperCase()) {
        case 'STRESS':
            return stressTest;
        case 'SOAK':
            return soakTest;
        case 'SPIKE':
            return spikeTest;
        case 'LOAD':
        default:
            return loadTest;
    }
}

// Export the selected configuration
export const selectedConfig = getSelectedTestConfig();

// Export all the configuration values that test.js needs
export const TEST_TYPE = selectedConfig.TEST_TYPE;
export const MAX_SCENARIO_VUS = selectedConfig.MAX_SCENARIO_VUS;
export const TIME_CONFIG = selectedConfig.TIME_CONFIG;
export const INFLUXDB_CONFIG = selectedConfig.INFLUXDB_CONFIG;
export const SCENARIOS = selectedConfig.scenarios;
