const { promisify } = require("util")
const path = require("path")
const sudo = promisify(require("sudo-prompt").exec)
const download = require("download")
const pathExists = require("path-exists")
const tempWrite = require("temp-write")
const hasha = require("hasha")

const PROGRAM_FILES = process.env["ProgramFiles(x86)"] || process.env.ProgramFiles || "C:\\\\Program Files"
const INSTALL_PATH = path.resolve(PROGRAM_FILES, "Windows Application Driver", "WinAppDriver.exe")
const DOWNLOAD_URL = "https://github.com/microsoft/WinAppDriver/releases/download/v1.2.1/WindowsApplicationDriver_1.2.1.msi"
const INSTALLER_SHA256 = "a76a8f4e44b29bad331acf6b6c248fcc65324f502f28826ad2acd5f3c80857fe"

module.exports = (async () => {
	if (!(await pathExists(INSTALL_PATH))) {
		console.log("Installing the Windows Application Driver...")
		const installerPath = await tempWrite(await download(DOWNLOAD_URL))
		if (await hasha.fromFile(installerPath, { algorithm: "sha256" }) === INSTALLER_SHA256) {
			try {
				await sudo(`msiexec /i ${installerPath} /qn`, {
					name: "Windows Application Driver installer"
				})
			} catch (error) {
				if (error.message === "User did not grant permission.") {
					console.log("The Windows Application Driver installer was not granted permission to run.")
				} else {
					throw error
				}
			}
		}
	}
})()
