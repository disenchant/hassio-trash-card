# How to Create a New Release

This project uses GitHub Actions (`.github/workflows/release.yaml`) to automate the release process. When a new version tag (e.g., `2.4.8`) is pushed to the repository, the workflow automatically builds the project, attaches the compiled `trashcard.js` file, and creates a **draft** release on GitHub.

Follow these steps to create a new release:

## 1. Update the Version
First, update the version number in your `package.json` and `package-lock.json` files.

You can do this manually or by using npm:
```bash
# This updates package.json and package-lock.json without automatically creating a git commit/tag
npm version patch --no-git-tag-version 
# Use "minor" or "major" instead of "patch" for larger updates
```

## 2. Update the Changelog (Optional)
If you maintain the `CHANGELOG.md` manually, add a new entry for the version you are about to release, detailing the new features, bug fixes, and breaking changes.

## 3. Commit the Changes
Commit the version bump and any changelog updates to your repository.
```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to 2.4.8"
git push origin main
```

## 4. Create and Push a Tag
The GitHub Action is triggered by pushing a tag in the format `*.*.*` (e.g., `2.4.8`). Create the tag and push it to GitHub.

```bash
git tag 2.4.8
git push origin 2.4.8
```

## 5. Review and Publish the Release
1. Once the tag is pushed, go to the **Actions** tab in your GitHub repository. You will see the `Release` workflow running.
2. Wait for the workflow to complete successfully.
3. Navigate to the **Releases** section on the right side of your GitHub repository's main page.
4. You will see a new **Draft** release created by the workflow. It will have auto-generated release notes based on your pull requests/commits, and the `dist/trashcard.js` file will be attached as an asset.
5. Click **Edit** (the pencil icon) on the draft release.
6. Review the release notes. You can modify them to be more descriptive if needed.
7. Click **Publish release**.

That's it! HACS users will now see the new version available for update in their Home Assistant instances.