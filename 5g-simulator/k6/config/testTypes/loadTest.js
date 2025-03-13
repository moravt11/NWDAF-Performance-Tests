import { generateScenarios } from '../helpers/scenarioHelper.js';

// Load Test Configuration - Simulates expected normal load
const baseConfig = {
    // Test type identifier
    TEST_TYPE: 'LOAD',
    
    // Scenario execution rates
    SCENARIO_RATES: {
        PDU_SESSION_RELEASE: 100,
        PLMN_CHANGE: 100,
        ACCESS_TYPE_CHANGE: 300,
        UP_STATUS_INFO: 300,
        PDU_SESSION_EST: 300,
        COMM_FAIL: 300,
        PCF_DUMMY_TRIGGER_QOS: 200,
        PCF_DUMMY_TRIGGER_UE: 200
    },
    
    MAX_SCENARIO_VUS: 250,
    
    // Executor type for constant load
    COMMON_EXECUTOR: 'constant-vus',
    
    // Scenario start times (in seconds)
    SCENARIO_START_TIMES: {
        PDU_SESSION_RELEASE: 0,
        UP_STATUS_INFO: 0,
        PLMN_CHANGE: 0,
        ACCESS_TYPE_CHANGE: 0,
        PDU_SESSION_EST: 0,
        COMM_FAIL: 0,
        PCF_DUMMY_TRIGGER_QOS: 120,
        PCF_DUMMY_TRIGGER_UE: 60
    },
    
    // Time configuration - moderate duration
    TIME_CONFIG: {
        TIME_UNIT: '1s',
        DURATION: '5m'
    },
};

// Generate scenarios based on this configuration
const scenarios = generateScenarios(baseConfig);

// Export the complete test configuration
export const testConfig = {
    ...baseConfig,
    scenarios: scenarios
};
