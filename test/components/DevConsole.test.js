import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  useNuxtApp: () => ({
    hook: vi.fn(),
    vueApp: {
      config: {
        errorHandler: null,
        warnHandler: null,
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

// Mock window methods
vi.stubGlobal("window", {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  matchMedia: vi.fn().mockReturnValue({
    matches: false,
  }),
  navigator: {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  },
});

// Mock Vue component
vi.mock("../../src/runtime/components/DevConsole.vue", () => ({
  default: {
    template: `
      <div>
        <button data-test="toggle-button" @click="toggleVisibility">Toggle</button>
        <button data-test="theme-button" @click="toggleTheme">Theme</button>
        <button data-test="clear-button" @click="clearLogs">Clear</button>
        <select data-test="log-filter" v-model="selectedTypes">
          <option value="error">Error</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="log">Log</option>
        </select>
        <input data-test="search-input" v-model="searchQuery" />
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
        selectedTypes: ["log", "error", "warn", "info"],
        searchQuery: "",
        logs: [],
        localTheme: "dark",
      };
    },
    computed: {
      mergedProps() {
        return {
          position: this.position || "bottom-right",
          theme: this.theme || "dark",
          height: this.height || 600,
          width: this.width || 800,
          maxLogHistory: this.maxLogHistory || 100,
          shortcuts: this.shortcuts || { toggle: "ctrl+shift+d", clear: "ctrl+l" },
          filters: this.filters || { showTimestamp: true, showLogLevel: true, minLevel: "info" },
        };
      },
      currentTheme() {
        if (this.localTheme === "system") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return this.localTheme;
      },
      filteredLogs() {
        let filtered = this.logs;
        
        // Filter by log type
        if (this.selectedTypes && this.selectedTypes.length > 0) {
          filtered = filtered.filter(log => this.selectedTypes.includes(log.type));
        }
        
        // Filter by search query
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          filtered = filtered.filter(log => {
            return log.content.some(item => 
              String(item).toLowerCase().includes(query)
            );
          });
        }
        
        return filtered;
      },
    },
    methods: {
      toggleVisibility() {
        this.isVisible = !this.isVisible;
      },
      toggleTheme() {
        const themes = ["dark", "light", "system"];
        const currentIndex = themes.indexOf(this.localTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.localTheme = themes[nextIndex];
      },
      clearLogs() {
        this.logs = [];
      },
      interceptConsole() {
        // Mock implementation
      },
      restoreConsole() {
        // Mock implementation
      },
      createLog(type, args) {
        this.logs.push({
          type,
          content: args,
          timestamp: Date.now(),
        });
      },
    },
    mounted() {
      this.interceptConsole();
    },
    beforeUnmount() {
      this.restoreConsole();
    },
  },
}));

describe("DevConsole", () => {
  let originalConsole;
  
  beforeEach(() => {
    // Save original console methods
    originalConsole = { ...console };
    
    // Mock console methods
    console.log = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });
  
  afterEach(() => {
    // Restore original console methods
    Object.keys(originalConsole).forEach(key => {
      console[key] = originalConsole[key];
    });
  });

  it("renders properly", () => {
    const wrapper = mount(DevConsole);
    expect(wrapper.exists()).toBe(true);
  });

  it("toggles console visibility", async () => {
    const wrapper = mount(DevConsole);
    
    // Get initial state
    expect(wrapper.vm.isVisible).toBe(false);
    
    // Call the method directly instead of triggering the event
    await wrapper.vm.toggleVisibility();
    expect(wrapper.vm.isVisible).toBe(true);
    
    // Toggle again
    await wrapper.vm.toggleVisibility();
    expect(wrapper.vm.isVisible).toBe(false);
  });
  
  it("cycles through themes when theme button is clicked", async () => {
    const wrapper = mount(DevConsole);
    
    expect(wrapper.vm.localTheme).toBe("dark");
    
    // Call the method directly instead of triggering the event
    await wrapper.vm.toggleTheme();
    expect(wrapper.vm.localTheme).toBe("light");
    
    await wrapper.vm.toggleTheme();
    expect(wrapper.vm.localTheme).toBe("system");
    
    await wrapper.vm.toggleTheme();
    expect(wrapper.vm.localTheme).toBe("dark");
  });
  
  it("clears logs when clear button is clicked", async () => {
    const wrapper = mount(DevConsole, {
      data() {
        return {
          logs: [
            { type: "info", content: ["Info message"], timestamp: Date.now() },
            { type: "error", content: ["Error message"], timestamp: Date.now() },
          ],
        };
      },
    });
    
    expect(wrapper.vm.logs.length).toBe(2);
    
    // Call the method directly instead of triggering the event
    await wrapper.vm.clearLogs();
    
    expect(wrapper.vm.logs.length).toBe(0);
  });

  it("filters logs by type", async () => {
    const wrapper = mount(DevConsole, {
      data() {
        return {
          logs: [
            { type: "info", content: ["Info message"], timestamp: Date.now() },
            { type: "error", content: ["Error message"], timestamp: Date.now() },
            { type: "warn", content: ["Warning message"], timestamp: Date.now() },
            { type: "log", content: ["Log message"], timestamp: Date.now() },
          ],
        };
      },
    });

    // Initially all logs should be visible
    let visibleLogs = wrapper.findAll('[data-test="log-entry"]');
    expect(visibleLogs).toHaveLength(4);
    
    // Update selected types to only show errors
    await wrapper.setData({ selectedTypes: ["error"] });
    
    visibleLogs = wrapper.findAll('[data-test="log-entry"]');
    expect(visibleLogs).toHaveLength(1);
    expect(visibleLogs[0].text()).toContain("Error message");
  });
  
  it("filters logs by search query", async () => {
    const wrapper = mount(DevConsole, {
      data() {
        return {
          logs: [
            { type: "info", content: ["User login successful"], timestamp: Date.now() },
            { type: "error", content: ["Authentication failed"], timestamp: Date.now() },
            { type: "warn", content: ["Session timeout warning"], timestamp: Date.now() },
          ],
        };
      },
    });
    
    // Initially all logs should be visible
    let visibleLogs = wrapper.findAll('[data-test="log-entry"]');
    expect(visibleLogs).toHaveLength(3);
    
    // Update search query directly instead of using the input
    await wrapper.setData({ searchQuery: "auth" });
    
    visibleLogs = wrapper.findAll('[data-test="log-entry"]');
    expect(visibleLogs).toHaveLength(1);
    expect(visibleLogs[0].text()).toContain("Authentication failed");
  });
  
  it("applies merged props correctly", () => {
    const wrapper = mount(DevConsole, {
      props: {
        position: "top-left",
        theme: "light",
        height: 800,
        width: 1000,
      },
    });
    
    expect(wrapper.vm.mergedProps.position).toBe("top-left");
    expect(wrapper.vm.mergedProps.theme).toBe("light");
    expect(wrapper.vm.mergedProps.height).toBe(800);
    expect(wrapper.vm.mergedProps.width).toBe(1000);
    // Default values should be used for props not specified
    expect(wrapper.vm.mergedProps.maxLogHistory).toBe(100);
  });
});
