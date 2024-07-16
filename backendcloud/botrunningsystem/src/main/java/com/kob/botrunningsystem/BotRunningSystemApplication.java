package com.kob.botrunningsystem;


import com.kob.botrunningsystem.service.impl.BotRunningServiceImp;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BotRunningSystemApplication {
    public static void main(String[] args) {
        BotRunningServiceImp.botPool.start();
        SpringApplication.run(BotRunningSystemApplication.class, args);
    }
}