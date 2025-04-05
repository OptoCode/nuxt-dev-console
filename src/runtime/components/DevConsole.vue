<script>
// Props definition in normal script tag
export const props = {
  position: {
    type: String,
    default: "bottom-right",
    validator: (value) => {
      const validPositions = [
        "bottom-right",
        "bottom-left",
        "top-right",
        "top-left",
      ];
      return validPositions.includes(value);
    },
  },
  theme: {
    type: String,
    default: "dark",
    validator: (value) => ["dark", "light", "system"].includes(value),
  },
  height: {
    type: Number,
    default: 600,
    validator: (value) => value >= 100,
  },
  width: {
    type: Number,
    default: 800,
    validator: (value) => value >= 200,
  },
  maxLogHistory: {
    type: Number,
    default: 100,
    validator: (value) => value >= 10,
  },
  shortcuts: {
    type: Object,
    default: () => ({
      toggle: "ctrl+shift+d",
      clear: "ctrl+l",
    }),
    validator: (value) => {
      return (
        value &&
        typeof value.toggle === "string" &&
        typeof value.clear === "string"
      );
    },
  },
  filters: {
    type: Object,
    default: () => ({
      showTimestamp: true,
      showLogLevel: true,
      minLevel: "info",
    }),
    validator: (value) => {
      return (
        value &&
        typeof value.showTimestamp === "boolean" &&
        typeof value.showLogLevel === "boolean" &&
        ["info", "warn", "error"].includes(value.minLevel)
      );
    },
  },
};
</script>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRuntimeConfig, useNuxtApp } from "#app";

const config = useRuntimeConfig().public.devConsole;

// Merge config with props
const mergedProps = computed(() => {
  const validPositions = [
    "bottom-right",
    "bottom-left",
    "top-right",
    "top-left",
  ];
  const validThemes = ["dark", "light", "system"];
  const validLogLevels = ["info", "warn", "error"];

  // Ensure we have valid defaults
  const defaultProps = {
    position: "bottom-right",
    theme: "dark",
    height: 600,
    width: 800,
    maxLogHistory: 100,
    shortcuts: {
      toggle: "ctrl+shift+d",
      clear: "ctrl+l",
    },
    filters: {
      showTimestamp: true,
      showLogLevel: true,
      minLevel: "info",
    },
  };

  // Safely merge config with defaults
  const position = validPositions.includes(config?.position)
    ? config.position
    : props?.position || defaultProps.position;

  const theme = validThemes.includes(config?.theme)
    ? config.theme
    : props?.theme || defaultProps.theme;

  const height =
    Number(config?.height) >= 100
      ? Number(config.height)
      : Number(props?.height) || defaultProps.height;

  const width =
    Number(config?.width) >= 200
      ? Number(config.width)
      : Number(props?.width) || defaultProps.width;

  const maxLogHistory =
    Number(config?.maxLogHistory) >= 10
      ? Number(config.maxLogHistory)
      : Number(props?.maxLogHistory) || defaultProps.maxLogHistory;

  // Validate and merge shortcuts with defaults
  const shortcuts = {
    ...defaultProps.shortcuts,
    ...(props?.shortcuts || {}),
    ...(config?.shortcuts && typeof config.shortcuts === "object"
      ? config.shortcuts
      : {}),
  };

  // Validate and merge filters with defaults
  const filters = {
    ...defaultProps.filters,
    ...(props?.filters || {}),
    ...(config?.filters && typeof config.filters === "object"
      ? config.filters
      : {}),
  };

  // Ensure filter values are valid
  filters.showTimestamp =
    typeof filters.showTimestamp === "boolean"
      ? filters.showTimestamp
      : defaultProps.filters.showTimestamp;

  filters.showLogLevel =
    typeof filters.showLogLevel === "boolean"
      ? filters.showLogLevel
      : defaultProps.filters.showLogLevel;

  filters.minLevel = validLogLevels.includes(filters.minLevel)
    ? filters.minLevel
    : defaultProps.filters.minLevel;

  return {
    position,
    theme,
    height,
    width,
    maxLogHistory,
    shortcuts,
    filters,
  };
});

