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
    SCENARIO_START_TIMES,
    SCENARIO_RATES,
    TIME_CONFIG
  } = config;

  // Common function to properly format startTime
  function formatStartTime(seconds) {
    return seconds !== undefined ? `${seconds}s` : '0s';
  }

  // Configure each scenario based on the executor type
  function getScenarioConfig(scenarioName, rate) {
    const upperName = scenarioName.toUpperCase();
    const baseConfig = {
      executor: COMMON_EXECUTOR,
      exec: scenarioName + 'Scenario',
      startTime: formatStartTime(SCENARIO_START_TIMES[upperName])
    };
    
    if (COMMON_EXECUTOR === 'ramping-vus') {
      return {
        ...baseConfig,
        startVUs: Math.max(1, Math.round(MAX_SCENARIO_VUS / 100)),
        stages: COMMON_STAGES
      };
    } else if (COMMON_EXECUTOR === 'constant-vus') {
      return {
        ...baseConfig,
        vus: Math.max(1, Math.round(MAX_SCENARIO_VUS / 7)), // Divide total VUs among scenarios
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
  
  return {
    pduSessionRelease: getScenarioConfig('pduSessionRelease', SCENARIO_RATES.PDU_SESSION_RELEASE),
    plmnChange: getScenarioConfig('plmnChange', SCENARIO_RATES.PLMN_CHANGE),
    acTyChange: getScenarioConfig('acTyChange', SCENARIO_RATES.ACCESS_TYPE_CHANGE),
    upStatusInfo: getScenarioConfig('upStatusInfo', SCENARIO_RATES.UP_STATUS_INFO),
    pduSessionEst: getScenarioConfig('pduSessionEst', SCENARIO_RATES.PDU_SESSION_EST),
    commFail: getScenarioConfig('commFail', SCENARIO_RATES.COMM_FAIL),
    pcfDummyTrigger: getScenarioConfig('pcfDummyTrigger', SCENARIO_RATES.PCF_DUMMY_TRIGGER)
  };
}
