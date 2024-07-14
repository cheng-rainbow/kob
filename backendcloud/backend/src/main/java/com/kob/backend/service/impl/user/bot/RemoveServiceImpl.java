package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.bot.RemoveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class RemoveServiceImpl implements RemoveService {

    @Autowired
    BotMapper botMapper;

    @Override
    public Map<String, String> remove(Map<String, String> data) {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) usernamePasswordAuthenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Map<String,String> map = new HashMap<>();
        int bot_id = Integer.parseInt(data.get("botId"));
        Bot bot = botMapper.selectById(bot_id);

        if (bot == null) {
            map.put("error_message", "bot不存在或已被删除");
            return map;
        }

        if (!Objects.equals(bot.getUserId(), user.getId())) {
            map.put("error_message", "无权限删除该bot");
            return map;
        }

        botMapper.deleteById(bot_id);
        map.put("error_message", "success");
        return map;
    }
}
