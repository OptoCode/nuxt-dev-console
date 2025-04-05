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

            <!-- Development Logger -->
            <h2 class="text-h6 mb-2 mt-4">Development Logger</h2>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="success" block @click="testDevLog">
                  Dev Log
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" block @click="testDevError">
                  Dev Error
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="warning" block @click="testDevWarn">
                  Dev Warning
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="info" block @click="testDevInfo">
                  Dev Info
                </v-btn>
              </v-col>
            </v-row>
            
            <v-row class="mt-2">
              <v-col cols="12" sm="6" md="3">
                <v-btn color="secondary" block @click="testDevGroup">
                  Dev Group
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="secondary" block @click="testDevTime">
                  Dev Time
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="secondary" block @click="testDevTable">
                  Dev Table
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="secondary" block @click="testDevGlobal">
                  Dev Global
                </v-btn>
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
import { ref, onMounted } from "vue";

defineOptions({
  name: "DevConsoleIndex",
});

const nuxtApp = useNuxtApp();
const devLogger = ref(null);

// Create a fallback logger in case the plugin isn't loaded yet
const fallbackLogger = {
  log: (...args) => console.log('[DevLogger Fallback]', ...args),
  info: (...args) => console.info('[DevLogger Fallback]', ...args),
  warn: (...args) => console.warn('[DevLogger Fallback]', ...args),
  error: (...args) => console.error('[DevLogger Fallback]', ...args),
  debug: (...args) => console.debug('[DevLogger Fallback]', ...args),
  group: (label) => console.group(`[DevLogger Fallback] ${label}`),
  groupEnd: () => console.groupEnd(),
  time: (label) => console.time(`[DevLogger Fallback] ${label}`),
  timeEnd: (label) => console.timeEnd(`[DevLogger Fallback] ${label}`),
  trace: (...args) => console.trace('[DevLogger Fallback]', ...args),
  assert: (condition, ...args) => console.assert(condition, '[DevLogger Fallback]', ...args),
  table: (data, columns) => console.table(data, columns),
  dir: (obj, options) => console.dir(obj, options),
  dirxml: (obj) => console.dirxml(obj),
};

// Initialize the logger
onMounted(() => {
  // Check if the plugin is available
  if (nuxtApp.$devLogger) {
    devLogger.value = nuxtApp.$devLogger;
    console.log('Using plugin devLogger');
  } else {
    // Use fallback
    devLogger.value = fallbackLogger;
    console.warn('DevLogger plugin not found, using fallback');
  }
});

// Basic console logs
const testLog = () => {
  console.log("This is a test log message");
};

const testError = () => {
  console.error("This is a test error message");
};

const testWarn = () => {
  console.warn("This is a test warning message");
};

const testInfo = () => {
  console.info("This is a test info message");
};

// Development logger tests
const testDevLog = () => {
  if (devLogger.value) {
    devLogger.value.log("This is a development-only log message");
  } else {
    console.log("[DevLogger not available] This is a development-only log message");
  }
};

const testDevError = () => {
  if (devLogger.value) {
    devLogger.value.error("This is a development-only error message");
  } else {
    console.error("[DevLogger not available] This is a development-only error message");
  }
};

const testDevWarn = () => {
  if (devLogger.value) {
    devLogger.value.warn("This is a development-only warning message");
  } else {
    console.warn("[DevLogger not available] This is a development-only warning message");
  }
};

const testDevInfo = () => {
  if (devLogger.value) {
    devLogger.value.info("This is a development-only info message");
  } else {
    console.info("[DevLogger not available] This is a development-only info message");
  }
};

const testDevGroup = () => {
  if (devLogger.value) {
    devLogger.value.group("Development Logger Group");
    devLogger.value.log("This is inside a group");
    devLogger.value.info("More information inside the group");
    devLogger.value.warn("Warning inside the group");
    devLogger.value.groupEnd();
  } else {
    console.group("[DevLogger not available] Development Logger Group");
    console.log("This is inside a group");
    console.info("More information inside the group");
    console.warn("Warning inside the group");
    console.groupEnd();
  }
};

const testDevTime = () => {
  if (devLogger.value) {
    const label = "Operation timing";
    devLogger.value.time(label);
    
    // Simulate an operation that takes some time
    setTimeout(() => {
      devLogger.value.timeEnd(label);
    }, 1500);
    
    devLogger.value.log("Timer started, will end in 1.5 seconds");
  } else {
    const label = "[DevLogger not available] Operation timing";
    console.time(label);
    
    setTimeout(() => {
      console.timeEnd(label);
    }, 1500);
    
    console.log("Timer started, will end in 1.5 seconds");
  }
};

const testDevTable = () => {
  const data = [
    { name: "John", age: 30, role: "Developer" },
    { name: "Jane", age: 28, role: "Designer" },
    { name: "Bob", age: 35, role: "Manager" }
  ];
  
  if (devLogger.value) {
    devLogger.value.table(data);
  } else {
    console.table(data);
  }
};

const testDevGlobal = () => {
  // This demonstrates using the global $devLogger object
  if (window.$devLogger) {
    window.$devLogger.log("Using the global $devLogger object");
    window.$devLogger.info("This is only available in development mode");
  } else {
    console.warn("Global $devLogger is not available (production mode or not initialized)");
  }
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
