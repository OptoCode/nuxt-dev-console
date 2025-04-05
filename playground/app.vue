<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 mb-4">Nuxt Dev Console Test</h1>

            <!-- Basic Console Logs -->
            <h2 class="text-h6 mb-2">Basic Console Logs</h2>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="success" block @click="testLog"> Test Log </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="testError">
                  Test Error
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="warning" block @click="testWarn">
                  Test Warning
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="info" block @click="testInfo"> Test Info </v-btn>
              </v-col>
            </v-row>

            <!-- Vue Errors -->
            <h2 class="text-h6 mb-2 mt-4">Vue Errors</h2>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="triggerVueError">
                  Trigger Vue Error
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="warning" block @click="triggerVueWarning">
                  Trigger Vue Warning
                </v-btn>
              </v-col>
            </v-row>

            <!-- Nuxt Errors -->
            <h2 class="text-h6 mb-2 mt-4">Nuxt Errors</h2>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="triggerNuxtError">
                  Trigger Nuxt Error
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="warning" block @click="triggerNuxtWarning">
                  Trigger Nuxt Warning
                </v-btn>
              </v-col>
            </v-row>

            <!-- Runtime Errors -->
            <h2 class="text-h6 mb-2 mt-4">Runtime Errors</h2>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="triggerRuntimeError">
                  Trigger Runtime Error
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="triggerAsyncError">
                  Trigger Async Error
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <dev-console />
  </v-app>
</template>

<script setup>
import { useNuxtApp } from "#app";
import useDevLog from "../src/runtime/composables/useDevLog";

defineOptions({
  name: "DevConsoleIndex",
});

const { log, error, warn, info } = useDevLog();
const nuxtApp = useNuxtApp();

// Basic console logs
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

// Vue Errors
const triggerVueError = () => {
  // This will trigger a Vue error because we're trying to access a property of undefined
  const undefinedComponent = undefined;
  undefinedComponent.someProperty;
};

const triggerVueWarning = () => {
  // This will trigger a Vue warning because we're using a prop without defining it
  defineProps({
    requiredProp: {
      type: String,
      required: true,
    },
  });
};

// Nuxt Errors
const triggerNuxtError = () => {
  // This will trigger a Nuxt error through the app:error hook
  nuxtApp.callHook("app:error", new Error("This is a Nuxt error"));
};

const triggerNuxtWarning = () => {
  // This will trigger a Nuxt warning through the app:warn hook
  nuxtApp.callHook("app:warn", "This is a Nuxt warning");
};

// Runtime Errors
const triggerRuntimeError = () => {
  // This will trigger a runtime error
  throw new Error("This is a runtime error");
};

const triggerAsyncError = async () => {
  // This will trigger an async error
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("This is an async error"));
    }, 100);
  });
};
</script>

<style>
.v-application {
  background-color: #f5f5f5;
}
</style>
