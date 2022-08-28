
local gf = require("gf");
local util = require("util");

--
-- Implementation of AES with nearly pure lua (only bitlib is needed) 
--
-- AES with lua is slow, really slow :-)
--

local public = {};
local private = {};

aeslua.aes = public;

-- some constants
public.ROUNDS = "rounds";
public.KEY_TYPE = "type";
public.ENCRYPTION_KEY=1;
public.DECRYPTION_KEY=2;

-- aes SBOX
private.SBox = {};
private.iSBox = {};

-- aes tables
private.table0 = {};
private.table1 = {};
private.table2 = {};
private.table3 = {};

private.tableInv0 = {};
private.tableInv1 = {};
private.tableInv2 = {};
private.tableInv3 = {};

-- round constants
private.rCon = {0x01000000, 
                0x02000000, 
                0x04000000, 
                0x08000000, 
                0x10000000, 
                0x20000000, 
                0x40000000, 
                0x80000000, 
                0x1b000000, 
                0x36000000,
                0x6c000000,
                0xd8000000,
                0xab000000,
                0x4d000000,
                0x9a000000,
                0x2f000000};

--
-- affine transformation for calculating the S-Box of AES
--
function private.affinMap(byte)
    mask = 0xf8;
    result = 0;
    for i = 1,8 do
        result = bit.lshift(result,1);

        parity = util.byteParity(bit.band(byte,mask)); 
        result = result + parity

        -- simulate roll
        lastbit = bit.band(mask, 1);
        mask = bit.band(bit.rshift(mask, 1),0xff);
        if (lastbit ~= 0) then
            mask = bit.bor(mask, 0x80);
        else
            mask = bit.band(mask, 0x7f);
        end
    end

    return bit.bxor(result, 0x63);
end

--
-- calculate S-Box and inverse S-Box of AES
-- apply affine transformation to inverse in finite field 2^8 
--
function private.calcSBox() 
    for i = 0, 255 do
    if (i ~= 0) then
        inverse = gf.invert(i);
    else
        inverse = i;
    end
        mapped = private.affinMap(inverse);                 
        private.SBox[i] = mapped;
        private.iSBox[mapped] = i;
    end
end

--
-- Calculate round tables
-- round tables are used to calculate shiftRow, MixColumn and SubBytes 
-- with 4 table lookups and 4 xor operations.
--
function private.calcRoundTables()
    for x = 0,255 do
        byte = private.SBox[x];
        private.table0[x] = util.putByte(gf.mul(0x03, byte), 0)
                          + util.putByte(             byte , 1)
                          + util.putByte(             byte , 2)
                          + util.putByte(gf.mul(0x02, byte), 3);
        private.table1[x] = util.putByte(             byte , 0)
                          + util.putByte(             byte , 1)
                          + util.putByte(gf.mul(0x02, byte), 2)
                          + util.putByte(gf.mul(0x03, byte), 3);
        private.table2[x] = util.putByte(             byte , 0)
                          + util.putByte(gf.mul(0x02, byte), 1)
                          + util.putByte(gf.mul(0x03, byte), 2)
                          + util.putByte(             byte , 3);
        private.table3[x] = util.putByte(gf.mul(0x02, byte), 0)
                          + util.putByte(gf.mul(0x03, byte), 1)
                          + util.putByte(             byte , 2)
                          + util.putByte(             byte , 3);
    end
end

--
-- Calculate inverse round tables
-- does the inverse of the normal roundtables for the equivalent 
-- decryption algorithm.
--
function private.calcInvRoundTables()
    for x = 0,255 do
        byte = private.iSBox[x];
        private.tableInv0[x] = util.putByte(gf.mul(0x0b, byte), 0)
                             + util.putByte(gf.mul(0x0d, byte), 1)
                             + util.putByte(gf.mul(0x09, byte), 2)
                             + util.putByte(gf.mul(0x0e, byte), 3);
        private.tableInv1[x] = util.putByte(gf.mul(0x0d, byte), 0)
                             + util.putByte(gf.mul(0x09, byte), 1)
                             + util.putByte(gf.mul(0x0e, byte), 2)
                             + util.putByte(gf.mul(0x0b, byte), 3);
        private.tableInv2[x] = util.putByte(gf.mul(0x09, byte), 0)
                             + util.putByte(gf.mul(0x0e, byte), 1)
                             + util.putByte(gf.mul(0x0b, byte), 2)
                             + util.putByte(gf.mul(0x0d, byte), 3);
        private.tableInv3[x] = util.putByte(gf.mul(0x0e, byte), 0)
                             + util.putByte(gf.mul(0x0b, byte), 1)
                             + util.putByte(gf.mul(0x0d, byte), 2)
                             + util.putByte(gf.mul(0x09, byte), 3);
    end
