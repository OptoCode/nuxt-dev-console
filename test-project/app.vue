<template>
  <div>
    <dev-console position="top left" />
  </div>
</template>
<script setup>
import { useDevLog } from "#imports";

const { log, error, warn, info } = useDevLog();

const testLog = () => {
  log("This is a test log message");
};

const testError = () => {
  error("This is a test error message");
};

const testWarn = () => {
  warn("This is a test warning message");
};

const testInfo = () => {
  info("This is a test info message");
};
</script>
