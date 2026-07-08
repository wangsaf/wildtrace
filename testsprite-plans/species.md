# Test Plan: Species Gallery

## Overview
Test the species gallery page with filtering and search.

## Test Cases

### TC-005: Species Gallery Load
- Navigate to https://wildtrace.spectriad.com/species
- Verify the page loads with title "Species Directory"
- Verify species cards are displayed

### TC-006: Habitat Filter
- Click "Forest" filter button
- Verify only forest species are displayed (Sumatran Tiger, Orangutan, Borneo Pygmy Elephant)
- Click "Ocean" filter button
- Verify only ocean species are displayed (Blue Whale, Hawksbill Turtle, Vaquita)
- Click "All" to reset filter

### TC-007: Search Functionality
- Type "tiger" in the search box
- Verify "Sumatran Tiger" is displayed
- Clear search
- Type "whale" in the search box
- Verify "Blue Whale" is displayed

### TC-008: Species Detail Navigation
- Click on any species card
- Verify navigation to species detail page (/species/[id])
- Verify species name, scientific name, and description are displayed
