import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  ENDPOINTS,
  notificationLatency,
  scenarioRate,
  scenarioLatency,
  scenarioErrors,
  eventTypeCounter,
  scenarioCounter,
  inputThroughputBytes,
  inputThroughputRate,
  outputThroughputBytes,
  outputThroughputRate,
  PDU_SES_REL,
  PLMN_CH,
  AC_TY_CH,
  UP_STATUS_INFO,
  PDU_SES_EST,
  COMM_FAIL
} from './config/commonConfig.js';

import {
  SCENARIOS,
  INFLUXDB_CONFIG,
  TEST_TYPE,
  MAX_SCENARIO_VUS,
  TIME_CONFIG
} from './config/configSelector.js';

// Use the pre-configured scenarios from the test type file
export let options = {
  scenarios: SCENARIOS,
  ext: {
    loadimpact: {
      distribution: {
        'local': null
      }
    }
  },
  influxdb: INFLUXDB_CONFIG,
  // Add test type as a tag for better InfluxDB/Grafana filtering
  tags: {
    testType: TEST_TYPE
  }
};

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
  const startTime = new Date();
  
  const payloadString = JSON.stringify(payload);
  const payloadSize = payloadString.length;
  
  let response = http.post(
    ENDPOINTS.NOTIFICATION,
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
  safelyAddMetric(scenarioErrors, 1, { type: 'error', scenario: scenarioType });
}

/**
 * Common function to handle PCF dummy endpoint requests
 * @param {string} endpoint - The endpoint to send the request to
 * @param {string} scenarioName - Name of the scenario for metrics
 */
function sendPcfDummyRequest(endpoint, scenarioName) {
  scenarioCounter.add(1, { scenario: scenarioName });
  const startTime = new Date(); 

  const response = http.post(
    endpoint,
    {},
    { headers: { 'Content-Type': 'application/json' } }
  );

  const duration = new Date() - startTime;
  
  if (isValidNumber(duration)) {
    safelyAddMetric(notificationLatency, duration);
    safelyAddMetric(scenarioLatency, duration, { scenario: scenarioName });
  }

  safelyAddMetric(scenarioRate, response.status === 200);
  safelyAddMetric(scenarioErrors, response.status !== 200);
  safelyAddMetric(eventTypeCounter, 1, { type: scenarioName });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'has valid headers': (r) => r.headers['Content-Type'] === 'application/json'
  });
  
  const throughputRate = duration > 0 ? (response.body.length || 0) / (duration / 1000) : 0;
  if (isValidNumber(throughputRate)) {
    safelyAddMetric(outputThroughputRate, throughputRate);
  }
  safelyAddMetric(outputThroughputBytes, response.body.length || 0);
  sleep(1);
}

export function pduSessionReleaseScenario() {
  let payload = JSON.parse(PDU_SES_REL);
  payload = randomizeCommonFields(payload);
  payload = randomizePduSessionFields(payload);
  sendNotification(payload,'PDUSessionRelease');
}

export function plmnChangeScenario() {
  let payload = JSON.parse(PLMN_CH);
  payload = randomizeCommonFields(payload);
  payload = randomizePlmnFields(payload);
  sendNotification(payload, 'PLMNChange');
}

export function acTyChangeScenario() {
  let payload = JSON.parse(AC_TY_CH);
  payload = randomizeCommonFields(payload);
  payload = randomizeAccessTypeFields(payload);
  sendNotification(payload, 'AccessTypeChange');
}

export function upStatusInfoScenario() {
  let payload = JSON.parse(UP_STATUS_INFO);
  payload = randomizeCommonFields(payload);
  sendNotification(payload, 'UPStatusInfo');
}

export function pduSessionEstScenario() {
  let payload = JSON.parse(PDU_SES_EST);
  payload = randomizeCommonFields(payload);
  sendNotification(payload, 'PDUSessionEstablishment');
}

export function commFailScenario() {
  let payload = JSON.parse(COMM_FAIL);
  payload = randomizeCommonFields(payload);
  sendNotification(payload, 'CommFail');
}

export function pcfDummyTriggerScenario() {
  sendPcfDummyRequest(ENDPOINTS.PCF_DUMMY_QOS, 'PCFDummyQoS');
}

export function pcfDummyUeMobilityScenario() {
  sendPcfDummyRequest(ENDPOINTS.PCF_DUMMY_UE, 'PCFDummyUE');
}

