﻿//using System;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.OpenIdConnect;
//using Microsoft.Extensions.Caching.Memory;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.Protocols.OpenIdConnect;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.Identity.Client;

//namespace Core.Authentication
//{
//    public static class AzureAdAuthenticationBuilderExtensions
//    {
//        public static AuthenticationBuilder AddAzureAd(this AuthenticationBuilder builder)
//            => builder.AddAzureAd(_ => { });

//        public static AuthenticationBuilder AddAzureAd(this AuthenticationBuilder builder, Action<AzureAdOptions> configureOptions)
//        {
//            builder.Services.Configure(configureOptions);
//            builder.Services.AddSingleton<IConfigureOptions<OpenIdConnectOptions>, ConfigureAzureOptions>();
//            builder.AddOpenIdConnect();
//            return builder;
//        }

//        public class ConfigureAzureOptions : IConfigureNamedOptions<OpenIdConnectOptions>
//        {
//            private readonly AzureAdOptions _azureOptions;

//            public AzureAdOptions GetAzureAdOptions() => _azureOptions;

//            public ConfigureAzureOptions(IOptions<AzureAdOptions> azureOptions)
//            {
//                _azureOptions = azureOptions.Value;
//            }

//            public void Configure(string name, OpenIdConnectOptions options)
//            {
//                options.ClientId = _azureOptions.ClientId;
//                options.Authority = $"{_azureOptions.Instance}common/v2.0";
//                options.UseTokenLifetime = true;
//                options.CallbackPath = _azureOptions.CallbackPath;
//                options.RequireHttpsMetadata = false;
//                options.ResponseType = OpenIdConnectResponseType.CodeIdToken;
//                var allScopes = $"{_azureOptions.Scopes} {_azureOptions.GraphScopes}".Split(new[] { ' ' });
//                foreach (var scope in allScopes) { options.Scope.Add(scope); }

//                options.TokenValidationParameters = new TokenValidationParameters
//                {
//                    // Ensure that User.Identity.Name is set correctly after login
//                    NameClaimType = "name",

//                    // Instead of using the default validation (validating against a single issuer value, as we do in line of business apps),
//                    // we inject our own multitenant validation logic
//                    ValidateIssuer = false,

//                    // If the app is meant to be accessed by entire organizations, add your issuer validation logic here.
//                    //IssuerValidator = (issuer, securityToken, validationParameters) => {
//                    //    if (myIssuerValidationLogic(issuer)) return issuer;
//                    //}
//                };

//                options.Events = new OpenIdConnectEvents
//                {
//                    OnTicketReceived = context =>
//                    {
//                        // If your authentication logic is based on users then add your logic here
//                        return Task.CompletedTask;
//                    }
//                };
//            }

//            public void Configure(OpenIdConnectOptions options)
//            {
//                Configure(Options.DefaultName, options);
//            }
//        }
//    }
//}