import { ref, computed } from "vue";
import { useRuntimeConfig } from "#app";

export const useDevConsole = () => {
  const config = useRuntimeConfig().public.devConsole;
  const isVisible = ref(false);
  const theme = ref(config.theme || "dark");

  const currentTheme = computed(() => {
    if (theme.value === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme.value;
  });

  const toggleVisibility = () => {
    isVisible.value = !isVisible.value;
  };

  const setTheme = (newTheme) => {
    theme.value = newTheme;
  };

  const isDev =
    process.env.NODE_ENV === "development" || config.allowProduction;

  return {
    isVisible,
    theme,
    currentTheme,
    toggleVisibility,
    setTheme,
    isDev,
    config,
  };
};

export default useDevConsole;
