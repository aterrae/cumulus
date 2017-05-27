# Abimis - Now you're coding with power

![Dependencies Status](https://david-dm.org/aterrae/abimis.svg)

## Requirements
To get started with Abimis you have to get some basic tools ready, these are:
- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com) (yeah, you can also use the NPM installer but Yarn is cooler 🐱)

## Getting started
First things first let's get our dependencies ready!
To do so open your command line and type:
```bash
cd your-project-path
```
Now install all your dependencies!
```bash
yarn
```
or
```bash
npm install
```
Now you can start compiling everything, to do so you have to run the command:
```bash
npm start
```
This will start the watch task that'll compile all your files and take care of your project.
When you are ready to get a distribution copy of your work just type:
```bash
npm run dist
```

## Other Commands

###### Favicons

This will start the favicons task that will generate a favicon set based on the master file you provide.
More info on that in the [Abimis docs favicons page](https://abimis.aterrae.com/docs/favicons)
```bash
npm run favicons
```

## Packages

Abimis provides some packages that you can get to change your project layout.
Some come with other tools integration (e.g. React integration is supported with the **abimis-react-boilerplate** package), others come with templates and utilities to simplify your project kickstart.
To get a package run the following command:
```bash
npm run get -- -package-name
```
The package name that you provide to the command is the same as the repo name of the package you want to get but without the `abimis` prefix. (e.g. to get the **abimis-landing** package you run `npm run get -- -landing`)

## Addendum
Abimis supports and recommends the usage of the following patterns and tools to improve consistency when developing your project, you are free to choose weather or not to use them but we think that taking your time to learn more about them can make the difference. 😉

##### [EditorConfig](http://editorconfig.org)
EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs.
Abimis uses editor config to make sure that all of its code is following the same indentation and style rules. If your editor doesn't support it natively you can download the plugin on their website. Here are the plugins for the editors we enjoy the most.

- [Atom](https://github.com/sindresorhus/atom-editorconfig#readme)
- [Sublime Text](https://github.com/sindresorhus/editorconfig-sublime#readme)
- [Notepad ++](https://github.com/editorconfig/editorconfig-notepad-plus-plus#readme)

---
Have fun with Abimis! The best front-end framework on the 🌍 and beyond 😉

Made with plenty of ❤️ by two guys from the **Aterrae** team in Rubano (Padova), Italy

Copyright © 2017 Aterrae | Digital Growth.
