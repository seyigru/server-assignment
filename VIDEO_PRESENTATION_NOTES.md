# Video Presentation Checklist (Max 5 mins)

Use this when recording your presentation. Ensure you cover:

## 1. How the code works overall
- **Part A**: Client-side form, validation in browser, success message displayed without server persistence
- **Part B/C**: Form submits to `/api/register`; server validates, persists to `data/inventory.json`, returns success or errors
- **API routes**: `POST /api/register` (add appliance), `GET /api/inventory?eircode=X` (fetch by Eircode)

## 2. Server-side form validation
- All validation runs in `app/api/register/route.js`
- Eircode: regex for Irish format (e.g. D02 X285)
- Model: `000-000-0000`; Serial: `0000-0000-0000`
- Dates: DD/MM/YYYY format; warranty must be after purchase
- Appliance type: must be from allowed list (whitelist)
- On failure: returns `{ success: false, errors, formData }` for sticky form

## 3. XSS prevention measures
- `sanitizeForOutput()` in API: escapes `& < > " '` before sending to client
- Used on success response data and GET inventory response
- React also escapes values in JSX by default (e.g. `value={data}`)
- Whitelist for appliance type prevents option injection

## 4. Sanitization method choice
- Character-level replacement: `&`→`&amp;`, `<`→`&lt;`, etc.
- No external library to avoid penalty for unsupported packages
- Defensive: sanitize before any output that could be rendered as HTML

## 5. Sticky form behaviour (single file)
- Part B-C form lives in `app/part-b-c/page.js`
- On validation error, API returns `formData` with submitted values
- Client sets `setFormData(data.formData)` to repopulate fields
- User can correct only invalid fields; valid data stays in place
