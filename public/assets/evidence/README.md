Place experience evidence files here.

Examples:
- activity photos
- work screenshots
- certificates
- PDF documents (shown directly in the Evidence modal)

After adding a file, register it in `src/data/experiences.js` under the related experience item's `evidence` array.

For PDF files, use `type: "pdf"`:

```js
{
  title: "Internship certificate",
  type: "pdf",
  url: "/assets/evidence/internship-certificate.pdf",
  description: "Certificate of internship completion.",
}
```
