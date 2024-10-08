package com.kob.backend.consumer;

import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.BotMapper;
import com.kob.backend.mapper.RecordMapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.Bot;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {

    final public static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    private User user;

    private Session session = null;

    public Game game = null;

    private final static String addPlayerUrl = "http://127.0.0.1:3001/player/add/";

    private final static String removePlayerUrl = "http://127.0.0.1:3001/player/remove/";

    // 注入 UserMapper, 由于不是单例模式, 不能直接用@Autowired注入
    public static UserMapper userMapper;
    @Autowired
    public  void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }


    public static RecordMapper recordMapper;
    @Autowired
    public void setRecordMapper(RecordMapper recordMapper) {
        WebSocketServer.recordMapper = recordMapper;
    }


    public static RestTemplate restTemplate;
    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        WebSocketServer.restTemplate = restTemplate;
    }

    private static BotMapper botMapper;
    @Autowired
    public void setBotMapper(BotMapper botMapper) {
        WebSocketServer.botMapper = botMapper;
    }


    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        this.session = session;
        // 建立连接
        System.out.println("connected");

        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);

        if (this.user != null) {
            users.put(userId, this);
        } else {
            session.close();
        }

    }

    @OnClose
    public void onClose() {
        // 关闭链接

        System.out.println("disconnected");

        if (this.user != null) {
            users.remove(this.user.getId());
        }
    }

    public static void startGame(Integer aId, Integer aBotId, Integer bId, Integer bBotId) {
        User a = userMapper.selectById(aId), b = userMapper.selectById(bId);
        Bot botA = botMapper.selectById(aBotId), botB = botMapper.selectById(bBotId);

        Game game = new Game(
                13,
                14,
                20,
                a.getId(),
                botA,
                b.getId(),
                botB
        );
        game.createMap();
        if (users.get(a.getId()) != null) users.get(a.getId()).game = game;
        if (users.get(b.getId()) != null) users.get(b.getId()).game = game;
        game.start();

        JSONObject respGame = new JSONObject();
        respGame.put("a_id",game.getPlayerA().getId());
        respGame.put("a_sx", game.getPlayerA().getSx());
        respGame.put("a_sy", game.getPlayerA().getSy());
        respGame.put("b_id",game.getPlayerB().getId());
        respGame.put("b_sx", game.getPlayerB().getSx());
        respGame.put("b_sy", game.getPlayerB().getSy());
        respGame.put("map", game.getG());


        JSONObject resA = new JSONObject();
        resA.put("event", "start-matching");
        resA.put("opponent_username", b.getUsername());
        resA.put("opponent_photo", b.getPhoto());
        resA.put("game", respGame);
        if (users.get(a.getId()) != null) users.get(a.getId()).sendMessage(resA.toJSONString());

        JSONObject resB = new JSONObject();
        resB.put("event", "start-matching");
        resB.put("opponent_username", a.getUsername());
        resB.put("opponent_photo", a.getPhoto());
        resB.put("game", respGame);
        if (users.get(b.getId()) != null) users.get(b.getId()).sendMessage(resB.toJSONString());
    }

    private void startMatching (Integer botId) {
        System.out.println("start matching");

        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", this.user.getId().toString());
        data.add("rating", this.user.getRating().toString());
        data.add("bot_id", botId.toString());
        restTemplate.postForObject(addPlayerUrl, data, String.class);
    }

    private void stopMatching () {
        System.out.println("stop matching");

        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", this.user.getId().toString());
        restTemplate.postForObject(removePlayerUrl, data, String.class);
    }

    private void move (int direction) {
        if (game.getPlayerA().getId().equals(user.getId())) {
            if (game.getPlayerA().getBotId().equals(-1))    // 亲自出马
                game.setNextStepA(direction);
        } else if (game.getPlayerB().getId().equals(user.getId())) {
            if (game.getPlayerB().getBotId().equals(-1))    // 亲自出马
                game.setNextStepB(direction);
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // 从Client接收消息, 后端接收信息
        System.out.println(message);
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if ("start-matching".equals(event)) {
            startMatching(data.getInteger("bot_id"));
        } else if ("stop-matching".equals(event)) {
            stopMatching();
        } else if ("move".equals(event)) {
            move(data.getInteger("direction"));
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    // service send message to client
    public void sendMessage(String message) {
        synchronized (this.session) {
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
