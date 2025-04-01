<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import useDevLog from "../composables/useDevLog";

const { logs } = useDevLog();
const isVisible = ref(false);
const isDev = import.meta.dev;
const searchQuery = ref("");
const selectedTypes = ref(["log", "error", "warn", "info"]);
const snackbar = ref(false);
const snackbarText = ref("");

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

const logTypes = [
  { type: "log", icon: "mdi-console", color: "secondary" },
  { type: "error", icon: "mdi-alert-circle", color: "error" },
  { type: "warn", icon: "mdi-alert", color: "warning" },
  { type: "info", icon: "mdi-information", color: "info" },
];

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const matchesType = selectedTypes.value.includes(log.type);
    const matchesSearch = searchQuery.value
      ? log.content
          .map((item) =>
            typeof item === "object" ? JSON.stringify(item) : String(item)
          )
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      : true;
    return matchesType && matchesSearch;
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

  console.log = (...args) => {
    originalConsole.log(...args);
  };

  console.error = (...args) => {
    originalConsole.error(...args);
  };

  console.warn = (...args) => {
    originalConsole.warn(...args);
  };

  console.info = (...args) => {
    originalConsole.info(...args);
  };
};

const restoreConsole = () => {
  Object.assign(console, originalConsole);
};

const clearLogs = () => {
  logs.value = [];
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

onMounted(() => {
  interceptConsole();
});

onUnmounted(() => {
  restoreConsole();
});
</script>

<template>
  <div v-if="isDev">
    <v-btn
      icon
      position="fixed"
      location="bottom right"
      class="ma-4"
      @click="toggleVisibility"
    >
      <v-icon>mdi-console</v-icon>
      <v-badge
        :content="logs.length"
        :model-value="logs.length > 0"
        color="error"
        :location="logs.length > 0 ? 'bottom right' : 'bottom left'"
      />
    </v-btn>

    <v-dialog v-model="isVisible" width="800" scrollable>
      <v-card height="800">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title>Development Console</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-delete" @click="clearLogs" />
          <v-btn icon="mdi-close" @click="isVisible = false" />
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
                :color="type.color"
                variant="text"
              >
                <v-icon :icon="type.icon" />
                <v-tooltip activator="parent" location="bottom">
                  {{ type.type.toUpperCase() }}
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
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
                <pre class="my-0 text-body-2">{{
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