end


--
-- rotate word: 0xaabbccdd gets 0xbbccddaa
-- used for key schedule
--
function private.rotWord(word)
    local tmp = bit.band(word,0xff000000);
    return (bit.lshift(word,8) + bit.rshift(tmp,24)) ;
end

--
-- replace all bytes in a word with the SBox.
-- used for key schedule
--
function private.subWord(word)
    return util.putByte(private.SBox[util.getByte(word,0)],0) 
         + util.putByte(private.SBox[util.getByte(word,1)],1) 
         + util.putByte(private.SBox[util.getByte(word,2)],2)
         + util.putByte(private.SBox[util.getByte(word,3)],3);
end

--
-- generate key schedule for aes encryption
--
-- returns table with all round keys and
-- the necessary number of rounds saved in [public.ROUNDS]
--
function public.expandEncryptionKey(key)
    local keySchedule = {};
    local keyWords = math.floor(#key / 4);
   
 
    if ((keyWords ~= 4 and keyWords ~= 6 and keyWords ~= 8) or (keyWords * 4 ~= #key)) then
        print("Invalid key size: ", keyWords);
        return nil;
    end

    keySchedule[public.ROUNDS] = keyWords + 6;
    keySchedule[public.KEY_TYPE] = public.ENCRYPTION_KEY;
 
    for i = 0,keyWords - 1 do
        keySchedule[i] = util.putByte(key[i*4+1], 3) 
                       + util.putByte(key[i*4+2], 2)
                       + util.putByte(key[i*4+3], 1)
                       + util.putByte(key[i*4+4], 0);  
    end    
   
    for i = keyWords, (keySchedule[public.ROUNDS] + 1)*4 - 1 do
        local tmp = keySchedule[i-1];

        if ( i % keyWords == 0) then
            tmp = private.rotWord(tmp);
            tmp = private.subWord(tmp);
            
            local index = math.floor(i/keyWords);
            tmp = bit.bxor(tmp,private.rCon[index]);
        elseif (keyWords > 6 and i % keyWords == 4) then
            tmp = private.subWord(tmp);
        end
        
        keySchedule[i] = bit.bxor(keySchedule[(i-keyWords)],tmp);
    end

    return keySchedule;
end

--
-- Inverse mix column
-- used for key schedule of decryption key
--
function private.invMixColumnOld(word)
    local b0 = util.getByte(word,3);
    local b1 = util.getByte(word,2);
    local b2 = util.getByte(word,1);
    local b3 = util.getByte(word,0);
     
    return util.putByte(gf.add(gf.add(gf.add(gf.mul(0x0b, b1), 
                                             gf.mul(0x0d, b2)), 
                                             gf.mul(0x09, b3)), 
                                             gf.mul(0x0e, b0)),3)
         + util.putByte(gf.add(gf.add(gf.add(gf.mul(0x0b, b2), 
                                             gf.mul(0x0d, b3)), 
                                             gf.mul(0x09, b0)), 
                                             gf.mul(0x0e, b1)),2)
         + util.putByte(gf.add(gf.add(gf.add(gf.mul(0x0b, b3), 
                                             gf.mul(0x0d, b0)), 
                                             gf.mul(0x09, b1)), 
                                             gf.mul(0x0e, b2)),1)
         + util.putByte(gf.add(gf.add(gf.add(gf.mul(0x0b, b0), 
                                             gf.mul(0x0d, b1)), 
                                             gf.mul(0x09, b2)), 
                                             gf.mul(0x0e, b3)),0);
end

-- 
-- Optimized inverse mix column
-- look at http://fp.gladman.plus.com/cryptography_technology/rijndael/aes.spec.311.pdf
-- TODO: make it work
--
function private.invMixColumn(word)
    local b0 = util.getByte(word,3);
    local b1 = util.getByte(word,2);
    local b2 = util.getByte(word,1);
    local b3 = util.getByte(word,0);
    
    local t = bit.bxor(b3,b2);
    local u = bit.bxor(b1,b0);
    local v = bit.bxor(t,u);
    v = bit.bxor(v,gf.mul(0x08,v));
    w = bit.bxor(v,gf.mul(0x04, bit.bxor(b2,b0)));
    v = bit.bxor(v,gf.mul(0x04, bit.bxor(b3,b1)));
    
    return util.putByte( bit.bxor(bit.bxor(b3,v), gf.mul(0x02, bit.bxor(b0,b3))), 0)
         + util.putByte( bit.bxor(bit.bxor(b2,w), gf.mul(0x02, t              )), 1)
         + util.putByte( bit.bxor(bit.bxor(b1,v), gf.mul(0x02, bit.bxor(b0,b3))), 2)
         + util.putByte( bit.bxor(bit.bxor(b0,w), gf.mul(0x02, u              )), 3);
end

--
-- generate key schedule for aes decryption
--
-- uses key schedule for aes encryption and transforms each
-- key by inverse mix column. 
--
function public.expandDecryptionKey(key)
    local keySchedule = public.expandEncryptionKey(key);
    if (keySchedule == nil) then
        return nil;
    end
    
    keySchedule[public.KEY_TYPE] = public.DECRYPTION_KEY;    

    for i = 4, (keySchedule[public.ROUNDS] + 1)*4 - 5 do
        keySchedule[i] = private.invMixColumnOld(keySchedule[i]);
    end
    
    return keySchedule;
end

--
-- xor round key to state
--
function private.addRoundKey(state, key, round)
    for i = 0, 3 do
        state[i] = bit.bxor(state[i], key[round*4+i]);
    end
end

--
-- do encryption round (ShiftRow, SubBytes, MixColumn together)
--
function private.doRound(origState, dstState)
    dstState[0] =  bit.bxor(bit.bxor(bit.bxor(
                private.table0[util.getByte(origState[0],3)],
                private.table1[util.getByte(origState[1],2)]),
                private.table2[util.getByte(origState[2],1)]),
                private.table3[util.getByte(origState[3],0)]);

    dstState[1] =  bit.bxor(bit.bxor(bit.bxor(
                private.table0[util.getByte(origState[1],3)],
                private.table1[util.getByte(origState[2],2)]),
                private.table2[util.getByte(origState[3],1)]),
                private.table3[util.getByte(origState[0],0)]);
    
    dstState[2] =  bit.bxor(bit.bxor(bit.bxor(
                private.table0[util.getByte(origState[2],3)],
                private.table1[util.getByte(origState[3],2)]),
                private.table2[util.getByte(origState[0],1)]),
                private.table3[util.getByte(origState[1],0)]);
    
    dstState[3] =  bit.bxor(bit.bxor(bit.bxor(
                private.table0[util.getByte(origState[3],3)],
                private.table1[util.getByte(origState[0],2)]),
                private.table2[util.getByte(origState[1],1)]),
                private.table3[util.getByte(origState[2],0)]);
end

--
-- do last encryption round (ShiftRow and SubBytes)
--
function private.doLastRound(origState, dstState)
    dstState[0] = util.putByte(private.SBox[util.getByte(origState[0],3)], 3)
                + util.putByte(private.SBox[util.getByte(origState[1],2)], 2)
                + util.putByte(private.SBox[util.getByte(origState[2],1)], 1)
                + util.putByte(private.SBox[util.getByte(origState[3],0)], 0);

    dstState[1] = util.putByte(private.SBox[util.getByte(origState[1],3)], 3)
                + util.putByte(private.SBox[util.getByte(origState[2],2)], 2)
                + util.putByte(private.SBox[util.getByte(origState[3],1)], 1)
                + util.putByte(private.SBox[util.getByte(origState[0],0)], 0);

    dstState[2] = util.putByte(private.SBox[util.getByte(origState[2],3)], 3)
                + util.putByte(private.SBox[util.getByte(origState[3],2)], 2)
                + util.putByte(private.SBox[util.getByte(origState[0],1)], 1)
                + util.putByte(private.SBox[util.getByte(origState[1],0)], 0);

    dstState[3] = util.putByte(private.SBox[util.getByte(origState[3],3)], 3)
                + util.putByte(private.SBox[util.getByte(origState[0],2)], 2)
                + util.putByte(private.SBox[util.getByte(origState[1],1)], 1)
                + util.putByte(private.SBox[util.getByte(origState[2],0)], 0);
end

--
-- do decryption round 
--
function private.doInvRound(origState, dstState)
    dstState[0] =  bit.bxor(bit.bxor(bit.bxor(
                private.tableInv0[util.getByte(origState[0],3)],
                private.tableInv1[util.getByte(origState[3],2)]),
                private.tableInv2[util.getByte(origState[2],1)]),
                private.tableInv3[util.getByte(origState[1],0)]);

    dstState[1] =  bit.bxor(bit.bxor(bit.bxor(
                private.tableInv0[util.getByte(origState[1],3)],
                private.tableInv1[util.getByte(origState[0],2)]),
                private.tableInv2[util.getByte(origState[3],1)]),
                private.tableInv3[util.getByte(origState[2],0)]);
    
    dstState[2] =  bit.bxor(bit.bxor(bit.bxor(
                private.tableInv0[util.getByte(origState[2],3)],
                private.tableInv1[util.getByte(origState[1],2)]),
                private.tableInv2[util.getByte(origState[0],1)]),
                private.tableInv3[util.getByte(origState[3],0)]);
    
    dstState[3] =  bit.bxor(bit.bxor(bit.bxor(
                private.tableInv0[util.getByte(origState[3],3)],
                private.tableInv1[util.getByte(origState[2],2)]),
                private.tableInv2[util.getByte(origState[1],1)]),
                private.tableInv3[util.getByte(origState[0],0)]);
end

--
-- do last decryption round
--
function private.doInvLastRound(origState, dstState)
    dstState[0] = util.putByte(private.iSBox[util.getByte(origState[0],3)], 3)
                + util.putByte(private.iSBox[util.getByte(origState[3],2)], 2)
                + util.putByte(private.iSBox[util.getByte(origState[2],1)], 1)
                + util.putByte(private.iSBox[util.getByte(origState[1],0)], 0);

    dstState[1] = util.putByte(private.iSBox[util.getByte(origState[1],3)], 3)
                + util.putByte(private.iSBox[util.getByte(origState[0],2)], 2)
                + util.putByte(private.iSBox[util.getByte(origState[3],1)], 1)
                + util.putByte(private.iSBox[util.getByte(origState[2],0)], 0);

    dstState[2] = util.putByte(private.iSBox[util.getByte(origState[2],3)], 3)
                + util.putByte(private.iSBox[util.getByte(origState[1],2)], 2)
                + util.putByte(private.iSBox[util.getByte(origState[0],1)], 1)
                + util.putByte(private.iSBox[util.getByte(origState[3],0)], 0);

    dstState[3] = util.putByte(private.iSBox[util.getByte(origState[3],3)], 3)
                + util.putByte(private.iSBox[util.getByte(origState[2],2)], 2)
                + util.putByte(private.iSBox[util.getByte(origState[1],1)], 1)
                + util.putByte(private.iSBox[util.getByte(origState[0],0)], 0);
end

--
-- encrypts 16 Bytes
-- key           encryption key schedule
-- input         array with input data
-- inputOffset   start index for input
-- output        array for encrypted data
-- outputOffset  start index for output
--
function public.encrypt(key, input, inputOffset, output, outputOffset) 
    --default parameters
    inputOffset = inputOffset or 1;
    output = output or {};
    outputOffset = outputOffset or 1;

    local state = {};
    local tmpState = {};
    
    if (key[public.KEY_TYPE] ~= public.ENCRYPTION_KEY) then
        print("No encryption key: ", key[public.KEY_TYPE]);
        return;
    end

    state = util.bytesToInts(input, inputOffset, 4);
    private.addRoundKey(state, key, 0);

    local round = 1;
    while (round < key[public.ROUNDS] - 1) do
        -- do a double round to save temporary assignments
        private.doRound(state, tmpState);
        private.addRoundKey(tmpState, key, round);
        round = round + 1;

        private.doRound(tmpState, state);
        private.addRoundKey(state, key, round);
        round = round + 1;
    end
    
    private.doRound(state, tmpState);
    private.addRoundKey(tmpState, key, round);
    round = round +1;

    private.doLastRound(tmpState, state);
    private.addRoundKey(state, key, round);
    
    return util.intsToBytes(state, output, outputOffset);
end

--
-- decrypt 16 bytes
-- key           decryption key schedule
-- input         array with input data
-- inputOffset   start index for input
-- output        array for decrypted data
-- outputOffset  start index for output
---
function public.decrypt(key, input, inputOffset, output, outputOffset) 
    -- default arguments
    inputOffset = inputOffset or 1;
    output = output or {};
    outputOffset = outputOffset or 1;

    local state = {};
    local tmpState = {};

    if (key[public.KEY_TYPE] ~= public.DECRYPTION_KEY) then
        print("No decryption key: ", key[public.KEY_TYPE]);
        return;
    end

    state = util.bytesToInts(input, inputOffset, 4);
    private.addRoundKey(state, key, key[public.ROUNDS]);

    local round = key[public.ROUNDS] - 1;
    while (round > 2) do
        -- do a double round to save temporary assignments
        private.doInvRound(state, tmpState);
        private.addRoundKey(tmpState, key, round);
        round = round - 1;

        private.doInvRound(tmpState, state);
        private.addRoundKey(state, key, round);
        round = round - 1;
    end
    
    private.doInvRound(state, tmpState);
    private.addRoundKey(tmpState, key, round);
    round = round - 1;

    private.doInvLastRound(tmpState, state);
    private.addRoundKey(state, key, round);
    
    return util.intsToBytes(state, output, outputOffset);
end

-- calculate all tables when loading this file
private.calcSBox();
private.calcRoundTables();
private.calcInvRoundTables();

return public;