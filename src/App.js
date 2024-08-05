import React from "react";

import { initFSMComponents } from "@upyog/digit-ui-module-fsm";
import { DigitUI } from "@upyog/digit-ui-module-core";
import { initLibraries } from "@upyog/digit-ui-libraries";

initLibraries();

const enabledModules = ["FSM"];

window.Digit.ComponentRegistryService.setupRegistry({
  // FSM module doesn't have specific exports for registry setup in this example
});

initFSMComponents();

const moduleReducers = (initData) => ({
  // FSM module doesn't have specific reducers in this example
});

function App() {
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID || 'pb';
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
