// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;

namespace Core.QueryHandler
{
    public class GetCountryQueryHandler : MediatR.IRequestHandler<GetCountry, CountryModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetCountryQueryHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<CountryModel> Handle(GetCountry request, CancellationToken cancellationToken)
        {
            var item = await _repository.Get<Country>(nameof(Country), CountryPartionKey, request.Name);

            if (item == null)
            {
                throw new NotFoundException(nameof(Country), request.Name);
            }

            return new CountryModel
            {
                Status = item.Status,
                DCX_Customers = item.DCX_Customers,
                Name = item.Name,
                AzureStatus = item.AzureStatus,
                CAPEX = item.CAPEX,
                GolocalCountry = item.GolocalCountry,
                GDP = item.GDP,
                Population = item.Population,
                RevenueProjection3Y = item.RevenueProjection3Y,
                RevenueProjection5Y = item.RevenueProjection5Y,
                TAM_Restricted = item.TAM_Restricted,
                TAM_UNRestricted = item.TAM_UNRestricted,
                DataCenters = item.DataCenters
            };

        }
    }
}