// Implement logging functionality directly in the component
const logs = ref([]);
const maxLogSize = computed(() => mergedProps.value?.maxLogHistory || 100);
let isLogging = false;
let browserConsoleEnabled = true;
let isConsoleIntercepted = false;
let originalConsole = null;

// Create log entry
const createLog = (type, args) => {
  try {
    // Prevent recursive logging
    if (isLogging) return;
    isLogging = true;

    // Log to browser console if enabled
    if (browserConsoleEnabled) {
      // Use original console methods to avoid recursion
      if (originalConsole) {
        originalConsole[type](...args);
      }
    }

    const sanitizedArgs = args.map((arg) => {
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: arg.message,
          stack: arg.stack,
        };
      }
      if (arg === null) return "null";
      if (arg === undefined) return "undefined";
      if (typeof arg === "object") {
        try {
          return JSON.parse(JSON.stringify(arg));
        } catch {
          return String(arg);
        }
      }
      return arg;
    });

    logs.value.push({
      type,
      content: sanitizedArgs,
      timestamp: Date.now(),
    });

    // Trim logs if they exceed maxLogSize
    if (logs.value.length > maxLogSize.value) {
      logs.value = logs.value.slice(-maxLogSize.value);
    }
  } catch {
    // Use the original console to avoid circular reference
    if (!isLogging && originalConsole) {
      originalConsole.error("Failed to create log:");
    }
  } finally {
    isLogging = false;
  }
};

// Log methods
const _log = (...args) => createLog("log", args);
const _error = (...args) => createLog("error", args);
const _warn = (...args) => createLog("warn", args);
const _info = (...args) => createLog("info", args);
const clear = () => {
  logs.value = [];
};

// Console interception
const interceptConsole = () => {
  if (isConsoleIntercepted) return;

  // Store original methods with proper binding
  originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
  };

  // Override console methods
  console.log = (...args) => {
    createLog("log", args);
    originalConsole.log(...args);
  };

  console.error = (...args) => {
    createLog("error", args);
    originalConsole.error(...args);
  };

  console.warn = (...args) => {
    createLog("warn", args);
    originalConsole.warn(...args);
  };

  console.info = (...args) => {
    createLog("info", args);
    originalConsole.info(...args);
  };

  isConsoleIntercepted = true;
};

const restoreConsole = () => {
  if (!isConsoleIntercepted || !originalConsole) return;

  Object.assign(console, originalConsole);
  originalConsole = null;
  isConsoleIntercepted = false;
};

const isVisible = ref(false);
const isDev = process.env.NODE_ENV === "development" || config?.allowProduction;
const searchQuery = ref("");
const selectedTypes = ref(["log", "error", "warn", "info"]);
const snackbar = ref(false);
const snackbarText = ref("");

// First, update the theme state management
const localTheme = ref(mergedProps.value?.theme || "dark");

// Update the currentTheme computed
const currentTheme = computed(() => {
  const themeValue = localTheme.value;

  if (themeValue === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return themeValue;
});

// Add a watcher for merged props theme changes
watch(
  () => mergedProps.value?.theme,
  (newTheme) => {
    if (newTheme) {
      localTheme.value = newTheme;
    }
  }
);

// Implement Nuxt error handling directly
const setupNuxtErrorHandling = () => {
  const nuxtApp = useNuxtApp();
  
  // Handle Nuxt errors
  nuxtApp.hook("app:error", (err) => {
    _error("[Nuxt Error]", err);
  });

  // Handle Nuxt warnings
  nuxtApp.hook("app:warn", (msg) => {
    _warn("[Nuxt Warning]", msg);
  });

  // Handle Vue errors
  nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
    _error("[Vue Error]", err, info);
  };

  // Handle Vue warnings
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    _warn("[Vue Warning]", msg, trace);
  };
};

