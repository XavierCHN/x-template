TIMERS_VERSION = "1.08"

--[[
	1.06 modified by Celireor (now uses binary heap priority queue instead of iteration to determine timer of shortest duration)
	DO NOT MODIFY A REALTIME TIMER TO USE GAMETIME OR VICE VERSA MIDWAY WITHOUT FIRST REMOVING AND RE-ADDING THE TIMER
	-- A timer running every second that starts immediately on the next frame, respects pauses
	Timers:CreateTimer(function()
			print ("Hello. I'm running immediately and then every second thereafter.")
			return 1.0
		end
	)
	-- The same timer as above with a shorthand call
	Timers(function()
		print ("Hello. I'm running immediately and then every second thereafter.")
		return 1.0
	end)
	-- A timer which calls a function with a table context
	Timers:CreateTimer(GameMode.someFunction, GameMode)
	-- A timer running every second that starts 5 seconds in the future, respects pauses
	Timers:CreateTimer(5, function()
			print ("Hello. I'm running 5 seconds after you called me and then every second thereafter.")
			return 1.0
		end
	)
	-- 10 second delayed, run once using gametime (respect pauses)
	Timers:CreateTimer({
		endTime = 10, -- when this timer should first execute, you can omit this if you want it to run first on the next frame
		callback = function()
			print ("Hello. I'm running 10 seconds after when I was started.")
		end
	})
	-- 10 second delayed, run once regardless of pauses
	Timers:CreateTimer({
		useGameTime = false,
		endTime = 10, -- when this timer should first execute, you can omit this if you want it to run first on the next frame
		callback = function()
			print ("Hello. I'm running 10 seconds after I was started even if someone paused the game.")
		end
	})
	-- A timer running every second that starts after 2 minutes regardless of pauses
	Timers:CreateTimer("uniqueTimerString3", {
		useGameTime = false,
		endTime = 120,
		callback = function()
			print ("Hello. I'm running after 2 minutes and then every second thereafter.")
			return 1
		end
	})
]]

-- Binary Heap implementation copy-pasted from https://gist.github.com/starwing/1757443a1bd295653c39
-- BinaryHeap[1] always points to the element with the lowest "key" variable
-- API
-- BinaryHeap(key) - Creates a new BinaryHeap with key. The key is the name of the integer variable used to sort objects.
-- BinaryHeap:Insert - Inserts an object into BinaryHeap
-- BinaryHeap:Remove - Removes an object from BinaryHeap

BinaryHeap = BinaryHeap or {}
BinaryHeap.__index = BinaryHeap

function BinaryHeap:Insert(item)
	local index = #self + 1
	local key = self.key
	item.index = index
	self[index] = item
	while index > 1 do
		local parent = math.floor(index/2)
		if self[parent][key] <= item[key] then
			break
		end
		self[index], self[parent] = self[parent], self[index]
		self[index].index = index
		self[parent].index = parent
		index = parent
	end
	return item
end

function BinaryHeap:Remove(item)
	local index = item.index
	if self[index] ~= item then return end
	local key = self.key
	local heap_size = #self
	if index == heap_size then
		self[heap_size] = nil
		return
	end
	self[index] = self[heap_size]
	self[index].index = index
	self[heap_size] = nil
	while true do
		local left = index*2
		local right = left + 1
		if not self[left] then break end
		local newindex = right
		if self[index][key] >= self[left][key] then
			if not self[right] or self[left][key] < self[right][key] then
				newindex = left
			end
		elseif not self[right] or self[index][key] <= self[right][key] then
			break
		end
		self[index], self[newindex] = self[newindex], self[index]
		self[index].index = index
		self[newindex].index = newindex
		index = newindex
	end
end

function BinaryHeap:Find(name)
	for i,v in ipairs(self) do
		if v.name == name then
			return v
		end
	end
	return nil
end

setmetatable(BinaryHeap, {__call = function(self, key) return setmetatable({key=key}, self) end})

function table.merge(input1, input2)
	for i,v in pairs(input2) do
		input1[i] = v
	end
	return input1
end


TIMERS_THINK = 0.01

if _G.Timers == nil then
	print ( '[Timers] creating Timers' )
	_G.Timers = {}
	setmetatable(Timers, {
		__call = function(t, ...)
			return t:CreateTimer(...)
		end
	})
end

function Timers:start()
	self.started = true
	Timers = self
	self:InitializeTimers()
	self.nextTickCallbacks = {}

	local ent = SpawnEntityFromTableSynchronous("info_target", {targetname="timers_lua_thinker"})
	ent:SetThink("Think", self, "timers", TIMERS_THINK)
end

