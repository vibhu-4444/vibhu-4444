# Profile README setup

This is the profile repository for `vibhu-4444`. Keep the README, SVG assets, and workflow paths in their current locations.

## Contribution graphics

Both workflows run on a schedule and can be started manually from the repository's **Actions** tab.

- **Contribution snake:** generates two SVGs with `Platane/snk/svg-only@v3` and publishes them to the `output` branch. The README loads those SVGs from that branch.
- **3D contribution calendar:** generates SVGs in `profile-3d-contrib/` and commits changed files to the default branch. The README loads `profile-green-animate.svg` from that directory.

The workflows request `contents: write` to publish their generated files. In GitHub, open **Settings > Actions > General > Workflow permissions** and enable **Read and write permissions** if repository policy does not already allow the workflows. No personal access token is needed for these workflows.

After the first successful workflow run, confirm the generated graphics exist on their referenced branches and paths. GitHub Actions may need to be enabled for the repository.

## Contact links

No email, LinkedIn, Codeforces, or LeetCode URL is configured because those details were not provided. Add verified links to the README if desired.
