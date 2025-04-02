import {NextFederationPlugin} from "@module-federation/nextjs-mf";

module.exports = {
  webpack(config, { isServer }) {
    config.plugins.push(
      new NextFederationPlugin(<any>({
        name: 'mahatiDesigns',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Button': './src/components/Button',
          './Table': './src/components/StyledTable',
        },
        shared: {},
      }))
    );

    return config;
  },
};
