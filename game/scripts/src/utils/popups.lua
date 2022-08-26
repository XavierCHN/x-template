POPUP_SYMBOL_PRE_PLUS = 0
POPUP_SYMBOL_PRE_MINUS = 1
POPUP_SYMBOL_PRE_SADFACE = 2
POPUP_SYMBOL_PRE_BROKENARROW = 3
POPUP_SYMBOL_PRE_SHADES = 4
POPUP_SYMBOL_PRE_MISS = 5
POPUP_SYMBOL_PRE_EVADE = 6
POPUP_SYMBOL_PRE_DENY = 7
POPUP_SYMBOL_PRE_ARROW = 8

POPUP_SYMBOL_POST_EXCLAMATION = 0
POPUP_SYMBOL_POST_POINTZERO = 1
POPUP_SYMBOL_POST_MEDAL = 2
POPUP_SYMBOL_POST_DROP = 3
POPUP_SYMBOL_POST_LIGHTNING = 4
POPUP_SYMBOL_POST_SKULL = 5
POPUP_SYMBOL_POST_EYE = 6
POPUP_SYMBOL_POST_SHIELD = 7
POPUP_SYMBOL_POST_POINTFIVE = 8

function PopupHealing(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_heal.vpcf", Vector(0, 255, 0),
		1.0, amount, POPUP_SYMBOL_PRE_PLUS, nil, player)
end

function PopupDamage(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_damage.vpcf", Vector(255, 0, 0),
		1.0, amount, nil, POPUP_SYMBOL_POST_DROP, player)
end

function PopupAddGold(target, amount, player)
	PopupNumbers(target, "particles/ability/msg_crit.vpcf", Vector(255, 200, 33),
		2.0, amount, POPUP_SYMBOL_PRE_PLUS, nil, player)
end

function PopupDamageBig(target, amount, player)
	PopupNumbers(target, "particles/ability/msg_crit.vpcf", Vector(255, 0, 0),
		2.0, amount, nil, POPUP_SYMBOL_POST_DROP, player)
end

function PopupDamageColored(target, amount, color, player)
	PopupNumbers(target, "particles/msg_fx/msg_damage.vpcf", color,
		1.0, amount, nil, POPUP_SYMBOL_POST_DROP, player)
end

function PopupCriticalDamage(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_crit.vpcf", Vector(255, 0, 0),
		1.0, amount, nil, POPUP_SYMBOL_POST_LIGHTNING, player)
end

function PopupCriticalDamageColored(target, amount, color, player) 
	PopupNumbers(target, "particles/msg_fx/msg_crit.vpcf", color,
		1.0, amount, nil, POPUP_SYMBOL_POST_LIGHTNING, player)
end

function PopupDamageOverTime(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_poison.vpcf", Vector(215, 50, 248),
		1.0, amount, nil, POPUP_SYMBOL_POST_EYE, player)
end

function PopupDamageBlock(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_block.vpcf", Vector(255, 255, 255),
		1.0, amount, POPUP_SYMBOL_PRE_MINUS, nil, player)
end

function PopupGoldGain(target, amount, player)
	PopupNumbers(target, "particles/msg_fx/msg_gold.vpcf", Vector(255, 200, 33),
		1.0, amount, POPUP_SYMBOL_PRE_PLUS, nil, player)
end

function PopupManaGain(target, amount, player) 
	PopupNumbers(target, "particles/msg_fx/msg_gold.vpcf", Vector(33, 200, 255),
		1.0, amount, POPUP_SYMBOL_PRE_PLUS, nil, player)
end

function PopupMiss(target, player)
	PopupNumbers(target, "particles/msg_fx/msg_miss.vpcf", Vector(255, 0, 0),
		1.0, nil, POPUP_SYMBOL_PRE_MISS, nil, player)
end

function PopupNumbers(target, pfx, color, lifetime, number, presymbol, postsymbol, player)
	local pidx = nil
	if player then
		pidx = ParticleManager:CreateParticleForPlayer(pfx, PATTACH_OVERHEAD_FOLLOW, target, player)
		-- pidx = ParticleManager:CreateParticle(pfx, PATTACH_OVERHEAD_FOLLOW, target)
	else
		pidx = ParticleManager:CreateParticle(pfx, PATTACH_OVERHEAD_FOLLOW, target)
	end

	local digits = 0
	if number ~= nil then
		digits = #tostring(math.floor(number))
	end
	if presymbol ~= nil then
		digits = digits + 1
	end
	if postsymbol ~= nil then
		digits = digits + 1
	end

	ParticleManager:SetParticleControl(pidx, 1, Vector(tonumber(presymbol), tonumber(number), tonumber(postsymbol)))
	ParticleManager:SetParticleControl(pidx, 2, Vector(lifetime, digits, 0))
	ParticleManager:SetParticleControl(pidx, 3, color)
	
	ParticleManager:ReleaseParticleIndex(pidx)
end