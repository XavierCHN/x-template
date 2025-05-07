# OPENAPI自动生成服务器接口

## 用法
1. 推荐使用`ApiFox`管理并测试你开发的服务器接口
2. 使用`ApiFox`导出所有数据，在导出数据时请做如下设置
    - OpenAPI Spec版本： OpenAPI 3.0
    - 文件格式： json
    - 包含 Apifox 扩展的 OpenAPI 字段： 不包含
    - 将 API 文档的目录，作为 Tags 字段导出： 是
3. 选择导出所有接口，并将其储存为 `scripts/server_api.json`
4. 可自定义文件路径，修改package.json中 `yarn api` 指令即可
5. 运行指令 `yarn api` 来生成所有的API接口

## 服务器配置方法
- 请到 `game\scripts\src\server\core\OpenAPI.ts` 中配置服务器相关参数
- 注意里面的 `ONLINE_TEST_MODE` 字段，该字段不需要在代码中进行任何处理，此全局变量会由 `prod` 脚本生成并注入到lua全局环境，具体注入方法请[查阅代码](https://github.com/XavierCHN/x-template/blob/master/scripts/publish.ts#L91)
