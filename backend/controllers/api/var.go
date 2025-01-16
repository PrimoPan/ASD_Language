package api

// 输入信息参数
type InputFormData struct {
	Uid      string `json:"uid"`
	Realname string `json:"name"`
	Age      string `json:"age"`
	Gender   string `json:"gender"`
	City     string `json:"city"`
	Work     string `json:"work"`
}

// 输入参数
type UserInputData struct {
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

type InputStoryData struct {
	Uid          string `json:"uid"`
	StoryTopic   string `json:"topic"`
	StoryContent string `json:"content"`
	StoryPics    string `json:"pics"`
}

// 用户对话线程数据库
var userThreadBase = make(map[string]string)

var LifeStoryAssistID = "***" // gpt-4o

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

var picGenPromptPre = "生成图片，描述下列场景："
