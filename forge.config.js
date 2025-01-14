module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        noMsi: false,
        noDelta: false,
        fixUpPaths: true
      }
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      platforms: ['darwin', 'linux', 'win32'],
      config: {
        draft: false,
        repository: {
          owner: 'Kabuswe',
          name: 'hazel-update-server-demo'
        },
      }
    }
  ]
};
