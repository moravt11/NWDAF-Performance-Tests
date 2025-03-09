import { generateScenarios } from '../helpers/scenarioHelper.js';

// Spike Test Configuration - Sudden large spikes in load
const baseConfig = {
    // Test type identifier
    TEST_TYPE: 'SPIKE',
    
    // Scenario execution rates - high rates for spike periods
    SCENARIO_RATES: {
        PDU_SESSION_RELEASE: 25,
        PLMN_CHANGE: 25,
        ACCESS_TYPE_CHANGE: 80,
        UP_STATUS_INFO: 80,
        PDU_SESSION_EST: 80,
        COMM_FAIL: 80,
        PCF_DUMMY_TRIGGER_QOS: 25,
        PCF_DUMMY_TRIGGER_UE: 10
    },
    
    // Maximum VUs per scenario - high to accommodate spikes
    MAX_SCENARIO_VUS: 300,
    
    // Executor type for spike tests
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
    
    
    // Common VU stages - creating distinct spikes
    COMMON_STAGES: [
        { target: 50, duration: '1m' },      // Low baseline
        { target: 200, duration: '30s' },    // First spike
        { target: 100, duration: '1m' },     // Recovery
        { target: 300, duration: '30s' },    // Second larger spike
        { target: 150, duration: '1m' },     // Recovery
        { target: 250, duration: '30s' },    // Third spike
        { target: 50, duration: '2m' },      // Cool down to baseline
        { target: 0, duration: '1m' }        // End with gradual reduction
    ],
};

// Generate scenarios based on this configuration
const scenarios = generateScenarios(baseConfig);

// Export the complete test configuration
export const testConfig = {
    ...baseConfig,
    scenarios: scenarios
};
