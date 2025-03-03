// Constants
export const SCENARIO_RATES = {
    PDU_SESSION_RELEASE: 10,
    PLMN_CHANGE: 10,
    ACCESS_TYPE_CHANGE: 30,
    UP_STATUS_INFO: 30,
    PDU_SESSION_EST: 30,
    COMM_FAIL: 30,
    PCF_DUMMY_TRIGGER: 10
};

export const COMMON_STAGES = [
    { duration: '30s', target: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)) },
    { duration: '1m', target: Math.round(MAX_SCENARIO_VUS / 2) },
    { duration: '2m', target: MAX_SCENARIO_VUS }
];

export const MAX_SCENARIO_VUS = 350;
export const COMMON_EXECUTOR = 'constant-arrival-rate';

export const SCENARIO_START_TIMES = {
    PDU_SESSION_RELEASE: 0,
    UP_STATUS_INFO: 0,
    PLMN_CHANGE: 0,
    ACCESS_TYPE_CHANGE: 0,
    PDU_SESSION_EST: 0,
    COMM_FAIL: 0,
    PCF_DUMMY_TRIGGER: 0
};

export const TIME_CONFIG = {
    TIME_UNIT: '1s',
    DURATION: '6m'
};

