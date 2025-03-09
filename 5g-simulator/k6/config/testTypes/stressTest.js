import { generateScenarios } from '../helpers/scenarioHelper.js';

// Stress Test Configuration - Gradually increasing load to find breaking points
const baseConfig = {
    // Test type identifier
    TEST_TYPE: 'STRESS',
    
    // Scenario execution rates - higher than load test
    SCENARIO_RATES: {
        PDU_SESSION_RELEASE: 20,
        PLMN_CHANGE: 20,
        ACCESS_TYPE_CHANGE: 60,
        UP_STATUS_INFO: 60,
        PDU_SESSION_EST: 60,
        COMM_FAIL: 60,
        PCF_DUMMY_TRIGGER_QOS: 20,
        PCF_DUMMY_TRIGGER_UE: 10
    },
    
    // Maximum VUs per scenario - higher value to stress the system
    MAX_SCENARIO_VUS: 500,
    
    // Updated executor type for increasing load
    COMMON_EXECUTOR: 'ramping-vus',
    
    // Scenario start times (in seconds)
    SCENARIO_START_TIMES: {
        PDU_SESSION_RELEASE: 0,
        UP_STATUS_INFO: 0,
        PLMN_CHANGE: 0,
        ACCESS_TYPE_CHANGE: 0,
        PDU_SESSION_EST: 0,
        COMM_FAIL: 0,
        PCF_DUMMY_TRIGGER_QOS: 0,
        PCF_DUMMY_TRIGGER_UE: 0
    },
        
    // Common VU stages - continually increasing load
    COMMON_STAGES: [
        { target: 50, duration: '1m' },      // Warm-up
        { target: 150, duration: '2m' },     // Moderate load
        { target: 300, duration: '2m' },     // Heavy load
        { target: 450, duration: '2m' },     // Very heavy load
        { target: 500, duration: '2m' },     // Near maximum load
        { target: 0, duration: '1m' }        // Cool down
    ],
    
};

// Generate scenarios based on this configuration
const scenarios = generateScenarios(baseConfig);

// Export the complete test configuration
export const testConfig = {
    ...baseConfig,
    scenarios: scenarios
};
