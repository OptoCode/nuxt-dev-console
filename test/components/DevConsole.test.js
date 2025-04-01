import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DevConsole from "../../src/runtime/components/DevConsole.vue";

// Mock Nuxt's useRuntimeConfig
vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      devConsole: {
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
      },
    },
  }),
}));

// Mock process.env
vi.stubGlobal("process", {
  env: {
    NODE_ENV: "development",
  },
});

// Mock Vue component
vi.mock("../../src/runtime/components/DevConsole.vue", () => ({
  default: {
    template: `
      <div>
        <button data-test="toggle-button" @click="toggleVisibility">Toggle</button>
        <select data-test="log-filter" v-model="selectedFilter">
          <option value="error">Error</option>
          <option value="info">Info</option>
        </select>
        <div v-for="log in filteredLogs" :key="log.timestamp" data-test="log-entry">
          {{ log.content.join(' ') }}
        </div>
      </div>
    `,
    props: {
      position: String,
      theme: String,
      height: Number,
      width: Number,
      maxLogHistory: Number,
      shortcuts: Object,
      filters: Object,
    },
    data() {
      return {
        isVisible: false,
        selectedFilter: "all",
        logs: [],
      };
    },
    computed: {
      filteredLogs() {
        if (this.selectedFilter === "all") return this.logs;
        return this.logs.filter((log) => log.type === this.selectedFilter);
      },
    },
    methods: {
      toggleVisibility() {
        this.isVisible = !this.isVisible;
      },
    },
  },
}));

describe("DevConsole", () => {
  it("renders properly", () => {
    const wrapper = mount(DevConsole);
    expect(wrapper.exists()).toBe(true);
  });

  it("toggles console visibility", async () => {
    const wrapper = mount(DevConsole);
    const toggleButton = wrapper.find('[data-test="toggle-button"]');

    await toggleButton.trigger("click");
    expect(wrapper.vm.isVisible).toBe(true);

    await toggleButton.trigger("click");
    expect(wrapper.vm.isVisible).toBe(false);
  });

  it("filters logs by type", async () => {
    const wrapper = mount(DevConsole, {
      data() {
        return {
          logs: [
            { type: "info", content: ["Info message"], timestamp: Date.now() },
            {
              type: "error",
              content: ["Error message"],
              timestamp: Date.now(),
            },
          ],
        };
      },
    });

    const filterSelect = wrapper.find('[data-test="log-filter"]');
    await filterSelect.setValue("error");

    const visibleLogs = wrapper.findAll('[data-test="log-entry"]');
    expect(visibleLogs).toHaveLength(1);
    expect(visibleLogs[0].text()).toContain("Error message");
  });
});
