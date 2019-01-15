﻿// Copyright(c) Microsoft Corporation. 
// All rights reserved.
//
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information.

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace Core.Authentication
{
    /// <summary>
    /// Extensions for the AzureAdAuthenticationBuilder
    /// </summary>
    public static class AzureAdAuthenticationBuilderExtensions
    {
        // Extensions for authenticating using barer token (user already authenticated in client) NOTE: To use this the corresponding initialization is needed in startup
        #region Barer token (for incoming webapi calls)
        public static AuthenticationBuilder AddAzureAdBearer(this AuthenticationBuilder builder)
            => builder.AddAzureAdBearer(_ => { });

        public static AuthenticationBuilder AddAzureAdBearer(this AuthenticationBuilder builder, Action<AzureAdOptions> configureOptions)
        {
            builder.Services.Configure(configureOptions);
            builder.Services.AddSingleton<IConfigureOptions<JwtBearerOptions>, ConfigureAzureOptions>();
            builder.AddJwtBearer();
            return builder;
        }

        public static AuthenticationBuilder AddAzureAdBearer(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<AzureAdOptions> configureOptions)
        {
            builder.AddPolicyScheme(authenticationScheme, displayName, options =>
            {
                options.ForwardDefault = "JwtBearer";
            });

            //builder.Services.TryAddSingleton<IConfigureOptions<JwtBearerOptions>, ConfigureAzureAdBearerOptions>();
            builder.Services.AddSingleton<IConfigureOptions<JwtBearerOptions>, ConfigureAzureOptions>();

            builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<JwtBearerOptions>, JwtBearerPostConfigureOptions>());

            builder.Services.Configure(configureOptions);

            builder.AddJwtBearer("JwtBearer", options => { }); //Adding the JwtBearer scheme with a different name to avoid conflict with bot authentication

            return builder;
        }

        private class ConfigureAzureOptions : IConfigureNamedOptions<JwtBearerOptions>
        {
            private readonly AzureAdOptions _azureOptions;

            public ConfigureAzureOptions(IOptions<AzureAdOptions> azureOptions)
            {
                _azureOptions = azureOptions.Value;
            }

            public void Configure(string name, JwtBearerOptions options)
            {
                options.Audience = _azureOptions.ClientId;
                options.Authority = _azureOptions.Authority;
            }

            public void Configure(JwtBearerOptions options)
            {
                Configure(Options.DefaultName, options);
            }
        }

        //private class ConfigureAzureAdBearerOptions : IConfigureNamedOptions<JwtBearerOptions>
        //{
        //    private readonly AzureAdOptions _azureOptions;
        //    private readonly ILogger<ConfigureAzureAdBearerOptions> _logger;

        //    public ConfigureAzureAdBearerOptions(IOptions<AzureAdOptions> azureOptions, ILogger<ConfigureAzureAdBearerOptions> logger)
        //    {
        //        _azureOptions = azureOptions.Value;
        //        _logger = logger;
        //    }

        //    public void Configure(string name, JwtBearerOptions options)
        //    {
        //        if (String.IsNullOrEmpty(_azureOptions.ClientId))
        //        {
        //            _logger.LogError($"ConfigureAzureAdBearerOptions ClientId is Null");
        //        }

        //        options.Audience = _azureOptions.Audience;
        //        //options.Authority = $"{_azureOptions.Instance}{_azureOptions.TenantId}";
        //        options.Authority = _azureOptions.Authority;

        //        options.TokenValidationParameters = new TokenValidationParameters
        //        {
        //            // Instead of using the default validation (validating against a single issuer value, as we do in line of business apps),
        //            // we inject our own multitenant validation logic
        //            ValidateIssuer = true,

        //            // If the app is meant to be accessed by entire organizations, add your issuer validation logic here.
        //            //IssuerValidator = (issuer, securityToken, validationParameters) =>
        //            //{
        //            //    if (myIssuerValidationLogic(issuer)) return issuer;
        //            //    return String.Empty;
        //            //}
        //        };
        //        options.Events = new JwtBearerEvents
        //        {
        //            OnTokenValidated = TokenValidated,
        //            //OnAuthenticationFailed = AuthenticationFailed,
        //            //OnMessageReceived = MessageReceived
        //        };
        //        options.SaveToken = true;

        //        options.Validate();
        //    }

        //    public void Configure(JwtBearerOptions options)
        //    {
        //        Configure(Options.DefaultName, options);
        //    }

        //    // MessageReceived event
        //    private Task MessageReceived(Microsoft.AspNetCore.Authentication.JwtBearer.MessageReceivedContext context)
        //    {
        //        // If no token found, no further work possible
        //        if (string.IsNullOrEmpty(context.Token))
        //        {
        //            //return AuthenticateResult.NoResult();
        //        }

        //        return Task.FromResult(0);
        //    }

        //    // TokenValidated event
        //    private Task TokenValidated(Microsoft.AspNetCore.Authentication.JwtBearer.TokenValidatedContext context)
        //    {
        //        //Replace this with your logic to validate the issuer/tenant

        //        // Store the token in the token cache

        //        return Task.FromResult(0);
        //    }

        //    // Handle sign-in errors differently than generic errors.
        //    private Task AuthenticationFailed(Microsoft.AspNetCore.Authentication.JwtBearer.AuthenticationFailedContext context)
        //    {
        //        //context.HandleResponse();
        //        //context.Response.Redirect("/Home/Error?message=" + context.Failure.Message);
        //        //context.Response.Redirect("/Home/Error?message=");

        //        //_logger.LogError($"AuthenticationFailed token provided: {context.Request.Headers.TryGetValue("",)}");

        //        return Task.FromResult(0);
        //    }
        //}
        #endregion


    }
}