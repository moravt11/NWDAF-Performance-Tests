import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate, Gauge } from 'k6/metrics';

const SCENARIO_RATES = {
  PDU_SESSION_RELEASE: 10,
  PLMN_CHANGE: 10,
  ACCESS_TYPE_CHANGE: 30,
  UP_STATUS_INFO: 30,
  PDU_SESSION_EST: 30,
  COMM_FAIL: 30,
  PCF_DUMMY_TRIGGER: 10
};

const MAX_SCENARIO_VUS = 250;

const SCENARIO_START_TIMES = {
  PDU_SESSION_RELEASE: 0,
  UP_STATUS_INFO: 0,
  PLMN_CHANGE: 0,
  ACCESS_TYPE_CHANGE: 0,
  PDU_SESSION_EST: 0,
  COMM_FAIL: 0,
  PCF_DUMMY_TRIGGER: 0
};

const TIME_CONFIG = {
  TIME_UNIT: '1s',
  DURATION: '5m'
};

// Custom metrics
const notificationLatency = new Trend('notification_latency');
const scenarioRate = new Rate('scenario_success');
const scenarioLatency = new Trend('scenario_latency');
const scenarioErrors = new Rate('scenario_errors');
const eventTypeCounter = new Counter('event_type_count');
const scenarioCounter = new Counter('scenario_executions');
const inputThroughputBytes = new Counter('inputThroughput_bytes');
const inputThroughputRate = new Trend('inputThroughput_rate');
const outputThroughputBytes = new Counter('outputThroughput_bytes');
const outputThroughputRate = new Trend('outputThroughput_rate');

// Load all sample data files
function loadJsonFile(path) {
  try {
    const data = open(path);
    return JSON.stringify(JSON.parse(data));  // store fresh copy
  } catch (error) {
    console.error(`Failed to load ${path}: ${error.message}`);
    throw error;
  }
}

const COMMON_STAGES = [
  { duration: '30s', target: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)) },
  { duration: '1m', target: Math.round(MAX_SCENARIO_VUS / 2) },
  { duration: '2m', target: MAX_SCENARIO_VUS }
];

export let options = {
  scenarios: {
    pduSessionRelease: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'pduSessionReleaseScenario',
      startTime: SCENARIO_START_TIMES.PDU_SESSION_RELEASE + 's'     
    },
    plmnChange: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'plmnChangeScenario',
      startTime: SCENARIO_START_TIMES.PLMN_CHANGE + 's'     
    },
    acTyChange: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'acTyChangeScenario',
      startTime: SCENARIO_START_TIMES.ACCESS_TYPE_CHANGE + 's'       
    },
    upStatusInfo: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'upStatusInfoScenario',
      startTime: SCENARIO_START_TIMES.UP_STATUS_INFO + 's'
    },
    pduSessionEst: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'pduSessionEstScenario',
      startTime: SCENARIO_START_TIMES.PDU_SESSION_EST + 's'
    },
    commFail: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'commFailScenario',
      startTime: SCENARIO_START_TIMES.COMM_FAIL + 's'       
    },
    pcfDummyTrigger: {
      executor: 'ramping-vus',
      startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
      stages: COMMON_STAGES,
      exec: 'pcfDummyTriggerScenario',
      startTime: SCENARIO_START_TIMES.PCF_DUMMY_TRIGGER + 's'
    }
  },
  ext: {
    loadimpact: {
      distribution: {
        'local': null
      }
    }
  },
  influxdb: {
    flushPeriod: '10s',      // Increase from default
    bufferSize: 5000,        // Increase buffer size
    concurrentWrites: 10     // Reduce concurrent writes
  }
};

const PDU_SES_REL = loadJsonFile('./data/PDU_SES_REL.json');
const PLMN_CH = loadJsonFile('./data/PLMN_CH.json');
const AC_TY_CH = loadJsonFile('./data/AC_TY_CH.json');
const UP_STATUS_INFO = loadJsonFile('./data/UP_STATUS_INFO,.json');
const PDU_SES_EST = loadJsonFile('./data/PDU_SES_EST.json');
const COMM_FAIL = loadJsonFile('./data/COMM_FAIL.json');

const TEST_START_TIME = new Date();

// Add randomization functions
function randomizeCommonFields(payload) {
  payload.notifId = "notification-" + Math.random().toString(36).substring(2, 10);
  payload.eventNotifs[0].timeStamp = new Date(Date.now() + Math.floor(Math.random()*100000)).toISOString();
  return payload;
}

function randomizePduSessionFields(payload) {
  if (payload.eventNotifs[0].pduSeId) {
    payload.eventNotifs[0].pduSeId = "pdu-" + Math.floor(Math.random()*1000);
  }
  if (payload.eventNotifs[0].dnn) {
    const operators = ['mnc015.mcc234', 'mnc001.mcc230', 'mnc002.mcc240'];
    payload.eventNotifs[0].dnn = `internet.${operators[Math.floor(Math.random()*operators.length)]}.gprs`;
  }
  return payload;
}

function randomizePlmnFields(payload) {
  if (payload.eventNotifs[0].plmnId) {
    payload.eventNotifs[0].plmnId.mcc = String(Math.floor(Math.random()*900 + 100));
    payload.eventNotifs[0].plmnId.mnc = String(Math.floor(Math.random()*990 + 10)).padStart(2, '0');
  }
  return payload;
}

