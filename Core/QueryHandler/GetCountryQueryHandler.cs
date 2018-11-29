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
                CountryPartionKey = item.PartitionKey,
                CountryRowKey = item.RowKey,
                CountryStatus = item.Status,
                CountryName = item.Name,
                CountryAzureStatus = item.AzureStatus,
                CountryCAPEX = item.CAPEX,
                CountryColoReady = item.ColoReady,
                CountryDCVendors = item.DCVendors,
                CountryGolocalCountry = item.GolocalCountry,
                CountryLeaseSigned = item.LeaseSigned,
                CountryTelcoVendor = item.TelcoVendor
            };

        }
    }
}
