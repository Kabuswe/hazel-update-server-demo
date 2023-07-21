module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    /*{
      name: '@electron-forge/maker-wix',
      config: {
        languageCode: 1033,
        manufacturer: 'A-Electron',
        shortcutFolderName: 'Angular Electron'
      },
    },*/
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        noMsi: false,
        noDelta: false,
        fixUpPaths: true
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
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
