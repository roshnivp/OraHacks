package com.oraHack.easyInsight.service;

import com.oraHack.easyInsight.Utils.Constants;
import com.oraHack.easyInsight.Utils.JsonUtil;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service("SetupDataService")
public class SetupDataService {

    public Set<String> getSetupData(String keyWord) throws FileNotFoundException {
        Set<String> values = new HashSet<>();
        try {
//            JSONParser parser = new JSONParser();
//            //Use JSONObject for simple JSON and JSONArray for array of JSON.
//            JSONObject data = (JSONObject) parser.parse(
//                    new FileReader("/Users/sujisure/Documents/OraHacks/easyInsight/src/main/java/com/oraHack/easyInsight/Data/data.json"));//path to the JSON file.
//
//            String json = data.toJSONString();
//
//            String regex = "";
//            Matcher m = Pattern.compile(regex).matcher(json);
//            if (m.find()) {
//                System.out.println(m.group(1));
//            }
            Map<String,String > keyValueMap = JsonUtil.resourceToObject(Constants.SETUP_DATA_JSON, Map.class);
            values = keyValueMap.entrySet()
                    .stream()
                    .filter(entry -> entry.getKey().toLowerCase().contains(keyWord.toLowerCase()))
                    .map(Map.Entry::getValue)
                    .collect(Collectors.toSet());
        }  catch (Exception e) {
            e.printStackTrace();
        }
        return values;
    }
}
