package com.kob.backend.consumer;

import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {

    final private static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    final private  static CopyOnWriteArraySet<User> matchpool = new CopyOnWriteArraySet<>();
    private User user;

    private Session session = null;

    // 注入 UserMapper, 由于不是单例模式, 不能直接用@Autowired注入
    private static UserMapper userMapper;
    @Autowired
    public  void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
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
            matchpool.remove(this.user);
        }
    }

    private void startMatching () {
        System.out.println("start matching");

        matchpool.add(this.user);

        while (matchpool.size() >= 2) {
            Iterator<User> it = matchpool.iterator();
            User a = it.next(), b = it.next();
            matchpool.remove(a);
            matchpool.remove(b);

            Game game = new Game(13, 14, 20);
            game.createMap();

            System.out.println(Arrays.deepToString(game.getG()));

            JSONObject resA = new JSONObject();
            resA.put("event", "start-matching");
            resA.put("opponent_username", b.getUsername());
            resA.put("opponent_photo", b.getPhoto());
            resA.put("gamemap", game.getG());

            users.get(a.getId()).sendMessage(resA.toJSONString());

            JSONObject resB = new JSONObject();
            resB.put("event", "start-matching");
            resB.put("opponent_username", a.getUsername());
            resB.put("opponent_photo", a.getPhoto());
            resB.put("gamemap", game.getG());



            users.get(b.getId()).sendMessage(resB.toJSONString());
        }
    }

    private void stopMatching () {
        System.out.println("stop matching");

        matchpool.remove(this.user);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // 从Client接收消息, 后端接收信息
        System.out.println(message);
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if ("start-matching".equals(event)) {
            startMatching();
        } else if ("stop-matching".equals(event)) {
            stopMatching();
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
