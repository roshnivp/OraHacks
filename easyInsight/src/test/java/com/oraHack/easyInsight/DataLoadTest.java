package com.oraHack.easyInsight;

import com.oraHack.easyInsight.Utils.Constants;
import com.oraHack.easyInsight.Utils.JsonUtil;
import com.oraHack.easyInsight.service.SetupDataService;
import org.apache.tomcat.util.collections.CaseInsensitiveKeyMap;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class DataLoadTest {


    @Test
    public void testDataLoad() throws IOException {
        Map<String, String> keyValueMap =  JsonUtil.resourceToObject(Constants.SETUP_DATA_JSON, Map.class);
        Set<String> values = keyValueMap.entrySet()
                .stream()
                .filter(entry -> entry.getKey().toLowerCase().contains("data"))
                .map(Map.Entry::getValue)
                .collect(Collectors.toSet());
        System.out.println("values return :" + values.toString());
    }
}
