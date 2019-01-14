// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Commands;
using Core.Exceptions;
using MediatR;

namespace Core.CommandHandler
{
    public class AddCountryHandler : IRequestHandler<AddCountry, string>
    {
        private readonly IRepository _repository;

        public AddCountryHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(AddCountry request, CancellationToken cancellationToken)
        {
            var entity = new Country
            {
                PartitionKey = request.PartitionKey,
                RowKey = request.RowKey,
                Status = request.Status,
                DCX_Customers = request.DCX_Customers,
                Name = request.Name,
                AzureStatus = request.AzureStatus,
                CAPEX = request.CAPEX,
                GolocalCountry = request.GolocalCountry,
                GDP = request.GDP,
                Population = request.Population,
                RevenueProjection3Y = request.RevenueProjection3Y,
                RevenueProjection5Y = request.RevenueProjection5Y,
                TAM_Restricted = request.TAM_Restricted,
                TAM_UNRestricted = request.TAM_UNRestricted,
                DataCenters = request.DataCenters
            };

            var item = await _repository.Add<Country>(entity, nameof(Country));

            return item;
        }
    }
}
