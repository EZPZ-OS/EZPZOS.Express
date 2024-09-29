# BE

### Git Repository

Make sure the following Git Repository is cloned:

1. EZPZOS.Core is on the same level of this project
   ./EZPZOS.Express
   ./EZPZOS.Core
2. You need to run "npm run build" against EZPZOS.Core project  

## Getting Started

### Installing all the packges

Run:

```bash
npm i
```

### Database (Docker)

1. Install Docker
2. In VS Code terminal or terminal, use bash
3. `cd ./docker`
4. `chmod +x ./db_start.sh`
4. `./db_start.sh`
6. Wait for sometime until you see:
   <img src="./git readme img/Docker/Mac DB/Mac-Up.png"/>

7. Open Docker Window by double clicking on the icon in the task dock (for mac it's on the top right)

8. You can see your containers in the list
   <img src="./git readme img/Docker/Mac DB/Mac-Container.png"/>

Click on the triangle to expand and click on the `ezpzos-database-1` to go into the container

9. Search for log entries (and also for `Initialisation Complete`) shown in the screenshot
   <img src="./git readme img/Docker/Mac DB/Logs.png"/>
   Make sure there's no expceptions in between otherthan `Login failed` (this is docker health check)

### Database Queries

1. **MAC** click on `Exec` from the top bar:
    <img src="./git readme img/Docker/Mac DB/Exec.png"/>
    or for windows click on `CLI` to run cmd:
    <img src="./git readme img/Docker/Mac DB/CLI.png"/>
    for windows, you can skip this as windows has Visualised tool for database (<a href="#SSMS">SSMS</a>)

2. Run following cmd:

```bash
bash
PATH=$PATH:/opt/mssql-tools/bin/
sqlcmd -U sa -P EZPZOSAdmin!

```

<img src="./git readme img/Docker/Mac DB/Exec cmd.png"/>

3. You can now run queries in this window or if you wish you can use your own cli tools in Mac terminal. Just remember the port is `1433` for the docker database container.
    **Note: For anyone running sqlcmd, you will need to put a `go` like what shown in the last step for the query to run.**

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

### Dynamic Export
You will find in the `index.ts` file in project `EZPZOS.Core`, some of the exports are marked as Express Only. For those dynamic exports, you need to follow what's written in the `example/example.ts`.

To explain, these modules are exported dynamically during runtime.
Thus the exported module would be a `Promised import` object. You would need to either use chain function `then` to get the module or use `await` key word.

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
