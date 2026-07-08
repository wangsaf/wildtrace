# Test Plan: Report Sighting Form

## Overview
Test the report sighting form submission.

## Test Cases

### TC-009: Form Load
- Navigate to https://wildtrace.spectriad.com/sightings/new
- Verify the form loads with fields: Your Name, Species, Location, Notes
- Verify the "Submit Sighting" button is visible

### TC-010: Form Validation
- Click "Submit Sighting" without filling any fields
- Verify validation errors appear (required fields)

### TC-011: Successful Submission
- Fill in "Your Name" with "Test User"
- Select "Sumatran Tiger" from Species dropdown
- Fill in "Location" with "Test Location"
- Fill in "Notes" with "Test sighting notes"
- Click "Submit Sighting"
- Verify success message appears: "Sighting Reported!"
- Verify redirect to /sightings page

### TC-012: Sighting Appears in List
- Navigate to /sightings
- Verify the newly submitted sighting appears in the list
- Verify the species name, location, and reporter are displayed
