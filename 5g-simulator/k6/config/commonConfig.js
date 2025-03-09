import { Counter, Trend, Rate } from 'k6/metrics';
export const TEST_START_TIME = new Date();

// Custom metrics
export const notificationLatency = new Trend('notification_latency');
export const scenarioRate = new Rate('scenario_success');
export const scenarioLatency = new Trend('scenario_latency');
export const scenarioErrors = new Rate('scenario_errors');
export const eventTypeCounter = new Counter('event_type_count');
export const scenarioCounter = new Counter('scenario_executions');
export const inputThroughputBytes = new Counter('inputThroughput_bytes');
export const inputThroughputRate = new Trend('inputThroughput_rate');
export const outputThroughputBytes = new Counter('outputThroughput_bytes');
export const outputThroughputRate = new Trend('outputThroughput_rate');

// Load all sample data files
export function loadJsonFile(path) {
    try {
        const data = open(path);
        return JSON.stringify(JSON.parse(data));  // store fresh copy
    } catch (error) {
        console.error(`Failed to load ${path}: ${error.message}`);
        throw error;
    }
}



// Endpoints
export const ENDPOINTS = {
    NOTIFICATION: 'http://nwdaf:8080/nnwdaf-analyticsinfo/v1/notify',
    PCF_DUMMY_QOS: 'http://nwdaf:8080/npcf-dummy-trigger-qos',
    PCF_DUMMY_UE: 'http://nwdaf:8080/npcf-dummy-trigger-ue',
};

// Load data files
export const PDU_SES_REL = loadJsonFile('../data/PDU_SES_REL.json');
export const PLMN_CH = loadJsonFile('../data/PLMN_CH.json');
export const AC_TY_CH = loadJsonFile('../data/AC_TY_CH.json');
export const UP_STATUS_INFO = loadJsonFile('../data/UP_STATUS_INFO,.json');
export const PDU_SES_EST = loadJsonFile('../data/PDU_SES_EST.json');
export const COMM_FAIL = loadJsonFile('../data/COMM_FAIL.json');