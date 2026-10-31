# Central Limit Theorem & Sampling Distributions Explorer

An interactive educational web app that **demonstrates the Central Limit Theorem (CLT)** and shows how the most important sampling distributions in statistics (standard normal, chi-squared, Student's t, F) can be built from simulated random data.

Instead of just plotting a formula, the app *generates* the data: it draws random numbers, takes repeated samples, builds the statistic in question, and plots the empirical histogram next to the theoretical density curve, so you can watch the empirical result converge to the theory.

> **Note:** the UI and the explanatory text are written in **Hungarian**.

## Features

- **Five interactive pages**, one per topic:
  - Central Limit Theorem
  - Standard normal distribution
  - Chi-squared distribution
  - Student's t-distribution
  - F-distribution
- **Empirical vs. theoretical comparison**: a histogram of simulated values with the theoretical probability density curve overlaid.
- **Adjustable parameters** via sliders and inputs: number of samples (1,000 – 100,000), sample size (2 – 20), degrees of freedom (1 – 30), class interval (bin) width, and the interval of the generated values.
- **Built-in theory**: each page explains the key concepts (i.i.d. sampling, random variables, density and distribution functions, expected value, standard error, ...) with KaTeX-rendered formulas and hands-on "Tip" boxes.
- **Dependency-free math**: density functions and the log-gamma function are implemented in the app itself (no stats library).

## How it works

### Central Limit Theorem page
1. Generates **1,000,000 uniformly distributed** random numbers in a user-defined interval.
2. Draws `sampleCount` random samples of size `n` (with replacement) and computes each sample's mean.
3. Counts how many sample means fall into each class interval (bin).
4. Overlays the theoretical normal density with mean `(from + to) / 2` and standard deviation equal to the **standard error** `SE = σ / √n`.

### Standard normal page
Same sampling procedure, but the sample means are **standardized**: `(mean − mean of the sample means) / SE`, and the result is compared with N(0, 1).

### Derived distributions
All of them are built from the standardized sample means `Z`, which are approximately standard normal thanks to the CLT:

| Distribution | Construction in the app |
|---|---|
| Chi-squared (k) | `χ² = Σ Zᵢ²` over `k` independent standardized samples |
| Student's t (k) | `T = Z / √(U / k)` with `U ~ χ²(k)` |
| F (k₁, k₂) | `F = (U₁ / k₁) / (U₂ / k₂)` with independent chi-squared `U₁`, `U₂` |

The theoretical densities (chi-squared, t, F, normal) are computed in log-space, using a **Lanczos approximation** of the log-gamma function for numerical stability. The histogram's curve is scaled by `sampleCount × binWidth` so it is directly comparable to the bar frequencies.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (with the **React Compiler** enabled via Babel)
- **React Router** for page routing
- **Recharts** for the histogram + curve chart
- **KaTeX** (`react-katex`) for math rendering
- **Bootstrap 5** + **Bootstrap Icons** for layout and styling
- **ESLint** with typescript-eslint and React Hooks rules

## Routes

| Path | Page |
|---|---|
| `/` | Redirects to the Central Limit Theorem page |
| `/distribution/central-limit-theorem` | Central Limit Theorem |
| `/distribution/normal-distribution` | Standard normal distribution |
| `/distribution/chi-squared` | Chi-squared distribution |
| `/distribution/student` | Student's t-distribution |
| `/distribution/f-distribution` | F-distribution |

## Project structure

```
src/
├── main.tsx                      # Entry point, global CSS imports
├── App.tsx                       # Router setup
├── app/
│   ├── hooks/useDistribution.tsx # Hook for the shared distribution context
│   └── shared/
│       ├── types.tsx             # Shared types (HistogramData, DistributionContext, ...)
│       └── utils.tsx             # Random generation, sampling, distributions, PDFs, binning
├── assets/styles/style.css       # Custom styles
└── components/
    ├── charts/HistogramChart.tsx # Recharts bar + line composed chart
    ├── distributions/            # One component per page (CLT, Normal, ChiSquared, Student, F)
    ├── forms/                    # DistributionForm (shared controls), SecureNumberInput
    ├── layouts/                  # MainLayout, Navigation
    └── pages/Distributions.tsx   # Page container + shared state (React Context)
```

### Architecture notes
- `Distribution` (in `pages/Distributions.tsx`) owns all simulation parameters and the histogram data in a single React Context. Each distribution component reads and updates them through the `useDistribution()` hook.
- Every distribution component follows the same pattern: a `generate()` function creates the samples, converts them into histogram bins with `getHistogramData()` and stores them in the context; `HistogramChart` renders them.
- `SecureNumberInput` validates numeric input on blur and falls back to a default value if the input is empty or out of range.
- For the Student and F pages, values outside `[-10, 10]` are hidden to keep the chart readable.

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check and build for production
npm run build

# preview the production build
npm run preview

# lint
npm run lint
```

## Known limitations

- All simulation runs **synchronously on the main thread**, so large settings (e.g. high degrees of freedom with many samples) can briefly freeze the UI. Moving the computation to a Web Worker would fix this.
- Each `generate()` call creates fresh random data, so results differ slightly between runs (this is intentional).
- Only integer degrees of freedom are supported.