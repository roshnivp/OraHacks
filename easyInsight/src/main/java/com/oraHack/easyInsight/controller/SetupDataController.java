package com.oraHack.easyInsight.controller;

import com.oraHack.easyInsight.service.SetupDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
public class SetupDataController {

    @Autowired
    SetupDataService setupDataService;

    @GetMapping("/api/v1/easyInsight/search")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getData(@RequestParam String key) throws Exception {
        Set<String> results = setupDataService.getSetupData(key);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }
}
