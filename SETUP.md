# Profile README setup

This is the profile repository for `vibhu-4444`. The README uses the resume supplied on October 3, 2026 as the source for contact links, education, experience, projects, technical skills, and recognition.

## Contribution graph

`assets/contributions.svg` is generated from the public contribution data for `vibhu-4444` by `scripts/generate-contributions.mjs`. The chart uses a dark, yearly calendar layout and updates daily through `.github/workflows/contributions.yml`.

The workflow runs on pushes to `main`, on a daily schedule, and manually from the **Actions** tab. It requests `contents: write` so it can commit an updated SVG. In GitHub, open **Settings > Actions > General > Workflow permissions** and enable **Read and write permissions** if repository policy does not already allow workflow writes.

The generator fetches the user's public contribution chart data from `github-contributions.vercel.app`. It creates the SVG locally in this repository; the upstream site itself draws its chart in a browser canvas rather than providing an embeddable SVG image endpoint.
