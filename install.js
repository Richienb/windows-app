const { promisify } = require("util")
const path = require("path")
const sudo = promisify(require("sudo-prompt").exec)
const download = require("download")
const pathExists = require("path-exists")
const tempWrite = require("temp-write")
const md5File = require("md5-file")

const PROGRAM_FILES = process.env["ProgramFiles(x86)"] || process.env.ProgramFiles || "C:\\\\Program Files"
const INSTALL_PATH = path.resolve(PROGRAM_FILES, "Windows Application Driver", "WinAppDriver.exe")
const DOWNLOAD_URL = "https://github.com/Microsoft/WinAppDriver/releases/download/v1.2-RC/WindowsApplicationDriver.msi"
const INSTALLER_MD5 = "dbaa9a3f7416c2b73cc5cd0e7452c8d0"

module.exports = (async () => {
	if (!(await pathExists(INSTALL_PATH))) {
		console.log("Installing the Windows Application Driver...")
		const installerPath = await tempWrite(await download(DOWNLOAD_URL))
		if (await md5File(installerPath) === INSTALLER_MD5) {
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
