// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Threading;
using System.Threading.Tasks;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;

namespace Core.Infrastructure
{
   public class RequestLogger<TRequest> : IRequestPreProcessor<TRequest>
   {
       private readonly ILogger _logger;

       public RequestLogger(ILogger<TRequest> logger)
       {
           _logger = logger;
       }

       public Task Process(TRequest request, CancellationToken cancellationToken)
       {
           var name = typeof(TRequest).Name;

           // TODO: Add User Details

           _logger.LogInformation("Golocal DashBoard API Request: {Name} {@Request}", name, request);

           return Task.CompletedTask;
       }
   }
}
