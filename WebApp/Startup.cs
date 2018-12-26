// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using System.Reflection;
using Infrastructure.Data;
using Core.Sharedkernel;
using Core.Queries;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace WebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // Add MediatR
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            
            services.AddMediatR(typeof(GetAllCountries).GetTypeInfo().Assembly);

            //services.AddAuthentication(sharedOptions =>
            //{
            //    sharedOptions.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            //})
            //.AddAzureAd(options => Configuration.Bind("AzureAd", options));


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                                    //Metadata for ADFS shown, but this can be substituted with either the Azure AD v2 common endpoint:
                                    //https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration or the tenant-specific version:
                                    //https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration
                                    options.MetadataAddress = "https://adfs.contoso.com/adfs/.well-known/openid-configuration";
                        options.Validate();

                        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                        {
                                        //For ADFS the access token issuer is not the same as the issuer attribute in the metadata so we need
                                        //this additional parameter to pass validation
                                        ValidIssuer = "http://adfs.contoso.com/adfs/services/trust",
                            ValidateAudience = true,
                            ValidateIssuerSigningKey = true,
                            ValidateLifetime = true,
                            ValidAudience = "https://contoso.com/api",
                            RequireSignedTokens = true,
                            ValidateActor = true,
                        };
                    });

            services.AddAuthorization(options =>
            {
                //Policy for accepting only cert-based auth
                options.AddPolicy("Certificate", policy =>
                    policy.RequireAssertion(context =>
                    context.User.HasClaim(c =>
                        ((c.Type == System.Security.Claims.ClaimTypes.AuthenticationMethod &&
                        c.Value == "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/tlsclient") ||
                        (c.Type == System.Security.Claims.ClaimTypes.AuthenticationMethod &&
                        c.Value == "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/x509"))
                        )));
            });

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // Customise default API behavour
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
            //
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            return BuildDependencyInjectionProvider(services);
        }

        private IServiceProvider BuildDependencyInjectionProvider(IServiceCollection services)
        {
            var builder = new ContainerBuilder();

            // Populate the container using the service collection
            builder.Populate(services);

            // TODO: Add Registry Classes to eliminate reference to Infrastructure
            Assembly webAssembly = Assembly.GetExecutingAssembly();
            Assembly coreAssembly = Assembly.GetAssembly(typeof(BaseEntity));
            Assembly infrastructureAssembly = Assembly.GetAssembly(typeof(DataRepository)); // TODO: Move to Infrastucture Registry
            builder.RegisterAssemblyTypes(webAssembly, coreAssembly, infrastructureAssembly).AsImplementedInterfaces();
            IContainer applicationContainer = builder.Build();
            return new AutofacServiceProvider(applicationContainer);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            //
            app.UseAuthentication();
            //
            app.UseStaticFiles();
            app.UseSpaStaticFiles();


            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
