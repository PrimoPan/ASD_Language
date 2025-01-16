package models

type SettingParms struct {
	DbName  string
	SQLUser string
	SQLPwd  string
	SQLAdd  string
}

// For localhost
var SysParms SettingParms = SettingParms{
	DbName:  "***",
	SQLUser: "***",
	SQLPwd:  "***",
	SQLAdd:  "***",
}
