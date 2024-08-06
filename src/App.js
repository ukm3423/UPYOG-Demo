import React from "react";

import {
  initPGRComponents,
  PGRReducers,
} from "@upyog/digit-ui-module-pgr";
import { initFSMComponents } from "@upyog/digit-ui-module-fsm";
import { DigitUI } from "@upyog/digit-ui-module-core";
import { initLibraries } from "@upyog/digit-ui-libraries";
import { initDSSComponents } from "@upyog/digit-ui-module-dss";


initLibraries();


const enabledModules = ["FSM", "PGR", "DSS"];

window.Digit.ComponentRegistryService.setupRegistry({
  // FSM module doesn't have specific exports for registry setup in this example
});

initFSMComponents();
initPGRComponents();
initDSSComponents();

const moduleReducers = (initData) => ({
  pgr: PGRReducers(initData),
});

function App() {
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID || 'pg';
  if (!stateCode) {
    return <h1>UPYOG ka upyog kijiye !!!</h1>;
  }
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
    />
  );
}

export default App;
