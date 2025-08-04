# MLOps Experiment Tracker

A simple frontend application for visualizing and comparing machine learning experiment logs from a CSV file.

## Demo

**Live Application:** [GitHub Pages]

## Core

-   **CSV Upload:** Users can upload a CSV file with experiment data.
-   **Experiment List:** Displays a list of all experiments found in the file.
-   **Multi-Select:** Allows users to select multiple experiments for comparison.
-   **Dynamic Charting:** Renders line charts for each metric across all selected experiments.

## Tech Stack: Built with Vue 3 and TypeScript, utilizing PrimeVue for the component library as recommended.

## How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/allmok/mlops_Tracker
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the development server:
    ```bash
    pnpm run dev
    ```