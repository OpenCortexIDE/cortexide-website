# Cortexide's Website.
<p align="center">
<img src="app/icon.png" alt="Void Icon" width="100px">
</p>





This is the sourcecode for Cortexide's website, https://opencortexide.com.

See [cortexide](https://github.com/OpenCortexIDE/cortexide) for our main repository.

## Download links

The **Download** button goes to `/download-beta`, which fetches the latest release from GitHub (`OpenCortexIDE/cortexide-binaries`) and builds Mac/Windows/Linux links from real asset URLs.

- **If the GitHub API succeeds**: links point at the latest release’s assets (including BUILD_ID-suffixed filenames).
- **If the API fails** (e.g. rate limit, 403): the server falls back to a version from `cortexide-versions` or the hardcoded default `1.99.30023`, then tries to load that release by tag to get real asset URLs. If that also fails, it builds URLs from the version string (e.g. `CortexIDE.arm64.1.99.30023.dmg`), which can 404 if assets use different names.

**To avoid rate limits in production**, set `GITHUB_TOKEN` in your environment (e.g. a fine-grained token with read access to `OpenCortexIDE/cortexide-binaries`). Unauthenticated requests are limited to 60/hour per IP.

The primary **“Download for Mac”** button is the **Apple Silicon (arm64)** build. Intel Mac users should use the **Intel** button on the same page.

## Contributing

To make a change to our website, we highly recommend talking to us first! 
Ping Mathew in our Discord server, or just shoot us an email.
It's important that we agree about the design from the start so your hard work aligns with Void's design principles.

We are very open to improving the look and feel of our website, but keep in mind a few of our notable guiding principles:
- Given the choice, prioritize looking unpolished over looking generic
- Copy should be clear and direct - no BS or cliche writing
- Recognition of our unique logo is important, so don't simplify or change it unless you have a new/creative take



