local public = {};

aeslua.buffer = public;

function public.new ()
  return {};
end

function public.addString (stack, s)
  table.insert(stack, s)
  for i = #stack - 1, 1, -1 do
    if #stack[i] > #stack[i+1] then 
        break;
    end
    stack[i] = stack[i] .. table.remove(stack);
  end
end

function public.toString (stack)
  for i = #stack - 1, 1, -1 do
    stack[i] = stack[i] .. table.remove(stack);
  end
  return stack[1];
end

return public;