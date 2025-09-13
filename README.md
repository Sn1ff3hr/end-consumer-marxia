# Modern Order App

This project provides a simple order application that can be installed as a Progressive Web App (PWA). The interface lets you browse a small catalog, add or remove items from an order and view the totals in real time.

## Running locally

The app relies on a Service Worker, which requires that it is served over HTTPS or from `localhost`. You can use any static file server. Two common options are:

```bash
python3 -m http.server 8000
# or using Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000/index.html` in your browser. When first loaded, the Service Worker caches core assets so the interface will continue to work even if your connection drops.

## Offline support

The Service Worker defined in `sw.js` caches the HTML, CSS, JavaScript and placeholder images. On later visits, these assets are served from the cache. If navigation fails because you are offline, `offline.html` is displayed as a fallback, allowing users to retry when connectivity returns.

## Security headers

`index.html` includes several meta tags that act as security headers:

- **Content-Security-Policy** – restricts scripts, styles and images to the same origin, with placeholders allowed for images.
- **X-Content-Type-Options** – prevents MIME type sniffing.
- **X-Frame-Options** – denies framing to mitigate clickjacking.
- **Referrer-Policy** – set to `strict-origin-when-cross-origin` to limit referrer information.

These headers help reduce common web vulnerabilities when the app is deployed.

## Setup considerations

- Ensure your server uses HTTPS in production so the Service Worker can run and to protect data in transit.
- Review `manifest.json` to customise icons, name and theme colours for your brand.
- Modify the list in `sw.js` if you add new files that should be cached for offline use.
- If you plan to store large binaries such as images or media, install [Git LFS](https://git-lfs.github.com/) before cloning or pushing so these files are tracked efficiently.

## Managing large files

If you plan to store large assets such as images or videos in this repository,
install [Git LFS](https://git-lfs.github.com/) before cloning or pushing. Git
LFS stores binary data efficiently and prevents large files from bloating the
repository. After installing, run `git lfs install` once, then commit files
matching the patterns defined in `.gitattributes`.


## License

This project is licensed under the [MIT License](LICENSE).
