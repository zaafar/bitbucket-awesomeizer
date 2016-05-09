# Bitbucket Awesomizer

Bitbucket Awesomizer makes your Bitbucket experience awesome;

- Hide pull request comments with "Resolved." mentioned anywhere in the thread
- Adds a "toggle" button to show or hide visibility the comment thread
- Adds a "resolve" button to mark a thread as resolved (by adding a comment "Resolved.")

Install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/bitbucket-awesomizer/fpcpncnhbbmlmhgicafejpabkdjenloi).

## Requirements

- [Chrome web browser](https://www.google.com/chrome/browser/desktop/)

## Contributing

  1. Submit a pull request
  1. Tag @ohwo as a reviewer

## Development

Only 2x files are injected into the user's web browser; `inject.js` and `inject.css`.

Install (for development);

  1. In Chrome; Window menu > Extensions
  1. Check "Developer mode"
  1. Click "Load unpacked extension"
  1. Select your clone of this repository

## Deployment

Currently only the author (`obodley@gmail.com`) can update the existing app.

  1. Compress the repository into a zip file.
  2. Go to https://chrome.google.com/webstore/developer/dashboard
  3. Upload the zip file
