# BE

## Pre-requisite
### Visual Studio Code extension
#### Mandatory
1. Jest by `Orta`
2. Prettier - Code formatter by `Prettier`
	<h3 style="color:Red">Warning: Any PR with format changes will be rejected. <br> Any PR without proper formatting will be rejected.</h3>
3. TypeScript Debugger by `kakumei`

#### Recommended
1. Test Explorer UI by `Holger Benl`
2. React Native Tools by `Microsoft`
3. Simple React Snippets by `Burke Holland`
4. Markdown Preview Enhanced by `Yiyi Wang`
5. #region folding for VS Code by `maptz`

### Git Repository
Make sure the following Git Repository is cloned:
1. EZPZOS.Core is on the same level of this project
	./BE
	./EZPZOS.Core

## Getting Started
1. Installing all the packges
	Run:
	```Powershell
	npm i
	```


### Running the Project
```Powershell
npm run start
```

### Debug
To run debugger you will need extenstion `TypeScript Debugger`

Find `Run & Debug` button on the vs code left panel or use key combination `Ctrl+Shift+D`.

On the new popuped panel, select `Server Debug` then click on the green triangle button to start debugging.
<img src="/git readme img/Server Debug.png">

## Code Usage
### Logging
You should never use `console.log` function for logging in your commits.
Any PR that includes `console.log` will be rejected.
You might use `console.log` during your own testing.
To **Log** properly in this project, follow the below steps:
1. Make sure `EZPZOS.Core` is included and installed
2. Usage 1 Static logging:
	i. Import `LogHandler` from `EZPZOS.Core`
	```Typescript
	import { LogHandler } from "ezpzos.core";
	```
	ii. initiate inline and log
	
	```Typescript
	new LogHandler({classname}).Log({functionName},{message},{LogLevel});
	```
	
	e.g.
	```Typescript
	new LogHandler('Main').Log('Run','This is a Test.', LogLevel.INFO);
	```

	output:
	```
	Main.Run [INFO]: This is a test.
	```
3. Usage 2 Base inherite Class:
	for any class that has inherited Base class, simply call `this.Logger.Log()`

	
	e.g.
	```Typescript
	this.Logger.Log('Run','This is a Test.', LogLevel.INFO);
	```
