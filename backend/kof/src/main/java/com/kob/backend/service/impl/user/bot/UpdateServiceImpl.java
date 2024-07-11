package com.kob.backend.service.impl.user.bot;

import com.kob.backend.mapper.BotMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.bot.UpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class UpdateServiceImpl implements UpdateService {

    @Autowired
    BotMapper botMapper;

    @Override
    public Map<String, String> update(Map<String, String> data) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) usernamePasswordAuthenticationToken.getPrincipal();
        User user = loginUser.getUser();

        Integer bot_id = Integer.parseInt(data.get("botId")) ;
        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");

        Map<String, String> map = new HashMap<>();

        if (title.isEmpty()) {
            map.put("error_message", "标题不能为空");
            return map;
        }

        if (title.length() > 100) {
            map.put("error_message", "标题过长");
            return map;
        }

        if (description.length() > 300) {
            map.put("error_message", "描述过长");
            return map;
        }

        if (description.isEmpty()) {
            description = "这个用户很懒, 什么也没有留下!~";
        }

        if (content.isEmpty()) {
            map.put("error_message", "内容不能为空");
            return map;
        }

        if (content.length() > 10000) {
            map.put("error_message", "内容过长");
            return map;
        }

        Bot bot = botMapper.selectById(bot_id);

        if (bot == null) {
            map.put("error_message", "bot不存在或已被删除");
            return map;
        }

        if (!Objects.equals(bot.getUserId(), user.getId())) {
            map.put("error_message", "无权限更新该bot");
            return map;
        }

        Date now = new Date();
        Bot new_bot = new Bot(bot.getId(), bot.getUserId(),title, description, content,bot.getRating(), bot.getCreatetime(),now);

        System.out.println(new_bot);

        botMapper.updateById(new_bot);
        map.put("error_message", "update success");
        return map;
    }
}
