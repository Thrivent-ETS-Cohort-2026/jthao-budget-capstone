package com.example.backend.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

@Service
public class SessionService {
    private final ConcurrentHashMap<String, Long> sessionToUser = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, String> userToSession = new ConcurrentHashMap<>();

    public String createSession(Long userId) {
        String oldSessionUuid = userToSession.remove(userId);
        if (oldSessionUuid != null) {
            sessionToUser.remove(oldSessionUuid);
        }
        String newSessionUuid = UUID.randomUUID().toString();
        
        sessionToUser.put(newSessionUuid, userId);
        userToSession.put(userId, newSessionUuid);

        return newSessionUuid;
    }

    public Long getUserIdBySession(String sessionUuid) {
        if (sessionUuid == null) {
            return null;
        }
        return sessionToUser.get(sessionUuid);
    }

    public void invalidateSession(String sessionUuid) {
        if (sessionUuid != null) {
            Long userId = sessionToUser.remove(sessionUuid);
            if (userId != null) {
                userToSession.remove(userId);
            }
        }
    }
}