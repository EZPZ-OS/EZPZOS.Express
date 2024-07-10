import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	transform: {
		"^.+\\.(ts|tsx)?$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.{js,jsx}",
		"**/*.{ts,tsx}",
		"!**/node_modules/**",
		"!**/vendor/**",
		"!rollup.config.js"
	],
	

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	// collectCoverageFrom: undefined,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",
	moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
	//testEnvironment:"screeps-jest",
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)",
	],
};

export default config;
