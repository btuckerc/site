# Adding/Modifying Projects

## Quick Start

To add a new project, simply copy this template and add it to `data/projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "year": "2024",
  "date": "2024-03-15",
  "featured": 10,
  "blurb": "One-sentence description of the project",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "links": {
    "github": "https://github.com/username/repo",
    "demo": "https://example.com"
  },
  "overview": "Detailed description of what the project does and why it was built.",
  "stack": ["Technology1", "Technology2", "Technology3"],
  "features": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ]
}
```

## Field Descriptions

### Required Fields

- **`id`** (string): Unique identifier for the project. Use lowercase with hyphens (e.g., "my-awesome-project")
- **`title`** (string): Display name of the project
- **`year`** (string): Year the project was completed/published (displayed on the card)
- **`blurb`** (string): Short one-sentence description shown in collapsed view
- **`tags`** (array): Technology tags (first 3 shown by default, rest shown as "+N")

### Optional Fields

All fields below are optional. If omitted, that section won't appear in the expanded view.

- **`date`** (string): Full completion date in ISO format (YYYY-MM-DD, e.g., "2024-03-15"). Used for precise sorting. If omitted, sorting will use the year field with December 31 assumed for recent sort, January 1 for oldest sort.

- **`featured`** (number): Priority for "featured" sort (higher = appears first). Range: 1-10. Projects without this field appear after featured ones, sorted by date/year.

- **`links`** (object): Links to project resources
  - Common keys: `github`, `demo`, `live`, `docs`, `npm`
  - You can use any key name - it will be displayed as-is with a → arrow
  
- **`overview`** (string): Detailed project description shown when expanded

- **`stack`** (array): Technical stack/technologies used (shown as comma-separated list)

- **`features`** (array): Key features or highlights (shown as bulleted list with · prefix)

## Examples

### Minimal Project (just required fields)
```json
{
  "id": "simple-todo-app",
  "title": "Simple Todo App",
  "year": "2024",
  "blurb": "A minimalist todo list application",
  "tags": ["React", "TypeScript"]
}
```

### Full Project (all fields)
```json
{
  "id": "weather-dashboard",
  "title": "Weather Dashboard",
  "year": "2024",
  "date": "2024-07-22",
  "featured": 9,
  "blurb": "Real-time weather tracking with forecast predictions",
  "tags": ["React", "Node.js", "OpenWeather API", "Chart.js"],
  "links": {
    "github": "https://github.com/username/weather-dashboard",
    "demo": "https://weather.example.com",
    "docs": "https://docs.example.com"
  },
  "overview": "Built a comprehensive weather dashboard that aggregates data from multiple APIs to provide accurate forecasts with interactive visualizations.",
  "stack": ["React 18", "Node.js", "Express", "OpenWeather API", "Chart.js", "Tailwind CSS"],
  "features": [
    "7-day forecast with hourly breakdowns",
    "Interactive weather maps",
    "Historical data analysis",
    "Location-based alerts",
    "Export data to CSV"
  ]
}
```

## Tips

1. **Tags**: Keep tags concise. First 3 are always visible, rest show as "+N"
2. **Blurb**: Keep it to one sentence - this is the "hook"
3. **Features**: Be specific about what makes your project unique
4. **Links**: Use any key name you want - it displays exactly as written
5. **Order**: Projects display in the order they appear in the JSON file (top to bottom)

## Modifying Existing Projects

Simply edit the project object in `data/projects.json`. Changes will appear immediately after refresh.

## Removing Projects

Delete the project object from the array in `data/projects.json`. Make sure to:
1. Remove the entire `{...}` object
2. Remove the comma after the previous project if it's the last one
3. Keep valid JSON formatting
