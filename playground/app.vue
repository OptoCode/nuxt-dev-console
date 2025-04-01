<template>
  <v-container>
    <h1>Nuxt Dev Console Test</h1>
    <div class="buttons">
      <button @click="testLog">Test Log</button>
      <button @click="testError">Test Error</button>
      <button @click="testWarn">Test Warning</button>
      <button @click="testInfo">Test Info</button>
    </div>
    <dev-console position="top left" />
  </v-container>
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

<style>
.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:nth-child(1) {
  background: #4caf50;
  color: white;
}

button:nth-child(2) {
  background: #f44336;
  color: white;
}

button:nth-child(3) {
  background: #ff9800;
  color: white;
}

button:nth-child(4) {
  background: #2196f3;
  color: white;
}
</style>
