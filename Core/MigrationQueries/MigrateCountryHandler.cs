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

namespace Core.MigrationQueries
{
    public class MigrateCountryHandler : MediatR.IRequestHandler<MigrateCountry, string>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public MigrateCountryHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(MigrateCountry request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<Country>(nameof(Country), CountryPartionKey);

            var item = await _repository.AddAll<Country>(items, nameof(Country));

            return "succeffully migrated the Country Table";
        }
    }
}
