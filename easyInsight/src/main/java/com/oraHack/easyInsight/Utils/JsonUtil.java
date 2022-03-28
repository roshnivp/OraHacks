package com.oraHack.easyInsight.Utils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;

public class JsonUtil {
    public static <T> T resourceToObject(String resourceName, Class<T> tClass) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        InputStream in = JsonUtil.class.getResourceAsStream(resourceName);
        return objectMapper.readValue(in, tClass);
    }
}
