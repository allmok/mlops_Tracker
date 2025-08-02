# MLOps Experiment Tracker

A simple frontend application for visualizing and comparing machine learning experiment logs from a CSV file. This project was completed as a test assignment for the Junior Frontend Engineer position.

## Demo

**Live Application:** [Vercel/GitHub Pages]

## Core Features

-   **CSV Upload:** Users can upload a CSV file with experiment data.
-   **Experiment List:** Displays a list of all experiments found in the file.
-   **Multi-Select:** Allows users to select multiple experiments for comparison.
-   **Dynamic Charting:** Renders line charts for each metric across all selected experiments.

## Bonus Features & Technical Highlights

This project was built with scalability and user experience in mind:

-   **Scalable File Processing:** Large CSV files are processed in chunks to prevent UI blocking, with clear progress feedback provided to the user.
-   **Performance-Optimized Charting:**
    -   **Data Sampling:** Automatically downsamples data for charts with a high density of points to ensure smooth rendering.
    -   **Data Caching:** Caches generated chart data to speed up re-renders.
-   **Enhanced User Experience:**
    -   **Clear Feedback:** Provides loading indicators, progress bars, and informative error messages.
    -   **Graceful Overload Handling:** Warns the user when too many experiments are selected for visualization to prevent a cluttered and unreadable UI.
    -   **Convenient Controls:** Includes "Select All" and "Clear All" functionality.
-   **Modern Tech Stack:** Built with Vue 3 (Composition API) and TypeScript, utilizing PrimeVue for the component library as recommended.

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone {link}
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```