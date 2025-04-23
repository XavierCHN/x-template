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
-- 获取后请填写到 scripts/addon.config.ts
-- https://github.com/XavierCHN/x-template/blob/master/scripts/addon.config.ts#L39-L40
-- 关于他的获取方式请参考此项目
-- https://github.com/XavierCHN/fetch-keys
if not IsServer() then 
    -- 如果客户端尝试解密，那么输出一个报错
    -- 当然，你这里也可以将这个方法修改为“不安全的做法”
    -- 请自行深入研究以避免暴露密钥（自己找一个“藏密钥”的方法吧~）
    GameRules.XDecrypt = function(code, ...)
        error(debug.traceback('请不要加密引用此方法的文件，因为客户端没有安全可用的密钥\n请检查报错并到addon.config.ts中将对应文件排除加密'))
    end
else
    -- 服务器端的解密方法    
    local key = GetDedicatedServerKeyV3('version')
    GameRules.XDecrypt = function(code, ...)
        local text = string.fromhex(code)
        local plain = aeslua.decrypt(key, text, aeslua.AES128, aeslua.CBCMODE)
        return loadstring(plain)(...)
    end
end
