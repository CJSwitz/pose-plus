<div id="top"></div>

<br />
<div align="center">
  <a href="https://github.com/CJSwitz/pose-plus">
    <img src="static/main/Logo.png" alt="Logo" width="128" height="128">
  </a>
<h1 align="center">Pose Plus</h1>
<h2> <a href="https://pose.plus">Website</a> | <a href="https://github.com/CJSwitz/pose-plus/releases/latest">Latest Release</a> | <a href="https://github.com/CJSwitz/pose-plus/blob/v1.0.0/CHANGELOG.md">Changelog</a>

<br/>
<br/>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B661DQ3)

</div>

<p align="right">(<a href="#top">back to top</a>)</p>

Pose Plus is a gesture drawing app to organize and display your reference packs. Built on [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/), it offers high performance and lots of advanced features. Organize your references into collections, zoom and pan images, set up sessions with multiple times frames, and much more. You can find the latest version on our [releases]() page, or learn more about the project on our [website](https://pose.plus).

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

Below are instructions for building the project locally. See the [releases]() page for pre-built packages.

### Prerequisites

* Node.js v16.15.0 or above
* Git LFS

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/CJSwitz/pose-plus.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

### Building

This project uses [electron-forge](https://www.electronforge.io/) to build and package the app. It is also configured with [dotenv](https://github.com/motdotla/dotenv) to load environment variables from the file `.env` in the root folder.

#### Development
To build the project in development mode, set the `NODE_ENV` environment variable to `development` and run the command `npm start`. This will build the app, run electron, and serve renderer contents via a hot-reloading HTTP server. 

#### Production
To create a production build, set the `NODE_ENV` enviroment variable to `production` and run `npm package`. Generated output for your platform will be available in the folder `out/PosePlus-<PLATFORM>-<ARCH>`

For more information, including how to create installable packages, please see the [electron-forge docs](https://www.electronforge.io/).

## License

Copyright 2022 Connor Switzer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Connor Switzer - connor@pose.plus

[Twitter](https://twitter.com/@CJSwitz) - [Instagram](https://www.instagram.com/cjswitz/)

Website: https://pose.plus

Github: https://github.com/CJSwitz/pose-plus


<p align="right">(<a href="#top">back to top</a>)</p>