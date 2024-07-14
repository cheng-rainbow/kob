package com.kob.matchingsystem;

import com.kob.matchingsystem.MatchingSystemApplication;
import com.kob.matchingsystem.service.impl.MatchingService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MatchingSystemApplication {
    public static void main(String[] args) {
        MatchingService.matchingPool.start();   // 启动匹配线程
        SpringApplication.run(MatchingSystemApplication.class, args);
    }
}