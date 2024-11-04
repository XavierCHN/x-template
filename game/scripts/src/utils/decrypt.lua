-- 目前这个解密模块只在服务器端运行
if not IsServer() then return end

function string.fromhex(str)
    return (str:gsub(
        "..",
        function(cc)
            return string.char(tonumber(cc, 16))
        end
    ))
end

function string.tohex(str)
    return (str:gsub(
        ".",
        function(c)
            return string.format("%02X", string.byte(c))
        end
    ))
end


-- 解码函数，这个函数根据我自己的需求，只在server中使用
-- 如果你有在client使用的需求，请自行在其他脚本中处理
-- 这个key的运行结果因为上传的图不同而变化
-- 获取后请填写到 scripts/addon.config.js
-- https://github.com/XavierCHN/x-template/blob/master/scripts/addon.config.js#L39-L40
-- 关于他的获取方式请参考此项目
-- https://github.com/XavierCHN/fetch-keys
local key = GetDedicatedServerKeyV3('version')

GameRules.XDecrypt = function(code, ...)
    local text = string.fromhex(code)
    local plain = aeslua.decrypt(key, text, aeslua.AES128, aeslua.CBCMODE)
    return loadstring(plain)(...)
end
