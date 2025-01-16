package api

import (
	models "asd/controllers/model"
	"fmt"

	"github.com/gin-gonic/gin"
)

type APIController struct {
}

func (con APIController) AddUser(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	var input UserInputData
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  "输入信息解析失败-" + err.Error(),
		})
		return
	}
	fmt.Println(input)
	tmp := models.UserInfo{
		Uid:         generateRandomString(4),
		Name:        input.Name,
		Age:         input.Age,
		Gender:      input.Gender,
		Period:      input.Period,
		Qhwshiwu:    input.Qhwshiwu,
		Qhwfood:     input.Qhwfood,
		Qhwactivity: input.Qhwactivity,
		Qhwsense:    input.Qhwsense,
		Qhwsocial:   input.Qhwsocial,
		Grade:       input.Grade,
	}
	fmt.Println(tmp)

	models.AddAUserID(tmp)
	fmt.Println("User Added:" + tmp.Name)

	c.JSON(200, gin.H{
		"code": 0,
	})
}

func (con APIController) GetAllData(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	// 查询用户信息
	userdata := models.GetUserData()
	c.JSON(200, gin.H{
		"code": 0,
		"data": userdata,
	})
}
