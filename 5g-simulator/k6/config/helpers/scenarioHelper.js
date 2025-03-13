/**
 * Creates scenario configurations based on executor type and test parameters
 * @param {Object} config - The test configuration with all necessary parameters
 * @returns {Object} - Complete scenario configurations ready to use in k6
 */
export function generateScenarios(config) {
  const {
    COMMON_EXECUTOR,
    MAX_SCENARIO_VUS,
    COMMON_STAGES,
    SCENARIO_STAGES,
    SCENARIO_START_TIMES,
    SCENARIO_RATES,
    TIME_CONFIG
  } = config;

  // Common function to properly format startTime
  function formatStartTime(seconds) {
    return seconds !== undefined ? `${seconds}s` : '0s';
  }

  // Configure each scenario based on the executor type
  function getScenarioConfig(scenarioName, rate, startTime) {
    const upperName = scenarioName.toUpperCase();
    const baseConfig = {
      executor: COMMON_EXECUTOR,
      exec: scenarioName + 'Scenario',
      startTime: formatStartTime(startTime)
    };
    
    if (COMMON_EXECUTOR === 'ramping-vus') {
      const stages = SCENARIO_STAGES[scenarioName];
      return {
        ...baseConfig,
        startVUs: rate,
        stages: stages
      };
    } else if (COMMON_EXECUTOR === 'constant-vus') {
      return {
        ...baseConfig,
        vus: rate,
        duration: TIME_CONFIG.DURATION
      };
    } else if (COMMON_EXECUTOR === 'constant-arrival-rate' || COMMON_EXECUTOR === 'ramping-arrival-rate') {
      return {
        ...baseConfig,
        rate: rate,
        timeUnit: TIME_CONFIG.TIME_UNIT,
        duration: TIME_CONFIG.DURATION,
        preAllocatedVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
        maxVUs: MAX_SCENARIO_VUS
      };
    }
    
    return baseConfig;
  }
  
  const scenarios = {};
  // Only include scenarios that have specific stages defined
  if (SCENARIO_STAGES) {
    if (SCENARIO_STAGES.pduSessionRelease) {
      scenarios.pduSessionRelease = getScenarioConfig('pduSessionRelease', SCENARIO_RATES.PDU_SESSION_RELEASE, SCENARIO_START_TIMES.PDU_SESSION_RELEASE);
    }
    
    if (SCENARIO_STAGES.plmnChange) {
      scenarios.plmnChange = getScenarioConfig('plmnChange', SCENARIO_RATES.PLMN_CHANGE, SCENARIO_START_TIMES.PLMN_CHANGE);
    }
    
    if (SCENARIO_STAGES.acTyChange) {
      scenarios.acTyChange = getScenarioConfig('acTyChange', SCENARIO_RATES.ACCESS_TYPE_CHANGE, SCENARIO_START_TIMES.ACCESS_TYPE_CHANGE);
    }
    
    if (SCENARIO_STAGES.upStatusInfo) {
      scenarios.upStatusInfo = getScenarioConfig('upStatusInfo', SCENARIO_RATES.UP_STATUS_INFO, SCENARIO_START_TIMES.UP_STATUS_INFO);
    }
    
    if (SCENARIO_STAGES.pduSessionEst) {
      scenarios.pduSessionEst = getScenarioConfig('pduSessionEst', SCENARIO_RATES.PDU_SESSION_EST, SCENARIO_START_TIMES.PDU_SESSION_EST);
    }
    
    if (SCENARIO_STAGES.commFail) {
      scenarios.commFail = getScenarioConfig('commFail', SCENARIO_RATES.COMM_FAIL, SCENARIO_START_TIMES.COMM_FAIL);
    }
    
    if (SCENARIO_STAGES.pcfDummyTriggerQos) {
      scenarios.pcfDummyTriggerQos = getScenarioConfig('pcfDummyTriggerQos', SCENARIO_RATES.PCF_DUMMY_TRIGGER_QOS, SCENARIO_START_TIMES.PCF_DUMMY_TRIGGER_QOS);
    }
    
    if (SCENARIO_STAGES.pcfDummyUeMobility) {
      scenarios.pcfDummyTriggerUe = getScenarioConfig('pcfDummyUeMobility', SCENARIO_RATES.PCF_DUMMY_TRIGGER_UE, SCENARIO_START_TIMES.PCF_DUMMY_TRIGGER_UE);
    }
  }
  
  return scenarios;
}
