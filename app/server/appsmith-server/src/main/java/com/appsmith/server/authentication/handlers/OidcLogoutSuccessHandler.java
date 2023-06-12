package com.appsmith.server.authentication.handlers;

import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;

import com.appsmith.server.authentication.handlers.ce.OidcLogoutSuccessHandlerCE;
import com.appsmith.server.services.AnalyticsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OidcLogoutSuccessHandler extends OidcLogoutSuccessHandlerCE {

    public OidcLogoutSuccessHandler(ObjectMapper objectMapper, AnalyticsService analyticsService, ReactiveClientRegistrationRepository reactiveClientRegistrationRepository) {
        super(objectMapper, analyticsService,reactiveClientRegistrationRepository);
    }
    
    

}
