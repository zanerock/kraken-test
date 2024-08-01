# This file was generated by @liquid-labs/sdlc-projects-workflow-local-node-build.
# Refer to https://npmjs.com/package/@liquid-labs/sdlc-projects-workflow-local-
# node-build for further details

#####
# build dist/site-outage-reporter-exec.js
#####

SDLC_SITE_OUTAGE_REPORTER_EXEC_JS:=$(DIST)/site-outage-reporter-exec.js
SDLC_SITE_OUTAGE_REPORTER_EXEC_JS_ENTRY=$(SRC)/cli/index.mjs
BUILD_TARGETS+=$(SDLC_SITE_OUTAGE_REPORTER_EXEC_JS)

$(SDLC_SITE_OUTAGE_REPORTER_EXEC_JS): package.json $(SDLC_ALL_NON_TEST_JS_FILES_SRC)
	JS_BUILD_TARGET=$(SDLC_SITE_OUTAGE_REPORTER_EXEC_JS_ENTRY) \
	  JS_OUT=$@ \
	  JS_OUT_PREAMBLE='#!/usr/bin/env -S node --enable-source-maps' \
	  $(SDLC_ROLLUP) --config $(SDLC_ROLLUP_CONFIG)
	chmod a+x $@

#####
# end dist/site-outage-reporter-exec.js
#####