function randomizeAccessTypeFields(payload) {
  if (payload.eventNotifs[0].accType) {
    payload.eventNotifs[0].accType = Math.floor(Math.random()*2); // 0 or 1
  }
  if (payload.eventNotifs[0].ratType) {
    payload.eventNotifs[0].ratType = Math.floor(Math.random()*7) + 1; // 1 to 7
  }
  return payload;
}

function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

function safelyAddMetric(metric, value, tags = {}) {
  if (isValidNumber(value)) {
    metric.add(value, tags);
  }
}

function sendNotification(payload, scenarioType) {
  try {
    const startTime = new Date();
    
    const payloadString = JSON.stringify(payload);
    const payloadSize = payloadString.length;
    
    let response = http.post(
      'http://nwdaf:8080/nnwdaf-analyticsinfo/v1/notify',
      payloadString,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const duration = new Date() - startTime;
    
    // Safely add metrics with validation
    if (isValidNumber(duration)) {
      safelyAddMetric(notificationLatency, duration);
      safelyAddMetric(scenarioLatency, duration, { scenario: scenarioType });
    }

    safelyAddMetric(scenarioRate, response.status === 204);
    safelyAddMetric(scenarioErrors, response.status !== 204);
    safelyAddMetric(eventTypeCounter, 1, { type: scenarioType });
    safelyAddMetric(inputThroughputBytes, payloadSize);

    const throughputRate = duration > 0 ? payloadSize / (duration / 1000) : 0;
    if (isValidNumber(throughputRate)) {
      safelyAddMetric(inputThroughputRate, throughputRate);
    }

    check(response, { 
      'status is 204': (r) => r.status === 204,
      'has valid headers': (r) => r.headers['Content-Type'] === 'application/json'
    });
    scenarioCounter.add(1, { scenario: scenarioType });
    sleep(1);
  } catch (error) {
    console.error(`Error in sendNotification for ${scenarioType}:`, {
      message: error.message,
      stack: error.stack,
      payload: payload
    });
    safelyAddMetric(scenarioErrors, 1, { type: 'error', scenario: scenarioType });
  }
}

export function pduSessionReleaseScenario() {
  try {
    let payload = JSON.parse(PDU_SES_REL);
    payload = randomizeCommonFields(payload);
    payload = randomizePduSessionFields(payload);
    sendNotification(payload,'PDUSessionRelease');
  } catch (error) {
    console.error('Error in pduSessionReleaseScenario:', error);
  }
}

export function plmnChangeScenario() {
  try {
    let payload = JSON.parse(PLMN_CH);
    payload = randomizeCommonFields(payload);
    payload = randomizePlmnFields(payload);
    sendNotification(payload, 'PLMNChange');
  } catch (error) {
    console.error('Error in plmnChangeScenario:', error);
  }
}

export function acTyChangeScenario() {
  try {
    let payload = JSON.parse(AC_TY_CH);
    payload = randomizeCommonFields(payload);
    payload = randomizeAccessTypeFields(payload);
    sendNotification(payload, 'AccessTypeChange');
  } catch (error) {
    console.error('Error in acTyChangeScenario:', error);
  }
}

export function upStatusInfoScenario() {
  try {
    let payload = JSON.parse(UP_STATUS_INFO);
    payload = randomizeCommonFields(payload);
    sendNotification(payload, 'UPStatusInfo');
  } catch (error) {
    console.error('Error in upStatusInfoScenario:', error);
  }
}

export function pduSessionEstScenario() {
  try {
    let payload = JSON.parse(PDU_SES_EST);
    payload = randomizeCommonFields(payload);
    sendNotification(payload, 'PDUSessionEstablishment');
  } catch (error) {
    console.error('Error in pduSessionEstScenario:', error);
  }
}

export function commFailScenario() {
  try {
    let payload = JSON.parse(COMM_FAIL);
    payload = randomizeCommonFields(payload);
    sendNotification(payload, 'CommFail');
  } catch (error) {
    console.error('Error in commFailScenario:', error);
  }
}

export function pcfDummyTriggerScenario() {
  try {
    scenarioCounter.add(1, { scenario: 'PCFDummyTrigger' });
    const startTime = new Date(); 

    const response = http.post(
      'http://nwdaf:8080/npcf-dummy-trigger',
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );

    const duration = new Date() - startTime;
    
    if (isValidNumber(duration)) {
      safelyAddMetric(notificationLatency, duration);
      safelyAddMetric(scenarioLatency, duration, { scenario: 'pcfDummyTrigger' });
    }

    safelyAddMetric(scenarioRate, response.status === 200);
    safelyAddMetric(scenarioErrors, response.status !== 200);
    safelyAddMetric(eventTypeCounter, 1, { type: 'PCF_DUMMY_TRIGGER' });

    

    check(response, {
      'status is 200': (r) => r.status === 200,
      'has valid headers': (r) => r.headers['Content-Type'] === 'application/json'
    });
    const throughputRate = duration > 0 ? (response.body.length || 0) / (duration / 1000) : 0;
    if (isValidNumber(throughputRate)) {
      safelyAddMetric(outputThroughputRate, throughputRate);
    }
    safelyAddMetric( outputThroughputBytes, response.body.length || 0);
    sleep(1);
  } catch (error) {
    console.error('Error in pcfDummyTriggerScenario:', error);
    safelyAddMetric(scenarioErrors, 1, { type: 'error', scenario: 'PCFDummyTrigger' });
  }
}
