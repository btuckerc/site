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
  "source": "GitHub public + local",
  "activity": "active",
  "visibility": "public",
  "verified": "Checked from GitHub metadata and the local README on YYYY-MM-DD.",
  "blurb": "One plain sentence about what this is",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "links": {
    "github": "https://github.com/username/repo",
    "demo": "https://example.com"
  },
  "overview": "Name the thing, say why it exists, and give one concrete detail.",
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

- **`source`** (string): Where this project was verified from, such as "GitHub public", "local", or "macmini local".

- **`activity`** (string): Current state, such as "active", "prototype", "planning", "stable", or "legacy".

- **`visibility`** (string): Public-facing visibility: "public", "local", or "external upstream". Do not expose private repository names here.

- **`verified`** (string): Short factual note explaining what was checked and when. Keep it safe for a public site: no secrets, private paths, credentials, or sensitive infrastructure details.

- **`links`** (object): Links to project resources
  - Common keys: `github`, `demo`, `live`, `docs`, `npm`
  - You can use any key name - it will be displayed as-is with a → arrow
  
- **`overview`** (string): Expanded project description. Keep it concrete and human-readable.

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
  "overview": "Weather Dashboard pulls forecast data into one place so I can compare the next week without jumping between apps.",
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

## Voice

Write the thing. Do not decorate it.

- **Blurb:** one sentence. Name the project and what it does. If a literal phrase exists, use it. No metaphor, no "the point is", no "feels like".
- **Overview:** what it is, why it exists, one concrete detail (a URL, a runtime, a rename, a number).
- **Features:** verbs and nouns. "Live seat maps from partner inventory" not "a window into availability".

Mannered prose is a metaphor standing in for a fact. Cut it.

## How to source

Edit `data/projects.json` directly. The UI reads that file. Do not put copy in components.

1. `gh repo list btuckerc --limit 40 --json name,description,url,pushedAt,homepageUrl,isPrivate`
2. For a public repo: `gh api repos/btuckerc/<name>` and the README. `homepageUrl` becomes `links.live`.
3. For local/macmini work: a README, a launchd unit, or a running process. Write what you checked in `verified` with a date.
4. Set `date` / `dateModified` from the push or check date, not memory.
5. Keep Servarr/media stack out. Private repo names stay out of `visibility` and `links`.

## Tips

1. **Tags**: Keep tags concise. First 3 are always visible, rest show as "+N"
2. **Links**: Use any key name you want. It displays exactly as written.
3. **Verification**: GitHub push date, local README, or a runtime check. Not memory.

## Modifying Existing Projects

Simply edit the project object in `data/projects.json`. Changes will appear immediately after refresh.

## Removing Projects

Delete the project object from the array in `data/projects.json`. Make sure to:
1. Remove the entire `{...}` object
2. Remove the comma after the previous project if it's the last one
3. Keep valid JSON formatting
