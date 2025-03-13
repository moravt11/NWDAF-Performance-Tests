import { generateScenarios } from '../helpers/scenarioHelper.js';

// Spike Test Configuration - Sudden large spikes in load
const baseConfig = {
    // Test type identifier
    TEST_TYPE: 'SPIKE',
    
    // Scenario execution rates - high rates for spike periods
    SCENARIO_RATES: {
        PDU_SESSION_RELEASE: 0,
        PLMN_CHANGE: 0,
        ACCESS_TYPE_CHANGE: 0,
        UP_STATUS_INFO: 0,
        PDU_SESSION_EST: 0,
        COMM_FAIL: 0,
        PCF_DUMMY_TRIGGER_QOS: 0,
        PCF_DUMMY_TRIGGER_UE: 0
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
    
    // Common VU stages 
    // COMMON_STAGES: [
    //     { target: 0, duration: '100s' }, 
    // ],
    
    // Scenario-specific stages
    SCENARIO_STAGES: {
        // pcfDummyUeMobility: [
        //     { target: 100, duration: '30s' },
        //     { target: 50, duration: '30s' },
        //     { target: 0, duration: '1s' },
        // ],
        // pcfDummyTriggerQos: [
        //     { target: 0, duration: '30s' },
        //     { target: 100, duration: '30s' },
        //     { target: 0, duration: '1s' },
        // ],
        acTyChange: [
            { target: 150, duration: '60s' },
            { target: 50, duration: '60s' },
        ],
        // plmnChange: [
        //     { target: 25, duration: '30s' },
        //     { target: 50, duration: '30s' },
        //     { target: 100, duration: '60s' },
        // ],
        upStatusInfo: [
            { target: 0, duration: '50s' },
            { target: 50, duration: '20s' },
            { target: 25, duration: '50s' },
            { target: 10, duration: '9s' },
            { target: 0, duration: '1s' },
        ],
    //     pduSessionEst: [
    //         { target: 0, duration: '2m' },
    //         { target: 200, duration: '20s' },
    //         { target: 50, duration: '10s' },
    //     ],
     },
};

// Generate scenarios based on this configuration
const scenarios = generateScenarios(baseConfig);

// Export the complete test configuration
export const testConfig = {
    ...baseConfig,
    scenarios: scenarios
};
