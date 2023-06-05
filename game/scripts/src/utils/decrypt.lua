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
local key = GetDedicatedServerKeyV3('version') -- 密钥，这个密钥需自行获取并填写到package.json

GameRules.XDecrypt = function(code, ...)
    local text = string.fromhex(code)
    local plain = aeslua.decrypt(key, text, aeslua.AES128, aeslua.CBCMODE)
    return loadstring(plain)(...)
end