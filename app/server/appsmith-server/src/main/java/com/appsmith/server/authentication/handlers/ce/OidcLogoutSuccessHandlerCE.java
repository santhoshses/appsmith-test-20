package com.appsmith.server.authentication.handlers.ce;

import com.appsmith.external.constants.AnalyticsEvents;
import com.appsmith.server.domains.User;
import com.appsmith.server.dtos.ResponseDTO;
import com.appsmith.server.services.AnalyticsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;



import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.server.DefaultServerRedirectStrategy;
import org.springframework.security.web.server.ServerRedirectStrategy;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import reactor.core.publisher.Mono;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler;


@Slf4j
public class OidcLogoutSuccessHandlerCE extends OidcClientInitiatedServerLogoutSuccessHandler {

    private final ObjectMapper objectMapper;
    private final AnalyticsService analyticsService;
    private final ReactiveClientRegistrationRepository clientRegistrationRepository;
    
    private final ServerRedirectStrategy redirectStrategy = new DefaultServerRedirectStrategy();
    
	private final RedirectServerLogoutSuccessHandler serverLogoutSuccessHandler = new RedirectServerLogoutSuccessHandler();


	private String postLogoutRedirectUri;


    public OidcLogoutSuccessHandlerCE(ObjectMapper objectMapper, AnalyticsService analyticsService, ReactiveClientRegistrationRepository reactiveClientRegistrationRepository) {
        super(reactiveClientRegistrationRepository);
    	this.objectMapper = objectMapper;
        this.analyticsService = analyticsService;
		this.clientRegistrationRepository = reactiveClientRegistrationRepository;
    }

    @Override
    public Mono<Void> onLogoutSuccess(WebFilterExchange webFilterExchange, Authentication authentication) {
    	 ServerWebExchange exchange = webFilterExchange.getExchange();
         ServerHttpResponse response = exchange.getResponse();
    
         log.debug("In the logout success handler");

       
       
       /*  response.setStatusCode(HttpStatus.OK);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        try {
            ResponseDTO<Boolean> responseBody = new ResponseDTO<>(HttpStatus.OK.value(), true, null);
            String responseStr = objectMapper.writeValueAsString(responseBody);
            DataBuffer buffer = exchange.getResponse().bufferFactory().allocateBuffer().write(responseStr.getBytes());
           analyticsService.sendObjectEvent(
                        AnalyticsEvents.LOGOUT,
                        (User) authentication.getPrincipal()
                    );
          
          //http://localhost:8080/realms/master/protocol/openid-connect/logout
          return  Mono.just("")
            		.map(URI::create)
                    .map(redirectUri -> redirectStrategy.sendRedirect(exchange, redirectUri))
                    .then(response.writeWith(Mono.just(buffer)));*/
    	try
    	{
    		
               
    		this.setPostLogoutRedirectUri("{baseUrl}");
    		
    		 User user = (User) authentication.getPrincipal();
    		 
    		 log.info("ID tokenValue   ::"+user.getSsoidtoken());
    		
    		 List<String> list = new ArrayList();
    		 
    		// @formatter:off
    	 Mono.just(authentication)
    				.filter(OAuth2AuthenticationToken.class::isInstance)
    				.filter((token) -> authentication.getPrincipal() instanceof OidcUser)
    				.map(OAuth2AuthenticationToken.class::cast)
    				.map(OAuth2AuthenticationToken::getAuthorizedClientRegistrationId)
    				.flatMap(this.clientRegistrationRepository::findByRegistrationId)
    				.flatMap((clientRegistration) -> {
    					URI endSessionEndpoint = endSessionEndpoint(clientRegistration);
    					if (endSessionEndpoint == null) {
    						return Mono.empty();
    					}
    					//String idToken = idToken(authentication);
    					String idToken =user.getSsoidtoken(); 
    					String postLogoutRedirectUri = postLogoutRedirectUri(webFilterExchange.getExchange().getRequest(), clientRegistration);
    					
    					log.info("postLogoutRedirectUri ::::"+postLogoutRedirectUri);
    					
    					String endpoint = endpointUri(endSessionEndpoint, idToken, postLogoutRedirectUri);
    					
    					list.add(endpoint);
    					
    					return Mono.just(endpointUri(endSessionEndpoint, idToken, postLogoutRedirectUri));
    				}).subscribe(i->list.add(i));
    			/*	.switchIfEmpty(
    						this.serverLogoutSuccessHandler.onLogoutSuccess(webFilterExchange, authentication).then(Mono.empty())
    				)
    				.flatMap((endpointUri) -> {
    				
    					log.info("Redirecting to ::"+endpointUri);
    					
    				return this.redirectStrategy.sendRedirect(webFilterExchange.getExchange(), URI.create(endpointUri));
    				
    				});*/
    		
    		 response.setStatusCode(HttpStatus.OK);
            response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
            //response.getHeaders().add(HttpHeaders.LOCATION,list.get(0));
            
            
                ResponseDTO<Boolean> responseBody = new ResponseDTO<>(HttpStatus.OK.value(), true, null,list.get(0));
                String responseStr = objectMapper.writeValueAsString(responseBody);
                
                log.info("responseStr ::"+responseStr);
                
                DataBuffer buffer = exchange.getResponse().bufferFactory().allocateBuffer().write(responseStr.getBytes());
              return  analyticsService.sendObjectEvent(
                            AnalyticsEvents.LOGOUT,
                            (User) authentication.getPrincipal()
                        ).then(response.writeWith(Mono.just(buffer)));
    		// @formatter:on
    	
    	}
         catch (Exception e) {
            log.error("Unable to write to response json. Cause: ", e);
            // Returning a hard-coded failure json
            String responseStr = "{\"responseMeta\":{\"status\":500,\"success\":false},\"data\":false}";
            DataBuffer buffer = exchange.getResponse().bufferFactory().allocateBuffer().write(responseStr.getBytes());
            return response.writeWith(Mono.just(buffer));
        }
    }
    
