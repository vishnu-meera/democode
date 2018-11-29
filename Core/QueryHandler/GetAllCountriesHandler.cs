// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
//using Core.Exceptions;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;
namespace Core.QueryHandler
{
    public class GetAllCountriesHandler : MediatR.IRequestHandler<GetAllCountries, CountryListModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetAllCountriesHandler(IRepository repository)
        {
            _repository = repository;
        }
        public async Task<CountryListModel> Handle(GetAllCountries request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<Country>(nameof(Country), CountryPartionKey);

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), request.Id);
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), request.Id);
            }

            return new CountryListModel
            {
                Countries = items.Select(c => new CountryModel
                    {
                        CountryPartionKey = c.PartitionKey,
                        CountryRowKey = c.RowKey,
                        CountryStatus = c.Status,
                        CountryName = c.Name,
                        CountryAzureStatus = c.AzureStatus,
                        CountryCAPEX = c.CAPEX,
                        CountryColoReady = c.ColoReady,
                        CountryDCVendors = c.DCVendors,
                        CountryGolocalCountry = c.GolocalCountry,
                        CountryLeaseSigned = c.LeaseSigned,
                        CountryTelcoVendor = c.TelcoVendor
                    }).ToList()
            };

        }
    }
}
