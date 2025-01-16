// 存储数据库操作的相关model
package models

type UserInfo struct {
	Uid         string `json:"uid" gorm:"primaryKey"`
	Name        string `json:"name"`
	Age         int    `json:"age"`
	Gender      int    `json:"gender"`
	Period      int    `json:"period"`
	Qhwshiwu    string `json:"qhw-shiwu"`
	Qhwfood     string `json:"qhw-food"`
	Qhwactivity string `json:"qhw-activity"`
	Qhwsense    string `json:"qhw-sense"`
	Qhwsocial   string `json:"qhw-social"`
	Grade       string `json:"grade"`
}
