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
### Installing all the packges
Run:
```Powershell
npm i
```
### Database Setup
1. Install <a href="https://www.microsoft.com/en-au/sql-server/sql-server-downloads"> SQL Server </a>
<img src="./git readme img/SQL Server Download.png"/>
Once the intaller is download, run the installer.
Choose `Basic(基本)` from the three options.
Choose a install path and click on Install.

2. Intall <a href="https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16"> SQL Server management Studio </a>
<img src="./git readme img/SSMS Download.png"/>
Download and install.

### Initiate Database
1. Run SSMS.
Click on connect button shown from the below screenshot:
<img src="./git readme img/SSMS/SSMS 1.png"/>

2. On the popup window, make sure the server name is either `.` or `localhost`
Make sure the Authentication is set to Windows Authentication.
Click on `Connect`
<img src="./git readme img/SSMS/SSMS 2.png"/>

3. If succeed, you will see connection from the left `Object Explorer`
Click on `New Query` butto nfrom the below screenshot:
<img src="./git readme img/SSMS/SSMS 3.png"/>

4. On the `query screen`, you can either `drag and drop` the `.sql` file from `./database/SQL_SERVER_CREATE.sql` to the query screen or `copy and paste` content from the file to the `query screen`
<img src="./git readme img/SSMS/SSMS 4.png"/>

5. Click on the `Execute` button from the top or just simply press `F5` to run query.
<img src="./git readme img/SSMS/SSMS 5.png"/>

6. You should be able to see the following message upon succeed:
<img src="./git readme img/SSMS/SSMS 6.png"/>

7. You should be able to see the created database in the `Object Explorer`. (You might need to hit `Refersh` button to see)
<img src="./git readme img/SSMS/SSMS 8.png"/>
<img src="./git readme img/SSMS/SSMS 7.png"/>

8. From this point on, you can Run any query agasint Database `EZPZOS`.
Just make sure when you are on the `query screen`, the selected database is `EZPZOS`:
<img src="./git readme img/SSMS/SSMS 9.png"/>

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

## Code Standards
### Rules
#### [Naming Convention](#naming-convention)
All variables or classnames except for packages or system defined cases should use Camel Case naming convention and should not contain spaces or underscore between words.
E.g.
CamelCaseWord

Invalid examples:
1. camelCaseWord
2. Camelcaseword
3. camel_case_word
4. ccw

Abbreviations should be avoided as much as possible. If abbreviations can't be avoided, consult admin is required before Pull Request.

#### Formatting Code
A `.prettierrc` file has been loaded to the project to make sure everyone will result in the same formatting. Thus, `Prettier` extensino is required to be installed. No one should use their own formatting settings.

#### File structure
TBD


### Pull-Request Rejection Reason Table
<table border=1> 
<tr>
<th>Reason</th>
<th>Description</th>
<th>Mark Deduction</th>
</tr>
<tr>
<td>Missing Comments</td>
<td>Commit code without comments. 
<ol>
<li>Comments are required for all functions created. </li>
<li>Comments are required for logic related codes such as if statements. </li>
<li>Comments are optional for properties and attributes if they are predefined in ERD or Class Diagram. </li>
<li>Comments are optional for local variables. </li>
</ol>
</td>
<td>TBD</td>
</tr>
<tr>
<td>Naming Convention</td>
<td>Violates one of the above <a href="#naming-convention">Naming Convention</a></td>
<td>TBD</td>
</tr>
<tr>
<td>Syntax Error</td>
<td>Has obvious syntax error either can be detected by the code editor, code complier or developers</td>
<td>TBD</td>
</tr>
<tr>
<td>Runtime Error</td>
<td>App crashes whilst running the feature. This excludes when your code breaks other feature that is not in the unit testing. This applies only when your feature is broken due to some cases.</td>
<td>TBD</td>
</tr>
<tr>
<td>Redundant codes / Testing codes</td>
<td>Leaving console.log() in the commit. Or commented codes. Or complicated logic that can be simplified.</td>
<td>TBD</td>
</tr>
<tr>
<td>Unit testing</td>
<td>0 unit testing. Or lack of unit testing cases. Or bad unit testing cases.</td>
<td>TBD</td>
</tr>
</table>