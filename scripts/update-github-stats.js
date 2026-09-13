#!/usr/bin/env node
// The former metrics writer is intentionally retired. Keep the old entry point
// safe for existing local jobs: validate public content and never rewrite it.
import './update-about-stats.js'
