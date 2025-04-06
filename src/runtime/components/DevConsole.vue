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

// Add debounce utility
const debounce = (fn, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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

// Add localStorage keys
const STORAGE_KEYS = {
  LOGS: 'dev-console-logs',
  SEARCH_HISTORY: 'dev-console-search-history',
  THEME: 'dev-console-theme'
};

// Modify logs ref to load from localStorage
const logs = ref((() => {
  try {
    const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    return savedLogs ? JSON.parse(savedLogs) : [];
  } catch (e) {
    console.error('Failed to load logs from localStorage:', e);
    return [];
  }
})());

// Add watcher to persist logs
watch(logs, (newLogs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
  } catch (e) {
    console.error('Failed to save logs to localStorage:', e);
  }
}, { deep: true });

// Modify searchHistory to load from localStorage
const searchHistory = ref((() => {
  try {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (e) {
    console.error('Failed to load search history from localStorage:', e);
    return [];
  }
})());

// Add watcher to persist search history
watch(searchHistory, (newHistory) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed to save search history to localStorage:', e);
  }
});

// Create debounced search function
const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim()) {
    saveSearchToHistory(searchQuery.value);
  }
}, 300);

// Update handleSearch to use debounced function
const handleSearch = () => {
  debouncedSearch();
};

// Implement logging functionality directly in the component
const maxLogSize = computed(() => mergedProps.value?.maxLogHistory || 100);
let isLogging = false;
let browserConsoleEnabled = true;
let isConsoleIntercepted = false;
let originalConsole = null;

// Add new reactive references for search history and tags
const selectedTags = ref([]);
const customTags = ref(new Set());
const MAX_SEARCH_HISTORY = 10;

// Add function to save search to history
const saveSearchToHistory = (query) => {
  if (!query.trim() || searchHistory.value.includes(query)) return;
  searchHistory.value.unshift(query);
  if (searchHistory.value.length > MAX_SEARCH_HISTORY) {
    searchHistory.value.pop();
  }
};

// Add function to apply search from history
const applyHistorySearch = (query) => {
  searchQuery.value = query;
};

// Modify createLog to include tags
const createLog = (type, args, tags = []) => {
  try {
    if (isLogging) return;
    isLogging = true;

    if (browserConsoleEnabled && originalConsole) {
      originalConsole[type](...args);
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

    // Add any new tags to our set of known tags
    tags.forEach(tag => customTags.value.add(tag));

    logs.value.push({
      type,
      content: sanitizedArgs,
      timestamp: Date.now(),
      tags: tags,
    });

    if (logs.value.length > maxLogSize.value) {
      logs.value = logs.value.slice(-maxLogSize.value);
    }
  } catch {
    if (!isLogging && originalConsole) {
      originalConsole.error("Failed to create log:");
    }
  } finally {
    isLogging = false;
  }
};

// Add new log methods with tag support
const logWithTags = (tags, ...args) => createLog("log", args, tags);
const errorWithTags = (tags, ...args) => createLog("error", args, tags);
const warnWithTags = (tags, ...args) => createLog("warn", args, tags);
const infoWithTags = (tags, ...args) => createLog("info", args, tags);

// Add computed for filtered logs
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    // Type filter
    if (!selectedTypes.value.includes(log.type)) return false;
    
    // Tag filter
    if (selectedTags.value.length > 0 && (!log.tags || !selectedTags.value.some(tag => log.tags.includes(tag)))) {
      return false;
    }
    
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const content = log.content.map(item => 
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      ).join(' ').toLowerCase();
      
      return content.includes(query);
    }
    
    return true;
  });
});

// Add function to toggle tag selection
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// Add function to clear tag selection
const clearTagSelection = () => {
  selectedTags.value = [];
};

// Log methods
const _log = (...args) => createLog("log", args);
const _error = (...args) => createLog("error", args);
const _warn = (...args) => createLog("warn", args);
const _info = (...args) => createLog("info", args);
const clear = () => {
  logs.value = [];
  // Ensure console interception is still active after clearing
  if (!isConsoleIntercepted) {
    interceptConsole();
  }
};

// Add new methods for log groups and file saving
const createLogGroup = (label, collapsed = false) => {
  const groupId = Date.now().toString();
  logs.value.push({
    type: "group",
    content: [label],
    timestamp: Date.now(),
    groupId,
    collapsed,
    isGroup: true
  });
  return groupId;
};

const endLogGroup = () => {
  logs.value.push({
    type: "groupEnd",
    content: [],
    timestamp: Date.now(),
    isGroup: true
  });
};

