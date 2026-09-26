# Public project record

Add only an authored, independently reviewed public project. Verify its destination while logged out. Keep a short purpose, accurate status and prerequisites, and public links. A live HTTP response alone does not establish a working demo.

```json
{
  "id": "public-project",
  "title": "Public project",
  "blurb": "One sentence describing what it does.",
  "overview": "Purpose and any setup prerequisite.",
  "tags": ["Web Apps"],
  "stack": ["JavaScript"],
  "features": ["A reviewed capability"],
  "links": {"github": "https://github.com/btuckerc/public-project"},
  "source": "GitHub public",
  "visibility": "public"
}
```

Use the current records for the component schema. Omit unavailable demo, code and image links. State when source is upstream or work is historical. Do not include raw verification notes, internal/local inventory, private repository names, local paths, operational endpoints, credentials, device/save identifiers, inferred activity metrics or unapproved professional claims. Keep private source separately, outside every public build input. Validate both the rendered interface and downloaded output.

Optional `media` shows a looping muted preview at the top of the expanded card. Convert GIFs to H.264 MP4 plus a PNG poster under `public/media/<project-id>/`:

```json
"media": {
  "video": "/media/public-project/demo.mp4",
  "poster": "/media/public-project/demo-poster.png",
  "width": 640,
  "height": 360,
  "title": "preview",
  "alt": "What the clip shows, for screen readers.",
  "caption": "One short line under the clip."
}
```