function Timers:Think()
	local nextTickCallbacks = table.merge({}, Timers.nextTickCallbacks)
	Timers.nextTickCallbacks = {}
	for _, cb in ipairs(nextTickCallbacks) do
		local status, result = xpcall(cb, debug.traceback)
		if not status then
			Timers:HandleEventError(result)
		end
	end

	if GameRules:State_Get() > DOTA_GAMERULES_STATE_POST_GAME then
		return
	end

	-- Track game time, since the dt passed in to think is actually wall-clock time not simulation time.
	local now = GameRules:GetGameTime()

	-- Process timers
	self:ExecuteTimers(self.realTimeHeap, Time())
	self:ExecuteTimers(self.gameTimeHeap, GameRules:GetGameTime())

	return TIMERS_THINK
end

function Timers:ExecuteTimers(timerList, now)
	--Empty timer, ignore
	if not timerList[1] then return end

	--Timers are alr. sorted by end time upon insertion
	local currentTimer = timerList[1]

	currentTimer.endTime = currentTimer.endTime or now
	--Check if timer has finished
	if now >= currentTimer.endTime then
		-- Remove from timers list
		timerList:Remove(currentTimer)
		Timers.runningTimer = currentTimer
		Timers.removeSelf = false

		-- Run the callback
		local status, timerResult
		if currentTimer.context then
			status, timerResult = xpcall(function() return currentTimer.callback(currentTimer.context, currentTimer) end, debug.traceback)
		else
			status, timerResult = xpcall(function() return currentTimer.callback(currentTimer) end, debug.traceback)
		end

		Timers.runningTimer = nil

		-- Make sure it worked
		if status then
			-- Check if it needs to loop
			if timerResult and not Timers.removeSelf then
				-- Change its end time

				currentTimer.endTime = currentTimer.endTime + timerResult

				timerList:Insert(currentTimer)
			end

			-- Update timer data
			--self:UpdateTimerData()
		else
			-- Nope, handle the error
			Timers:HandleEventError(timerResult)
		end
		--run again!
		self:ExecuteTimers(timerList, now)
	end
end

function Timers:HandleEventError(err)
	if IsInToolsMode() then
		print(err)
	else
		StatsClient:HandleError(err)
	end
end

function Timers:CreateTimer(arg1, arg2, context)
	local timer
    
	-- CreateTimer(callback: (this: void) => void | number): string;
    -- CreateTimer<T>(callback: (this: T) => void | number, context: T): string;
	if type(arg1) == "function" then
		if arg2 ~= nil then
			context = arg2
		end
		timer = {callback = arg1}
	
	-- CreateTimer(options: CreateTimerOptions): string;
	-- CreateTimer<T>(options: CreateTimerOptionsContext<T>, context: T): string;
	elseif type(arg1) == "table" then
		timer = arg1
	
	-- CreateTimer(delay: number, callback: (this: void) => void | number): string;
	-- CreateTimer<T>(delay: number, callback: (this: T) => void | number, context: T): string;
	elseif type(arg1) == "number" then
		if arg1 ~= arg1 or arg1 == math.huge or arg1 == -math.huge then
			error("Invalid timer duration: " .. arg1)
			return
		end
		timer = {endTime = arg1, callback = arg2}
	
	-- CreateTimer(name: string, options: CreateTimerOptions): string;
    -- CreateTimer<T>(name: string, options: CreateTimerOptionsContext<T>, context: T): string;
	elseif type(arg1) == "string" then
		timer = arg2
		timer.name = arg1
	end
	if not timer.callback then
		print("Invalid timer created")
		return
	end

	local now = GameRules:GetGameTime()
	local timerHeap = self.gameTimeHeap
	if timer.useGameTime ~= nil and timer.useGameTime == false then
		now = Time()
		timerHeap = self.realTimeHeap
	end

	if timer.endTime == nil then
		timer.endTime = now
	else
		timer.endTime = now + timer.endTime
	end

	timer.context = context

	timerHeap:Insert(timer)

	if timer.name == nil then
		timer.name = DoUniqueString('timer')
	end

	return timer.name
end

function Timers:NextTick(callback)
	table.insert(Timers.nextTickCallbacks, callback)
end

function Timers:RemoveTimer(name)
	local timerHeap = self.gameTimeHeap

	local timer = self.gameTimeHeap:Find(name)
	
	if timer ~= nil then
		timerHeap:Remove(timer)
	else
		timerHeap = self.realTimeHeap
		timer = self.realTimeHeap:Find(name)
		if timer ~= nil then
			timerHeap:Remove(timer)
		end
	end

	if Timers.runningTimer == timer then
		Timers.removeSelf = true
	end
end

function Timers:InitializeTimers()
	self.realTimeHeap = BinaryHeap("endTime")
	self.gameTimeHeap = BinaryHeap("endTime")
end

if not Timers.started then Timers:start() end

GameRules.Timers = GameRules.Timers or Timers
