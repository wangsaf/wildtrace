# Test Plan: Dashboard

## Overview
Test the conservation dashboard with stats and recent activity.

## Test Cases

### TC-013: Dashboard Load
- Navigate to https://wildtrace.spectriad.com/dashboard
- Verify the page loads with title "Conservation Dashboard"
- Verify three stat cards are displayed: Species Tracked, Total Sightings, Active Reporters

### TC-014: Stats Display
- Verify the stat numbers are animated (counting up)
- Verify the numbers match the database data

### TC-015: Recent Activity
- Scroll to "Recent Activity" section
- Verify recent sightings are displayed
- Verify each sighting shows species name, location, reporter, and date
