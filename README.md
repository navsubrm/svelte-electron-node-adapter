# Simple SvelteKit/Electron App with Node Adapter

This app takes a basic SvelteKit app and uses the build output from the node adapter to run the site as an Electron app.

## Basic set-up

The node adapter for SvelteKit outputs to a build folder.

The index.cjs file imports the index.js starting point from the build server, then checks the server is running and loads the home page for the app.

## File modification in build output (not required, but good for logging)

In the build folder index.js file:

1.  Add to top of file: "import log from 'electron-log'"
2.  Modify server.listen() console log (~line 244) to "log.info()" vice "console.log()".

See [electron-log ReadMe](https://www.npmjs.com/package/electron-log?activeTab=readme) for details on where logs are stored and use.
