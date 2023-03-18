# nodejs-back-template

#### Description
Nodejs-back-template is a minimalist framework that can quickly build nodejs interface services. It is compressed and packaged by webpack, encapsulates websocket, httpserve, file operation, mysql access and other methods, and has a complete interface routing system.

#### Installation

npm install

#### Instructions

1. npm run watch // can monitor file changes in real time and dynamically update dist/main.js environment to development
2. npm run serve // dist/main.js
3. npm run build // package to dist/main.js environment for production
4. npm run lint // detects and fixes eslint problems

#### Contribution

1.  Fork the repository
2.  Create Feat_xxx branch
3.  Commit your code
4.  Create Pull Request

#### Feature

1. server encapsulation
2. ws encapsulation
3. Separate entry main.js
4. The ws interface passed layer by layer can operate the ws object when invoked, and the socketList in ws is the socket object of all the users that have established connections
5. Unified route management
6. Uniform request parameter reading
7. token blocking

#### License

MIT License

Copyright (c) 2023

#### Software Architecture

Software architecture description

```md
|-- nodejs-template-back
    |-- src
    |   |-- main.js // main function
    |   |-- serve.js // service encapsulation
    |   |-- common // constants and public methods
    |   |   |-- BaseResponse.js // request returns encapsulation
    |   |   |-- CONSTANT
    |   |       |-- index.js // constants main entry, automatic import all modules
    |   |       |-- modules
    |   |           |-- RESPONSE.js // request code constants
    |   |           |-- WHITEURL.js // interface white list
    |   |-- config
    |   |   |-- config.development.js // development environment set up
    |   |   |-- config.js // public environment Settings
    |   |   |-- config.production.js // production environment Settings
    |   |   |-- index.js // main entry according to the environment into the config
    |   |-- controller
    |   |   |-- user.js
    |   |-- dao
    |   |   |-- db.js
    |   |   |-- modules
    |   |       |-- user.js
    |   |-- service
    |   |   |-- user.js
    |   |-- utils
    |   |   |-- auth.js // Permission operation
    |   |   |-- file.js // file operations
    |   |   |-- lock.js
    |   |   |-- router.js // routing class
    |   |-- webSocket
    |       |-- index.js
    |-- .eslintrc.js
    |-- webpack.config.js // webpack configuration

```
