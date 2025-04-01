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
import { useRuntimeConfig } from "#app";
import useDevLog from "../composables/useDevLog";
import useNuxtErrorHandler from "../composables/useNuxtErrorHandler";

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

const { logs, log, error, warn, info, clear } = useDevLog();
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

// Update the theme toggle method
const toggleTheme = () => {
  const current = currentTheme.value;
  localTheme.value = current === "dark" ? "light" : "dark";
};

// Add a watcher for merged props theme changes
watch(
  () => mergedProps.value?.theme,
  (newTheme) => {
    if (newTheme) {
      localTheme.value = newTheme;
    }
  },
  { immediate: true }
);

// Position handling
const dialogPosition = computed(() => {
  // Ensure we have a valid position string
  const defaultPosition = "bottom-right";
  const position =
    typeof mergedProps.value?.position === "string"
      ? mergedProps.value.position
      : defaultPosition;

  // Split the position string safely
  let vertical = "bottom";
  let horizontal = "right";

  if (position.includes("-")) {
    const parts = position.split("-");
    if (parts.length === 2) {
      const [v, h] = parts;
      if (["top", "bottom"].includes(v)) vertical = v;
      if (["left", "right"].includes(h)) horizontal = h;
    }
  }

  return { vertical, horizontal };
});

// Log history management
watch(
  () => logs.value.length,
  (newLength) => {
    if (newLength > mergedProps.value.maxLogHistory) {
      logs.value = logs.value.slice(-mergedProps.value.maxLogHistory);
    }
  },
  { immediate: true }
);

const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
};

const logTypes = [
  { type: "log", icon: "mdi-console", color: "secondary" },
  { type: "error", icon: "mdi-alert-circle", color: "error" },
  { type: "warn", icon: "mdi-alert", color: "warning" },
  { type: "info", icon: "mdi-information", color: "info" },
];

// Filter logs based on minimum level
const logLevels = {
  info: 0,
  warn: 1,
  error: 2,
};

const filteredLogs = computed(() => {
  if (!logs.value) return [];

  return logs.value.filter((log) => {
    // Type filter
    const matchesType = selectedTypes.value.includes(log.type);
    if (!matchesType) return false;

    // Level filter
    const logLevel = logLevels[log.type] || 0;
    const minLevel =
      logLevels[mergedProps.value?.filters?.minLevel || "info"] || 0;
    const matchesLevel = logLevel >= minLevel;
    if (!matchesLevel) return false;

    // Search filter
    if (!searchQuery.value) return true;

    const searchText = log.content
      .map((item) => {
        if (item === null) return "null";
        if (item === undefined) return "undefined";
        if (typeof item === "object") {
          try {
            return JSON.stringify(item);
          } catch (e) {
            return String(item);
          }
        }
        return String(item);
      })
      .join(" ")
      .toLowerCase();

    return searchText.includes(searchQuery.value.toLowerCase());
  });
});

const getLogColor = (type) => {
  switch (type) {
    case "error":
      return "error";
    case "warn":
      return "warning";
    case "info":
      return "info";
    default:
      return "secondary";
  }
};

const interceptConsole = () => {
  if (!isDev) return;

  // Store original methods with proper binding
  console.log = (...args) => {
    log(...args);
    originalConsole.log(...args);
  };

  console.error = (...args) => {
    error(...args);
    originalConsole.error(...args);
  };

  console.warn = (...args) => {
    warn(...args);
    originalConsole.warn(...args);
  };

  console.info = (...args) => {
    info(...args);
    originalConsole.info(...args);
  };
};

const restoreConsole = () => {
  Object.assign(console, originalConsole);
};

const clearLogs = () => {
  clear();
};

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const copyToClipboard = async (log) => {
  try {
    const content = log.content
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item, null, 2) : item
      )
      .join(" ");
    await navigator.clipboard.writeText(content);
    snackbarText.value = "Log copied to clipboard";
    snackbar.value = true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    snackbarText.value = "Failed to copy to clipboard";
    snackbar.value = true;
  }
};

// Keyboard shortcuts
const handleKeyboardShortcut = (event) => {
  const shortcutString = [];
  if (event.ctrlKey) shortcutString.push("ctrl");
  if (event.shiftKey) shortcutString.push("shift");
  if (event.altKey) shortcutString.push("alt");
  if (event.key !== "Control" && event.key !== "Shift" && event.key !== "Alt") {
    shortcutString.push(event.key.toLowerCase());
  }

  const pressedShortcut = shortcutString.join("+");

  if (pressedShortcut === mergedProps.value.shortcuts.toggle) {
    toggleVisibility();
    event.preventDefault();
  } else if (
    pressedShortcut === mergedProps.value.shortcuts.clear &&
    isVisible.value
  ) {
    clearLogs();
    event.preventDefault();
  }
};

