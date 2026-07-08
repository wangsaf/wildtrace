# Test Plan: Landing Page

## Overview
Test the WildTrace landing page with parallax effects and navigation.

## Test Cases

### TC-001: Landing Page Load
- Navigate to https://wildtrace.spectriad.com
- Verify the page loads with the title "WildTrace — Protect Wildlife. Track Everything."
- Verify the hero section displays "Protect Wildlife. Track Everything."
- Verify the navigation bar is visible with links: Species, Sightings, Dashboard, Report Sighting

### TC-002: Parallax Effect
- Scroll down on the landing page
- Verify the parallax background layers move at different speeds
- Verify the firefly particle animation is visible

### TC-003: Habitat Cards
- Scroll to "Three Habitats. One Mission." section
- Verify three habitat cards are displayed: Forest, Ocean, Arctic
- Hover over each card and verify the hover animation (scale up)

### TC-004: Navigation Links
- Click "Species" in the navigation bar
- Verify navigation to /species page
- Navigate back to home
- Click "Report a Sighting" button
- Verify navigation to /sightings/new page
