# Risk Management Dashboard

An interactive React-based dashboard for visualizing and analyzing project risks. The dashboard reads risk data from a CSV file and presents it through three interactive visualizations.

## Features

### 1. Risk Heat Map
- 5x5 grid showing risk distribution by probability and impact
- Color-coded cells (Green = Low, Yellow = Medium, Orange = High, Red = Critical)
- Hover to see risks in each cell
- Shows count of risks per cell

### 2. Risk Breakdown Chart
- Stacked horizontal bar chart showing risks by category
- Categorizes risks into Low, Medium, and High severity
- Interactive tooltips showing detailed breakdowns
- Sorted by total risk count

### 3. Interactive Bubble Chart
- Scatter plot with probability on X-axis and impact on Y-axis
- Bubble size represents risk score
- Color-coded by risk level
- Click on bubbles or ranking list items to highlight risks
- Side panel with ranked list of all risks
- Detailed tooltips on hover

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm preview
```

## Data Format

The application reads from `risks.csv` in the public directory. The CSV should have the following columns:

- `Category` - Risk category (e.g., Performance, Architecture, Technical)
- `Risk` - Description of the risk
- `Probability (1-5)` - Likelihood of occurrence (1-5 scale)
- `Impact (1-5)` - Potential impact (1-5 scale)
- `Mitigation Strategy` - How to mitigate the risk
- `Status` - Current status
- `Comments` - Additional notes

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and development server
- **Recharts** - Charting library for interactive visualizations
- **PapaParse** - CSV parsing library

## Interactive Features

- **Hover effects** - All visualizations show detailed tooltips on hover
- **Click interactions** - Bubble chart allows clicking to highlight specific risks
- **Responsive design** - Works on different screen sizes
- **Real-time updates** - Automatically processes CSV data on load
