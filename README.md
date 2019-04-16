# File-tracker

A file tracking electron app to keep track of your files and check if any files were tampered with. The app can help you track the last modified date, the last access date and such. This app was created with the help of Electron.js. Electron.js is a node module that is used to make cross platform GUI applications with the help of HTML and CSS.

# Quick start to development

Make sure you have [Node.js](https://nodejs.org) installed, then type the following in a command line...

```
git clone https://github.com/nthungdev/file-tracker.git
cd file-tracker
npm install
npm run postinstall
npm start
```

...and you have a running desktop application on your screen.

# How to basics in file-tracker

> This is intended to provide knowledge on how to properly use file-tracker.

After clicking on the Let's get started button. A different screen will appear.
In this screen, there is are five buttons and one table:

#### Buttons

1. `Select Directory` - which lets you choose the folder and it's contents to track.
2. `List Primary Files only` - which lists the primary files and directories in the selected directory.
3. `List Sub-Directories as well` - which lists the primary as well as the sub-directories of those files, if they exist.
4. `Save Snapshot` - which saves the data from the selected directory for future detection purposes.
5. `View Snapshots` - which redirects you to a page where you can compare the last snapshot with the current snapshot.

#### Table

- `File Data Box` - A box where you can monitor quickly the metadata of the files in the selected directory. The box gets its contents after List Primary Files is pressed or after List Sub Directories is pressed.

### Snapshot Screen

There are 3 main elements in the Snapshot screen.

1. `file path` - This will hold the filepath if selected before coming to this screen.
2. `Last Saved Snapshot` - This will hold the data from the last saved snapshot, if any.
3. `Current metadata` - This field will hold the metadata of the files in the directory specified by the filepath.

# Structure of the project

The application consists of two main folders...

`scripts` - files within this folder handle functionality related to the original purpose of file-tracker. (For eg. File MetaData Fetching, Database Management, Adding items to the DOM)

`src` - files within this folder get transpiled or compiled (because Electron can't use them directly).

`app` - contains all static assets which don't need any pre-processing. Put here images, CSSes, HTMLs, etc.

The build process compiles the content of the `src` folder and puts it into the `app` folder, so after the build has finished, your `app` folder contains the full, runnable application.

Treat `src` and `app` folders like two halves of one bigger thing.

The drawback of this design is that `app` folder contains some files which should be git-ignored and some which shouldn't (see `.gitignore` file). But this two-folders split makes development builds much, much faster.

# Development

## The build pipeline

Build process uses [Webpack](https://webpack.js.org/). The entry-points are `src/background.js` and `src/app.js`. Webpack will follow all `import` statements starting from those files and compile code of the whole dependency tree into one `.js` file for each entry point.

[Babel](http://babeljs.io/) is also utilised, but mainly for its great error messages. Electron under the hood runs latest Chromium, hence most of the new JavaScript features are already natively supported.

## Environments

Environmental variables are done in a bit different way (not via `process.env`). Env files are plain JSONs in `config` directory, and build process dynamically links one of them as an `env` module. You can import it wherever in code you need access to the environment.

```js
import env from "env";
console.log(env.name);
```

## Upgrading Electron version

To do so edit `package.json`:

```json
"devDependencies": {
  "electron": "2.0.2"
}
```

_Side note:_ [Electron authors recommend](http://electron.atom.io/docs/tutorial/electron-versioning/) to use fixed version here.

## Adding npm modules to your app

Remember to respect the split between `dependencies` and `devDependencies` in `package.json` file. Your distributable app will contain modules listed in `dependencies` after running the release script.

_Side note:_ If the module you want to use in your app is a native one (not pure JavaScript but compiled binary) you should first run `npm install name_of_npm_module` and then `npm run postinstall` to rebuild the module for Electron. You need to do this once after you're first time installing the module. Later on, the postinstall script will fire automatically with every `npm install`.

Using [electron-mocha](https://github.com/jprichardson/electron-mocha) test runner with the [Chai](http://chaijs.com/api/assert/) assertion library. You can put your spec files wherever you want within the `src` directory, just name them with the `.spec.js` extension.

Using [Mocha](https://mochajs.org/) and [Spectron](http://electron.atom.io/spectron/). This task will run all files in `e2e` directory with `.e2e.js` extension.

# Making a release

To package your app into an installer use command:

```
npm run release
```

Once the packaging process finished, the `dist` directory will contain your distributable file.

We use [electron-builder](https://github.com/electron-userland/electron-builder) to handle the packaging process. It has a lot of [customization options](https://www.electron.build/configuration/configuration), which you can declare under `"build"` key in `package.json`.

You can package your app cross-platform from a single operating system, [electron-builder kind of supports this](https://www.electron.build/multi-platform-build), but there are limitations and asterisks. That's why this boilerplate doesn't do that by default.

## Thanks to...

- Primary inspiration: https://github.com/szwacz/electron-boilerplate
