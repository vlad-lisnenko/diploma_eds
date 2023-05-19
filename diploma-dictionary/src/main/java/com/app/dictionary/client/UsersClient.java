package com.app.dictionary.client;

import com.app.dictionary.client.request.TokenSummary;
import com.app.dictionary.client.request.TokenSummaryRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("users")
public interface UsersClient {

    @GetMapping("/token/summary")
    TokenSummary findTokenSummaryByToken(@RequestBody TokenSummaryRequest request);
}
