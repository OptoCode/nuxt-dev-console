import { useNuxtApp } from "#app";
import useDevLog from "./useDevLog";

export default function useNuxtErrorHandler() {
  const nuxtApp = useNuxtApp();
  const { error: logError, warn: logWarn } = useDevLog();

  // Handle Nuxt errors
  nuxtApp.hook("app:error", (err) => {
    logError("[Nuxt Error]", err);
  });

  // Handle Nuxt warnings
  nuxtApp.hook("app:warn", (msg) => {
    logWarn("[Nuxt Warning]", msg);
  });

  // Handle Vue errors
  nuxtApp.vueApp.config.errorHandler = (err, instance, info) => {
    logError("[Vue Error]", err, info);
  };

  // Handle Vue warnings
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    logWarn("[Vue Warning]", msg, trace);
  };

  return {
    // You can expose methods if needed
  };
}
