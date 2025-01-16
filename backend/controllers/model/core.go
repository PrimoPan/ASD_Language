package models

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var err error

func init() {
	println("Database connecting...")
	dsn := SysParms.SQLUser + ":" + SysParms.SQLPwd + "@tcp(" + SysParms.SQLAdd + ")/" + SysParms.DbName + "?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Database connection failed! err : %v\n", err)
	} else {
		fmt.Println("Database connected!")
	}
	// 自动迁移
	// GORM 的 AutoMigrate 方法可以自动创建或更新数据库表结构，以匹配定义的结构体。
	DB.AutoMigrate(&UserInfo{})
}

// 增加一个人
func AddAUser(user UserInfo) {
	if err := DB.Create(&user).Error; err != nil {
		// log.Fatal(err)
		fmt.Println("error" + err.Error())
	}
}

// 添加一个故事到用户故事列表中
// func UpdateStory(uid string, story Singlestory) {
// 	// 查找用户
// 	var user UserInfo
// 	DB.Where("uid = ?", uid).First(&user)

// 	var oldstorys []Singlestory
// 	if err := json.Unmarshal([]byte(user.StorysJSON), &oldstorys); err != nil {
// 		fmt.Println("error" + err.Error())
// 	}
// 	user.Storys = append(oldstorys, story)
// 	storysJSON, err := json.Marshal(user.Storys)
// 	if err != nil {
// 		fmt.Println("error" + err.Error())
// 	}
// 	user.StorysJSON = string(storysJSON)
// 	// 保存修改后的记录
// 	if err := DB.Save(&user).Error; err != nil {
// 		// log.Fatal(err)
// 		fmt.Println("error: " + err.Error())
// 	}
// }

func GetUserData() []UserInfo {
	var users []UserInfo
	DB.Find((&users))
	return users
}

// func GetUserID(username string) UserIDName {
// 	var user UserIDName
// 	DB.Where("uname = ?", username).First(&user)
// 	return user
// }

// func GetUserByID(uid string) UserIDName {
// 	var user UserIDName
// 	DB.Where("uid = ?", uid).First(&user)
// 	return user
// }

// 添加一个故事到用户故事列表中
// func UpdateUserInfoById(uid string, uinfo UserIDName) {
// 	// 查找用户
// 	var user UserIDName
// 	DB.Where("uid = ?", uid).First(&user)
// 	user.Age = uinfo.Age
// 	user.Gender = uinfo.Gender
// 	user.Realname = uinfo.Realname
// 	user.City = uinfo.City
// 	user.Work = uinfo.Work

// 	// 保存修改后的记录
// 	if err := DB.Save(&user).Error; err != nil {
// 		// log.Fatal(err)
// 		fmt.Println("error: " + err.Error())
// 	}
// }

// 增加一个人
func AddAUserID(user UserInfo) {
	if err := DB.Create(&user).Error; err != nil {
		fmt.Println("error" + err.Error())
	}
}
