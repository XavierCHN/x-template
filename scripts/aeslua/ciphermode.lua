local aes = require("aeslua.aes");
local util = require("aeslua.util");
local buffer = require("aeslua.buffer");

local public = {};

aeslua.ciphermode = public;

--
-- Encrypt strings
-- key - byte array with key
-- string - string to encrypt
-- modefunction - function for cipher mode to use
--
function public.encryptString(key, data, modeFunction)
    local iv = iv or {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
    local keySched = aes.expandEncryptionKey(key);
    local encryptedData = buffer.new();
    
    for i = 1, #data/16 do
        local offset = (i-1)*16 + 1;
        local byteData = {string.byte(data,offset,offset +15)};
		
        modeFunction(keySched, byteData, iv);

        buffer.addString(encryptedData, string.char(table.unpack(byteData)));    
    end
    
    return buffer.toString(encryptedData);
end

--
-- the following 4 functions can be used as 
-- modefunction for encryptString
--

-- Electronic code book mode encrypt function
function public.encryptECB(keySched, byteData, iv) 
	aes.encrypt(keySched, byteData, 1, byteData, 1);
end

-- Cipher block chaining mode encrypt function
function public.encryptCBC(keySched, byteData, iv) 
    util.xorIV(byteData, iv);

    aes.encrypt(keySched, byteData, 1, byteData, 1);    
        
    for j = 1,16 do
        iv[j] = byteData[j];
    end
end

-- Output feedback mode encrypt function
function public.encryptOFB(keySched, byteData, iv) 
    aes.encrypt(keySched, iv, 1, iv, 1);
    util.xorIV(byteData, iv);
end

-- Cipher feedback mode encrypt function
function public.encryptCFB(keySched, byteData, iv) 
    aes.encrypt(keySched, iv, 1, iv, 1);    
    util.xorIV(byteData, iv);
       
    for j = 1,16 do
        iv[j] = byteData[j];
    end        
end

--
-- Decrypt strings
-- key - byte array with key
-- string - string to decrypt
-- modefunction - function for cipher mode to use
--
function public.decryptString(key, data, modeFunction)
    local iv = iv or {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
    
    local keySched;
    if (modeFunction == public.decryptOFB or modeFunction == public.decryptCFB) then
    	keySched = aes.expandEncryptionKey(key);
   	else
   		keySched = aes.expandDecryptionKey(key);
    end
    
    local decryptedData = buffer.new();

    for i = 1, #data/16 do
        local offset = (i-1)*16 + 1;
        local byteData = {string.byte(data,offset,offset +15)};

		iv = modeFunction(keySched, byteData, iv);

        buffer.addString(decryptedData, string.char(table.unpack(byteData)));
    end

    return buffer.toString(decryptedData);    
end

--
-- the following 4 functions can be used as 
-- modefunction for decryptString
--

-- Electronic code book mode decrypt function
function public.decryptECB(keySched, byteData, iv) 

    aes.decrypt(keySched, byteData, 1, byteData, 1);
    
    return iv;
end

-- Cipher block chaining mode decrypt function
function public.decryptCBC(keySched, byteData, iv) 
	local nextIV = {};
    for j = 1,16 do
        nextIV[j] = byteData[j];
    end
        
    aes.decrypt(keySched, byteData, 1, byteData, 1);    
    util.xorIV(byteData, iv);

	return nextIV;
end

-- Output feedback mode decrypt function
function public.decryptOFB(keySched, byteData, iv) 
    aes.encrypt(keySched, iv, 1, iv, 1);
    util.xorIV(byteData, iv);
    
    return iv;
end

-- Cipher feedback mode decrypt function
function public.decryptCFB(keySched, byteData, iv) 
    local nextIV = {};
    for j = 1,16 do
        nextIV[j] = byteData[j];
    end

    aes.encrypt(keySched, iv, 1, iv, 1);
        
    util.xorIV(byteData, iv);
    
    return nextIV;
end

return public;