const toggleTheme = () => {
  const themes = ["dark", "light", "system"];
  const currentIndex = themes.indexOf(localTheme.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  localTheme.value = themes[nextIndex];
};

const getLogColor = (type) => {
  switch (type) {
    case "error":
      return "red";
    case "warn":
      return "orange";
    case "info":
      return "blue";
    default:
      return currentTheme.value === "dark" ? "white" : "black";
  }
};

const clearLogs = () => {
  clear();
};

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const copyToClipboard = (log) => {
  try {
    const content = log.content
      .map((item) => {
        if (typeof item === "object") {
          return JSON.stringify(item, null, 2);
        }
        return String(item);
      })
      .join(" ");

    navigator.clipboard.writeText(content);
    snackbarText.value = "Copied to clipboard";
    snackbar.value = true;
  } catch (error) {
    console.error("Failed to copy:", error);
    snackbarText.value = "Failed to copy to clipboard";
    snackbar.value = true;
  }
};

const handleKeyboardShortcut = (event) => {
  // Check if we're in an input field
  if (
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.isContentEditable
  ) {
    return;
  }

  const toggleKey = mergedProps.value?.shortcuts?.toggle || "ctrl+shift+d";
  const clearKey = mergedProps.value?.shortcuts?.clear || "ctrl+l";

  // Parse the shortcut
  const [toggleMod, toggleChar] = toggleKey.split("+");
  const [clearMod, clearChar] = clearKey.split("+");

  // Toggle console visibility
  if (
    (toggleMod === "ctrl" && event.ctrlKey) ||
    (toggleMod === "alt" && event.altKey) ||
    (toggleMod === "shift" && event.shiftKey)
  ) {
    if (event.key.toLowerCase() === toggleChar) {
      event.preventDefault();
      toggleVisibility();
    }
  }

  // Clear logs when console is visible
  if (
    isVisible.value &&
    ((clearMod === "ctrl" && event.ctrlKey) ||
      (clearMod === "alt" && event.altKey) ||
      (clearMod === "shift" && event.shiftKey))
  ) {
    if (event.key.toLowerCase() === clearChar) {
      event.preventDefault();
      clearLogs();
    }
  }
};

onMounted(() => {
  interceptConsole();
  window.addEventListener("keydown", handleKeyboardShortcut);
  // Initialize Nuxt error handler
  setupNuxtErrorHandling();
  
  // Log initial message
  _info("Dev Console initialized", {
    version: config?.version || "unknown",
    environment: config?.environment || process.env.NODE_ENV,
  });
});

onUnmounted(() => {
  restoreConsole();
  window.removeEventListener("keydown", handleKeyboardShortcut);
});
</script>

<template>
  <div v-if="isDev">
    <v-btn
      icon
      :style="{
        position: 'fixed',
        bottom: mergedProps?.position?.includes('bottom') ? '20px' : 'auto',
        top: mergedProps?.position?.includes('top') ? '20px' : 'auto',
        right: mergedProps?.position?.includes('right') ? '20px' : 'auto',
        left: mergedProps?.position?.includes('left') ? '20px' : 'auto',
        zIndex: 9999,
      }"
      :color="currentTheme === 'dark' ? 'grey-darken-3' : 'primary'"
      @click="toggleVisibility"
    >
      <v-icon>mdi-console</v-icon>
      <v-badge
        :content="logs.length"
        :model-value="logs.length > 0"
        color="error"
        location="bottom end"
      ></v-badge>
    </v-btn>

    <v-dialog
      v-model="isVisible"
      :width="Number(mergedProps?.width || 800)"
      :persistent="false"
      :retain-focus="false"
      :scrim="false"
      :fullscreen="false"
      :no-click-animation="true"
      :scrollable="true"
      :content-class="`dev-console-dialog ${
        mergedProps?.position || 'bottom-right'
      }`"
    >
      <v-card :height="Number(mergedProps?.value?.height || 600)">
        <v-toolbar
          :color="currentTheme === 'dark' ? 'grey-darken-3' : 'primary'"
        >
          <v-toolbar-title>Development Console</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleTheme">
            <v-icon>
              {{
                currentTheme === "dark"
                  ? "mdi-weather-night"
                  : "mdi-weather-sunny"
              }}
            </v-icon>
          </v-btn>
          <v-btn icon @click="clearLogs">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon @click="toggleVisibility">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-4">
          <div class="d-flex align-center gap-4 mb-4">
            <v-text-field
              v-model="searchQuery"
              density="compact"
              placeholder="Search logs..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              :bg-color="currentTheme === 'dark' ? 'grey-darken-4' : 'grey-lighten-4'"
              :theme="currentTheme"
            ></v-text-field>

            <v-chip-group v-model="selectedTypes" multiple>
              <v-chip
                filter
                value="log"
                :color="currentTheme === 'dark' ? 'grey' : 'grey-darken-1'"
                :text-color="currentTheme === 'dark' ? 'white' : 'black'"
              >
                Log
              </v-chip>
              <v-chip filter value="error" color="red">Error</v-chip>
              <v-chip filter value="warn" color="orange">Warn</v-chip>
              <v-chip filter value="info" color="blue">Info</v-chip>
            </v-chip-group>
          </div>

          <v-sheet
            :color="currentTheme === 'dark' ? 'grey-darken-4' : 'grey-lighten-4'"
            class="log-container overflow-y-auto pa-2"
            :theme="currentTheme"
            :style="{ height: 'calc(100% - 60px)' }"
          >
            <template v-if="logs.length === 0">
              <div class="text-center pa-4 text-body-1 text-medium-emphasis">
                No logs yet. Start logging with console.log, console.error, etc.
              </div>
            </template>

            <template v-else>
              <div
                v-for="(log, index) in logs.filter(
                  (log) =>
                    selectedTypes.includes(log.type) &&
                    (searchQuery === '' ||
                      JSON.stringify(log.content)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
                )"
                :key="index"
                class="log-entry pa-2 mb-2 rounded"
                :class="{
                  'log-error': log.type === 'error',
                  'log-warn': log.type === 'warn',
                  'log-info': log.type === 'info',
                }"
              >
                <div class="d-flex align-center">
                  <div
                    class="log-type text-caption font-weight-bold mr-2"
                    :style="{ color: getLogColor(log.type) }"
                  >
                    {{ log.type.toUpperCase() }}
                  </div>
                  <div
                    v-if="mergedProps?.filters?.showTimestamp"
                    class="log-timestamp text-caption text-medium-emphasis mr-2"
                  >
                    {{ new Date(log.timestamp).toLocaleTimeString() }}
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    size="x-small"
                    variant="text"
                    @click="copyToClipboard(log)"
                  >
                    <v-icon size="small">mdi-content-copy</v-icon>
                  </v-btn>
                </div>
                <div class="log-content mt-1">
                  <pre
                    v-for="(content, i) in log.content"
                    :key="i"
                    class="mb-0 text-wrap"
                  >{{ typeof content === 'object' ? JSON.stringify(content, null, 2) : content }}</pre>
                </div>
              </div>
            </template>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000" location="bottom">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.v-dialog {
  margin: 0;
  position: absolute;
  overflow: hidden;
}

.dev-console-dialog.bottom-right {
  bottom: 80px;
  right: 20px;
}

.dev-console-dialog.bottom-left {
  bottom: 80px;
  left: 20px;
}

.dev-console-dialog.top-right {
  top: 80px;
  right: 20px;
}

.dev-console-dialog.top-left {
  top: 80px;
  left: 20px;
}

.log-container {
  border-radius: 4px;
}

.log-entry {
  border-left: 3px solid;
}

.log-entry.log-error {
  border-left-color: red;
  background-color: rgba(255, 0, 0, 0.05);
}

.log-entry.log-warn {
  border-left-color: orange;
  background-color: rgba(255, 165, 0, 0.05);
}

.log-entry.log-info {
  border-left-color: blue;
  background-color: rgba(0, 0, 255, 0.05);
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
