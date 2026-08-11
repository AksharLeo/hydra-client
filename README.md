<div align="center">

[<img src="https://raw.githubusercontent.com/hydralauncher/hydra/refs/heads/main/resources/icon.png" width="144"/>](https://help.hydralauncher.gg)

  <h1 align="center">Hydra Self-Hosted Client</h1>

  <p align="center">
    <strong>This is a custom fork of the official Hydra Launcher completely rebranded as <b>Hydra Self-Hosted</b> to avoid OS-level conflicts, and modified to connect to the <a href="https://github.com/AksharLeo/hydra-selfhosted-backend">Hydra Self-Hosted Backend</a>. It allows you to run a personal Hydra instance where all cloud features (authentication, cloud saves, achievements, library sync) are fully under your control.</strong>
  </p>

![Hydra Launcher Home Page](./docs/screenshot.png)

</div>

## Features

- Add games that you own to your library
- Have a nice profile that shows what you are playing to your friends
- Save your game progress in the cloud with Hydra Cloud
- Unlock achievements
- Navigate through a rich catalogue with a powerful suggestion algorithm
- Discover new games that you haven't played before

## Using with the Self-Hosted Backend

This custom client allows you to dynamically switch between the official Hydra servers and your custom self-hosted backend without modifying any code.

1. Launch the application.
2. Navigate to **Settings** > **Integrations**.
3. Under **Server Connection**, select **Custom Server**.
4. Enter the URL of your self-hosted backend (e.g., `http://localhost:3001` or your production domain).
5. The application will log you out and seamlessly redirect your API traffic to your custom server.

### Default Environment Variables

To ensure the app can still connect to the official Hydra network (for game catalogue data, assets, or when switching back to the "Official" server setting), ensure your `.env` file contains the official Hydra URLs as fallbacks. A `.env.example` is provided with the correct official defaults.

## Build from source and contributing

Please, refer to the official Documentation pages: [docs.hydralauncher.gg](https://docs.hydralauncher.gg/getting-started)

### Local development requirements

- Node.js 22 + Yarn
- Python 3.9+ (with `pip install -r requirements.txt`)
- Rust toolchain (for `hydra-native`)

After installing dependencies, `postinstall` now builds the Rust native addon automatically (`hydra-native/hydra-native.node`).

### Building Binaries

To build the executable binaries for distribution, you must have all requirements installed and run the following commands with increased memory allocation:

- For Linux: \`NODE_OPTIONS=--max-old-space-size=8192 yarn run build:linux\`
- For Windows: \`NODE_OPTIONS=--max-old-space-size=8192 yarn run build:win\`

Packaging scripts (`yarn build:win`, `yarn build:mac`, `yarn build:linux`, `yarn build:unpack`) now run `yarn build:python-rpc` automatically.

## Contributors

<a href="https://github.com/hydralauncher/hydra/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hydralauncher/hydra" />
</a>

## License

Hydra is licensed under the [MIT License](LICENSE).
