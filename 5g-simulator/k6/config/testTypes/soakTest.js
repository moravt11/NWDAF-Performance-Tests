import { generateScenarios } from '../helpers/scenarioHelper.js';

// Soak Test Configuration - Sustained moderate load over a long period
const baseConfig = {
    // Test type identifier
    TEST_TYPE: 'SOAK',
    
    // Scenario execution rates - moderate but sustained
    SCENARIO_RATES: {
        PDU_SESSION_RELEASE: 15,
        PLMN_CHANGE: 15,
        ACCESS_TYPE_CHANGE: 40,
        UP_STATUS_INFO: 40,
        PDU_SESSION_EST: 40,
        COMM_FAIL: 40,
        PCF_DUMMY_TRIGGER: 15
    },
    
    // Maximum VUs per scenario - moderate but sustained
    MAX_SCENARIO_VUS: 300,
    
    // Updated executor type for steady load
    COMMON_EXECUTOR: 'constant-vus',
    
    // Scenario start times (in seconds) - stagger slightly to avoid initial spike
    SCENARIO_START_TIMES: {
        PDU_SESSION_RELEASE: 0,
        UP_STATUS_INFO: 30,
        PLMN_CHANGE: 60,
        ACCESS_TYPE_CHANGE: 90,
        PDU_SESSION_EST: 120,
        COMM_FAIL: 150,
        PCF_DUMMY_TRIGGER: 180
    },
    
    // Time configuration - very long duration for soak testing
    TIME_CONFIG: {
        TIME_UNIT: '1s',
        DURATION: '60m' // 1 hour soak test
    },
    
    // Common VU stages - quick ramp-up, then sustained load for a long time
    COMMON_STAGES: [
        { target: 200, duration: '2m' },
        { target: 300, duration: '53m' },
        { target: 0, duration: '5m' }     // Gradual ramp-down
    ],
    
    // InfluxDB settings - optimized for long-running test
    INFLUXDB_CONFIG: {
        flushPeriod: '20s',
        bufferSize: 8000,
        concurrentWrites: 5
    }
};

// Generate scenarios based on this configuration
const scenarios = generateScenarios(baseConfig);

// Export the complete test configuration
export const testConfig = {
    ...baseConfig,
    scenarios: scenarios
};
