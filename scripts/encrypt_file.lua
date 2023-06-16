package.path = package.path .. ";scripts/?.lua"
if table.unpack == nil then
    table.unpack = unpack
end

require "bit"
require "aeslua"
require "lfs"

local util = require "aeslua/util"
local source_path = arg[1]
local target_path = arg[2]
local key = arg[3]

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

print("encrypt to ", source_path, target_path)
local file = io.open(source_path)
local text = '-- ' .. string.sub(source_path, -40, -1) .. '\n' .. file:read("*all")
local cipher = aeslua.encrypt(key, text, aeslua.AES128, aeslua.CBCMODE)
local hexstring = string.tohex(cipher)
local wf = io.open(target_path, "w")
wf:write('return (GameRules.XDecrypt("' .. hexstring .. '", ...))')
file:close()
wf:flush()
wf:close()

print('[scripts/encrypt_file.lua] finished encypt file: ' .. source_path .. ' => ' .. target_path)