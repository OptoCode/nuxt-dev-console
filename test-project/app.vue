<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 mb-4">Nuxt Dev Console Test</h1>
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <dev-console />
  </v-app>
</template>

<script setup>
import { useDevLog } from "#imports";

const { log, error, warn, info } = useDevLog();

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
</script>

<style>
.v-application {
  background-color: #f5f5f5;
}
</style>
