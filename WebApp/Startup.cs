// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using FluentValidation.AspNetCore;
using MediatR;
using MediatR.Pipeline;
using NSwag.AspNetCore;
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