const toggleLogGroup = (groupId) => {
  const group = logs.value.find(log => log.groupId === groupId);
  if (group) {
    group.collapsed = !group.collapsed;
  }
};

const saveLogsToFile = (format = 'txt') => {
  try {
    let content;
    let mimeType;
    let extension;

    switch (format) {
      case 'json':
        content = JSON.stringify(logs.value, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = logs.value.map(log => {
          const timestamp = new Date(log.timestamp).toISOString();
          const content = log.content.map(item => 
            typeof item === 'object' ? JSON.stringify(item) : String(item)
          ).join(' ');
          return `${timestamp},${log.type},${content}`;
        }).join('\n');
        content = `Timestamp,Type,Content\n${content}`;
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      default: // txt
        content = logs.value.map(log => {
          const timestamp = new Date(log.timestamp).toISOString();
          const content = log.content.map(item => 
            typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
          ).join(' ');
          return `[${timestamp}] [${log.type.toUpperCase()}] ${content}`;
        }).join('\n');
        mimeType = 'text/plain';
        extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-console-logs-${new Date().toISOString().slice(0, 10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    snackbarText.value = "Logs saved successfully";
    snackbar.value = true;
  } catch (error) {
    console.error("Failed to save logs:", error);
    snackbarText.value = "Failed to save logs";
    snackbar.value = true;
  }
};

// Extend console interception to include groups
const interceptConsole = () => {
  if (isConsoleIntercepted) {
    if (console.log !== originalConsole?.log || !originalConsole) {
      restoreConsole();
    } else {
      return;
    }
  }

  originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
    group: console.group.bind(console),
    groupCollapsed: console.groupCollapsed.bind(console),
    groupEnd: console.groupEnd.bind(console)
  };

  console.log = (...args) => {
    createLog("log", args);
    if (originalConsole?.log) {
      originalConsole.log(...args);
    }
  };

  console.error = (...args) => {
    createLog("error", args);
    if (originalConsole?.error) {
      originalConsole.error(...args);
    }
  };

  console.warn = (...args) => {
    createLog("warn", args);
    if (originalConsole?.warn) {
      originalConsole.warn(...args);
    }
  };

  console.info = (...args) => {
    createLog("info", args);
    if (originalConsole?.info) {
      originalConsole.info(...args);
    }
  };

  console.group = (label) => {
    createLogGroup(label, false);
    if (originalConsole?.group) {
      originalConsole.group(label);
    }
  };

  console.groupCollapsed = (label) => {
    createLogGroup(label, true);
    if (originalConsole?.groupCollapsed) {
      originalConsole.groupCollapsed(label);
    }
  };

  console.groupEnd = () => {
    endLogGroup();
    if (originalConsole?.groupEnd) {
      originalConsole.groupEnd();
    }
  };

  isConsoleIntercepted = true;
};

const restoreConsole = () => {
  if (!isConsoleIntercepted || !originalConsole) return;

  // Restore original methods one by one to ensure we don't lose any
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;

  originalConsole = null;
  isConsoleIntercepted = false;
};

const isVisible = ref(false);
const isDev = process.env.NODE_ENV === "development" || config?.allowProduction;
const searchQuery = ref("");
const selectedTypes = ref(["log", "error", "warn", "info"]);
const snackbar = ref(false);
const snackbarText = ref("");

// Add state for expansion panels
const expandedPanels = ref([]);
const allExpanded = ref(false);

const toggleAllPanels = () => {
  if (allExpanded.value) {
    expandedPanels.value = [];
  } else {
    expandedPanels.value = filteredLogs.value.map((_, index) => index);
  }
  allExpanded.value = !allExpanded.value;
};

// Add a watcher to ensure console interception when visibility changes
watch(isVisible, (newValue) => {
  if (newValue && !isConsoleIntercepted) {
    interceptConsole();
  }
});

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

const getLogPreview = (log) => {
  return log.content.map(item => {
    if (typeof item === 'object') {
      if (item === null) return 'null';
      if (Array.isArray(item)) return `Array(${item.length})`;
      return `Object{${Object.keys(item).slice(0, 3).join(', ')}}`;
    }
    return String(item);
  }).join(' ').slice(0, 60) + (log.content.join(' ').length > 60 ? '...' : '');
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
      <v-card :height="Number(mergedProps?.height || 600)" elevation="2">
        <!-- Toolbar -->
        <v-toolbar
          :color="currentTheme === 'dark' ? 'grey-darken-3' : 'primary'"
          density="comfortable"
          flat
        >
          <v-toolbar-title>Development Console</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn 
              :icon="allExpanded ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal'"
              @click="toggleAllPanels"
              :title="allExpanded ? 'Collapse All' : 'Expand All'"
            ></v-btn>
            
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-content-save" v-bind="props"></v-btn>
              </template>
              <v-list :theme="currentTheme" density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-file-document-outline"
                  title="Save as TXT"
                  @click="saveLogsToFile('txt')"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-code-json"
                  title="Save as JSON"
                  @click="saveLogsToFile('json')"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-file-delimited-outline"
                  title="Save as CSV"
                  @click="saveLogsToFile('csv')"
                ></v-list-item>
              </v-list>
            </v-menu>

            <v-btn 
              :icon="currentTheme === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
              @click="toggleTheme"
            ></v-btn>
            <v-btn icon="mdi-delete" @click="clearLogs"></v-btn>
            <v-btn icon="mdi-close" @click="toggleVisibility"></v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <!-- Main Content -->
        <v-main class="overflow-hidden">
          <v-container fluid class="pa-2">
            <!-- Search and Filters Row -->
            <v-row dense>
              <v-col cols="12" sm="6" lg="6" class="pr-sm-2">
                <v-text-field
                  v-model="searchQuery"
                  density="compact"
                  placeholder="Search logs..."
                  prepend-icon="mdi-magnify"
                  hide-details
                  variant="outlined"
                  :bg-color="currentTheme === 'dark' ? 'grey-darken-4' : 'grey-lighten-4'"
                  :theme="currentTheme"
                  @keyup.enter="handleSearch"
                  class="mb-2 mb-sm-0"
                >
                  <template v-slot:append>
                    <v-menu v-if="searchHistory.length > 0" location="bottom end">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon="mdi-history"
                          variant="text"
                          density="compact"
                          v-bind="props"
                        ></v-btn>
                      </template>
                      <v-list :theme="currentTheme" density="compact" nav>
                        <v-list-item
                          v-for="(query, index) in searchHistory"
                          :key="index"
                          :title="query"
                          @click="applyHistorySearch(query)"
                        ></v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" lg="6">
                <v-chip-group v-model="selectedTypes" multiple show-arrows class="flex-wrap">
                  <v-chip
                    filter
                    variant="elevated"
                    value="log"
                    :color="currentTheme === 'dark' ? 'grey' : 'grey-darken-1'"
                    :text-color="currentTheme === 'dark' ? 'white' : 'black'"
                    size="small"
                  >
                    Log
                  </v-chip>
                  <v-chip filter value="error" color="error" size="small">Error</v-chip>
                  <v-chip filter value="warn" color="warning" size="small">Warn</v-chip>
                  <v-chip filter value="info" color="info" size="small">Info</v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <!-- Tags Row -->
            <v-row v-if="customTags.size > 0" dense class="mt-1">
              <v-col cols="12">
                <div class="d-flex align-center">
                  <span class="text-caption text-medium-emphasis mr-2">Tags:</span>
                  <v-chip-group v-model="selectedTags" multiple show-arrows class="flex-grow-1">
                    <v-chip
                      v-for="tag in Array.from(customTags)"
                      :key="tag"
                      filter
                      variant="elevated"
                      :value="tag"
                      :color="currentTheme === 'dark' ? 'primary' : 'primary-lighten-1'"
                      size="x-small"
                    >
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                  <v-btn
                    v-if="selectedTags.length > 0"
                    icon="mdi-close"
                    variant="text"
                    density="compact"
                    size="x-small"
                    @click="clearTagSelection"
                  ></v-btn>
                </div>
              </v-col>
            </v-row>

            <!-- Logs Container -->
            <v-row dense class="mt-2">
              <v-col cols="12">
                <v-card
                  :color="currentTheme === 'dark' ? 'grey-darken-4' : 'grey-lighten-4'"
                  :theme="currentTheme"
                  class="log-container"
                  flat
                  variant="tonal"
                >
                  <v-card-text class="pa-1">
                    <template v-if="logs.length === 0">
                      <v-sheet class="d-flex align-center justify-center" :height="200">
                        <span class="text-medium-emphasis">
                          No logs yet. Start logging with console.log, console.error, etc.
                        </span>
                      </v-sheet>
                    </template>

                    <template v-else>
                      <v-virtual-scroll
                        :items="filteredLogs"
                        :height="Number(mergedProps?.height || 600) - 200"
                        :item-height="56"
                        class="px-2"
                      >
                        <template v-slot:default="{ item: log, index }">
                          <v-expansion-panels 
                            v-model="expandedPanels"
                            class="mb-1" 
                            multiple
                            variant="accordion"
                          >
                            <v-expansion-panel
                              :value="index"
                              :class="{
                                'log-error': log.type === 'error',
                                'log-warn': log.type === 'warn',
                                'log-info': log.type === 'info',
                                'log-group': log.isGroup,
                                'ml-4': log.type !== 'group' && log.type !== 'groupEnd'
                              }"
                            >
                              <v-expansion-panel-title class="py-1 px-3">
                                <v-row no-gutters align="center" class="flex-nowrap w-100">
                                  <v-col cols="auto" class="mr-2 flex-shrink-0">
                                    <div
                                      class="log-type text-caption font-weight-bold"
                                      :style="{ color: getLogColor(log.type) }"
                                    >
                                      {{ log.type.toUpperCase() }}
                                    </div>
                                  </v-col>
                                  
                                  <v-col cols="auto" class="mr-2 flex-shrink-0" v-if="mergedProps?.filters?.showTimestamp">
                                    <div class="log-timestamp text-caption text-medium-emphasis">
                                      {{ new Date(log.timestamp).toLocaleTimeString() }}
                                    </div>
                                  </v-col>

                                  <v-col class="min-width-0 flex-grow-1">
                                    <div class="d-flex align-center overflow-hidden">
                                      <span class="text-truncate log-preview">
                                        {{ getLogPreview(log) }}
                                      </span>
                                    </div>
                                  </v-col>

                                  <v-col cols="auto" class="d-flex align-center ml-2 flex-shrink-0">
                                    <div v-if="log.tags && log.tags.length > 0" class="mr-2">
                                      <v-chip
                                        v-for="tag in log.tags"
                                        :key="tag"
                                        size="x-small"
                                        variant="flat"
                                        class="mr-1"
                                        :color="currentTheme === 'dark' ? 'primary' : 'primary-lighten-1'"
                                      >
                                        {{ tag }}
                                      </v-chip>
                                    </div>
                                    <v-btn
                                      icon="mdi-content-copy"
                                      size="x-small"
                                      variant="text"
                                      @click.stop="copyToClipboard(log)"
                                    ></v-btn>
                                  </v-col>
                                </v-row>
                              </v-expansion-panel-title>
                              <v-expansion-panel-text class="px-3">
                                <div v-for="(content, i) in log.content" :key="i">
                                  <pre v-if="typeof content === 'object'" class="mb-2 pa-2 rounded bg-grey-darken-4">{{ JSON.stringify(content, null, 2) }}</pre>
                                  <div v-else class="mb-2">{{ content }}</div>
                                </div>
                              </v-expansion-panel-text>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </template>
                      </v-virtual-scroll>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-card>
    </v-dialog>

    <v-snackbar 
      v-model="snackbar" 
      :timeout="2000" 
      location="bottom" 
      variant="tonal"
      color="primary"
    >
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
  padding: 8px;
  height: 100%;
}

.log-entry {
  border-left: 3px solid;
  transition: background-color 0.2s ease;
}

.log-entry:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.log-error {
  border-left-color: red !important;
  background-color: rgba(255, 0, 0, 0.05);
}

.log-warn {
  border-left-color: orange !important;
  background-color: rgba(255, 165, 0, 0.05);
}

.log-info {
  border-left-color: blue !important;
  background-color: rgba(0, 0, 255, 0.05);
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-size: 0.875rem;
}

.v-virtual-scroll {
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.5) transparent;
}

.v-virtual-scroll::-webkit-scrollbar {
  width: 8px;
}

.v-virtual-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.v-virtual-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.5);
  border-radius: 4px;
}

.log-group {
  border-left: 3px solid #666 !important;
  background-color: rgba(128, 128, 128, 0.05);
}

.ml-4 {
  margin-left: 1rem;
}

.log-preview {
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.2;
  max-width: 50vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-row {
  margin: 0;
}

.v-col {
  padding: 0;
}

.v-expansion-panels {
  margin-bottom: 4px !important;
  box-shadow: none;
  width: 100%;
}

.v-expansion-panel {
  margin-bottom: 4px !important;
  width: 100%;
}

.v-expansion-panel-title {
  min-height: 40px !important;
  width: 100% !important;
}

.v-expansion-panel-title__content {
  width: 100% !important;
  overflow: hidden !important;
}

.log-preview {
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.2;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-shrink-0 {
  flex-shrink: 0 !important;
}

.flex-grow-1 {
  flex-grow: 1 !important;
}

.overflow-hidden {
  overflow: hidden !important;
}

.v-expansion-panel-text__wrapper {
  padding: 8px 0 !important;
}

.flex-nowrap {
  flex-wrap: nowrap !important;
}

.min-width-0 {
  min-width: 0 !important;
}

.log-preview-container {
  max-width: 60%;
  overflow: hidden;
}
</style>