    private URI endSessionEndpoint(ClientRegistration clientRegistration) {
		if (clientRegistration != null) {
			Object endSessionEndpoint = clientRegistration.getProviderDetails().getConfigurationMetadata()
					.get("end_session_endpoint");
			if (endSessionEndpoint != null) {
				return URI.create(endSessionEndpoint.toString());
			}
		}
		return null;
	}

	private String endpointUri(URI endSessionEndpoint, String idToken, String postLogoutRedirectUri) {
		UriComponentsBuilder builder = UriComponentsBuilder.fromUri(endSessionEndpoint);
		builder.queryParam("id_token_hint", idToken);
		if (postLogoutRedirectUri != null) {
			builder.queryParam("post_logout_redirect_uri", postLogoutRedirectUri);
		}
		
		log.info("endpointUri ::"+builder.encode(StandardCharsets.UTF_8).build().toUriString());
		
		return builder.encode(StandardCharsets.UTF_8).build().toUriString();
	}

	private String idToken(Authentication authentication) {
		return ((OidcUser) authentication.getPrincipal()).getIdToken().getTokenValue();
	}

	private String postLogoutRedirectUri(ServerHttpRequest request, ClientRegistration clientRegistration) {
		if (this.postLogoutRedirectUri == null) {
			return null;
		}
		// @formatter:off
		UriComponents uriComponents = UriComponentsBuilder.fromUri(request.getURI())
				.replacePath(request.getPath().contextPath().value())
				.replaceQuery(null)
				.fragment(null)
				.build();

		Map<String, String> uriVariables = new HashMap<>();
		String scheme = uriComponents.getScheme();
		uriVariables.put("baseScheme", (scheme != null) ? scheme : "");
		uriVariables.put("baseUrl", uriComponents.toUriString());

		String host = uriComponents.getHost();
		uriVariables.put("baseHost", (host != null) ? host : "");

		String path = uriComponents.getPath();
		uriVariables.put("basePath", (path != null) ? path : "");

		int port = uriComponents.getPort();
		uriVariables.put("basePort", (port == -1) ? "" : ":" + port);

		uriVariables.put("registrationId", clientRegistration.getRegistrationId());

		return UriComponentsBuilder.fromUriString(this.postLogoutRedirectUri)
				.buildAndExpand(uriVariables)
				.toUriString();
		// @formatter:on
	}

	/**
	 * Set the post logout redirect uri template.
	 *
	 * <br />
	 * The supported uri template variables are: {@code {baseScheme}}, {@code {baseHost}},
	 * {@code {basePort}} and {@code {basePath}}.
	 *
	 * <br />
	 * <b>NOTE:</b> {@code {baseUrl}} is also supported, which is the same as
	 * {@code "{baseScheme}://{baseHost}{basePort}{basePath}"}
	 *
	 * <pre>
	 * 	handler.setPostLogoutRedirectUri("{baseUrl}");
	 * </pre>
	 *
	 * will make so that {@code post_logout_redirect_uri} will be set to the base url for
	 * the client application.
	 * @param postLogoutRedirectUri - A template for creating the
	 * {@code post_logout_redirect_uri} query parameter
	 * @since 5.3
	 */
	public void setPostLogoutRedirectUri(String postLogoutRedirectUri) {
		Assert.notNull(postLogoutRedirectUri, "postLogoutRedirectUri cannot be null");
		this.postLogoutRedirectUri = postLogoutRedirectUri;
	}

	/**
	 * The URL to redirect to after successfully logging out when not originally an OIDC
	 * login
	 * @param logoutSuccessUrl the url to redirect to. Default is "/login?logout".
	 */
	public void setLogoutSuccessUrl(URI logoutSuccessUrl) {
		Assert.notNull(logoutSuccessUrl, "logoutSuccessUrl cannot be null");
		this.serverLogoutSuccessHandler.setLogoutSuccessUrl(logoutSuccessUrl);
	}

    
    

}
