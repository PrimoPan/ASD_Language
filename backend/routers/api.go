package routers

import (
	"asd/controllers/api"

	"github.com/gin-gonic/gin"
)

func ApiRtInit(r *gin.Engine) {
	apirouters := r.Group("/i")
	{
		// 首次进入页面获取一个随机uid
		apirouters.POST("/adduser", api.APIController{}.AddUser)
		apirouters.POST("/getusers", api.APIController{}.GetAllData)

		// apirouters.POST("/reg", api.APIController{}.Reg)

		// apirouters.POST("/update", api.APIController{}.UpdateOtherInfo)

		// GPT对话
		// apirouters.POST("/gpt", api.APIController{}.GPTQuery)
		// 开启新对话
		// apirouters.POST("/restart", api.APIController{}.RestartGPT)

		// 接收图片，保存图片到服务器本地，上传图片到阿里云，随后发出图片
		// apirouters.POST("/pic", api.APIController{}.SavePic)
		// apirouters.POST("/pic2", api.APIController{}.SavePic2)
		// 接收文字，生成图片，保存图片到服务器本地，随后上传图片到阿里云，随后发出图片
		// apirouters.POST("/picgen", api.APIController{}.GenPic)

		// 接收文字，生成图片，保存图片到服务器本地，随后上传图片到阿里云，随后发出图片
		// apirouters.POST("/addStory", api.APIController{}.AddingStory)

		// 接收文字，生成图片，保存图片到服务器本地，随后上传图片到阿里云，随后发出图片
		// apirouters.POST("/getdata", api.APIController{}.GetData)

		// 数据库操作
		// 发送某个用户全部的数据
		// apirouters.POST("/getdata", api.APIController{}.GetAllData)
	}
}