onMounted(() => {
  interceptConsole();
  window.addEventListener("keydown", handleKeyboardShortcut);
  // Initialize Nuxt error handler
  useNuxtErrorHandler();
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
        [dialogPosition.vertical]: '16px',
        [dialogPosition.horizontal]: '16px',
      }"
      @click="toggleVisibility"
    >
      <v-icon>mdi-console</v-icon>
      <v-badge
        :content="logs.length"
        :model-value="logs.length > 0"
        color="error"
        location="bottom end"
      />
    </v-btn>

    <v-dialog
      v-model="isVisible"
      :width="Number(mergedProps?.value?.width || 800)"
      :height="Number(mergedProps?.value?.height || 600)"
      :theme="currentTheme"
      scrollable
      :position="dialogPosition.vertical"
      :location="dialogPosition.horizontal"
    >
      <v-card :height="Number(mergedProps?.value?.height || 600)">
        <v-toolbar
          :color="currentTheme === 'dark' ? 'grey-darken-3' : 'primary'"
        >
          <v-toolbar-title>Development Console</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="toggleTheme">
            <v-icon>mdi-theme-light-dark</v-icon>
            <v-tooltip activator="parent">
              Theme: {{ currentTheme === "dark" ? "Dark" : "Light" }}
            </v-tooltip>
          </v-btn>
          <v-btn icon @click="clearLogs">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent">
              Clear logs ({{
                mergedProps?.value?.shortcuts?.clear || "ctrl+l"
              }})
            </v-tooltip>
          </v-btn>
          <v-btn icon @click="isVisible = false">
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent">
              Close ({{
                mergedProps?.value?.shortcuts?.toggle || "ctrl+shift+d"
              }})
            </v-tooltip>
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
              class="flex-grow-1 mr-4"
              clearable
            />
            <v-btn-toggle
              v-model="selectedTypes"
              multiple
              density="comfortable"
              divided
              class="flex-shrink-0"
            >
              <v-btn
                v-for="type in logTypes"
                :key="type.type"
                :value="type.type"
                variant="text"
              >
                <v-icon :icon="type.icon" />
                <v-tooltip activator="parent" location="bottom">
                  {{ type.type.toUpperCase() }}
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </div>

          <div
            v-if="
              mergedProps.filters.showTimestamp ||
              mergedProps.filters.showLogLevel
            "
            class="d-flex mb-2"
          >
            <v-chip
              v-if="mergedProps.filters.showLogLevel"
              class="mr-2"
              :color="
                currentTheme === 'dark' ? 'grey-darken-3' : 'grey-lighten-3'
              "
              size="small"
            >
              Min Level: {{ mergedProps.filters.minLevel.toUpperCase() }}
            </v-chip>
            <v-chip
              v-if="mergedProps.filters.showTimestamp"
              :color="
                currentTheme === 'dark' ? 'grey-darken-3' : 'grey-lighten-3'
              "
              size="small"
            >
              Showing Timestamps
            </v-chip>
          </div>

          <v-expansion-panels v-if="filteredLogs.length">
            <v-expansion-panel
              v-for="(log, index) in filteredLogs"
              :key="index"
              :color="getLogColor(log.type)"
            >
              <v-expansion-panel-title>
                <div
                  class="d-flex align-center justify-space-between w-100 gap-4"
                >
                  <div class="d-flex align-center flex-grow-1">
                    <v-icon
                      :icon="logTypes.find((t) => t.type === log.type)?.icon"
                      color="white"
                      class="mr-2"
                      @click.stop="copyToClipboard(log)"
                    />
                    <v-tooltip activator="parent" location="left">
                      {{ `Copy ${log.type.toUpperCase()} content` }}
                    </v-tooltip>
                    <span class="text-truncate">{{
                      log.content[0]?.toString().slice(0, 50) +
                      (log.content[0]?.toString().length > 50 ? "..." : "")
                    }}</span>
                  </div>
                  <div
                    class="text-caption font-weight-bold"
                    style="min-width: 80px"
                  >
                    {{
                      new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    }}
                  </div>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <pre class="my-0 text-body-2 text-wrap">{{
                  log.content
                    .map((item) =>
                      typeof item === "object"
                        ? JSON.stringify(item, null, 2)
                        : item
                    )
                    .join(" ")
                }}</pre>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-alert
            v-else-if="logs.length"
            type="info"
            text="No logs match your filters"
          />
          <v-alert v-else type="info" text="No console logs captured yet" />
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
}
</style>
